import { useState } from 'react';
import { integrations } from '../config/site';
import { useModal } from '../hooks/useModal';
import { whatsappUrl } from '../lib/whatsapp';
import { IconClose } from './Icons';

interface Data { name: string; phone: string; email: string; type: string; date: string; guests: string; message: string }
const empty: Data = { name: '', phone: '', email: '', type: '', date: '', guests: '', message: '' };
const today = () => new Date().toLocaleDateString('en-CA');
const TYPES = ['Festa', 'Evento corporativo', 'Aniversário', 'Casamento', 'Outro evento especial'];

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
};

const validate = (d: Data) => {
  const e: Partial<Record<keyof Data, string>> = {};
  if (d.name.trim().length < 2) e.name = 'Informe seu nome.';
  if (d.phone.replace(/\D/g, '').length < 10) e.phone = 'Informe um telefone com DDD.';
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'E-mail inválido.';
  if (!d.type) e.type = 'Escolha o tipo de evento.';
  if (!d.date) e.date = 'Informe a data.';
  else if (d.date < today()) e.date = 'Escolha uma data futura.';
  if (d.guests && (Number(d.guests) < 1 || !Number.isInteger(Number(d.guests)))) e.guests = 'Número inválido.';
  return e;
};

const toMessage = (d: Data) =>
  [
    'Olá, Poison Donuts! 🎉 Gostaria de um orçamento para evento:',
    '',
    `*Nome:* ${d.name}`,
    `*Telefone:* ${d.phone}`,
    d.email && `*E-mail:* ${d.email}`,
    `*Tipo de evento:* ${d.type}`,
    `*Data:* ${d.date.split('-').reverse().join('/')}`,
    d.guests && `*Convidados:* ${d.guests}`,
    d.message && `*Mensagem:* ${d.message}`,
  ].filter(Boolean).join('\n');

export function EventForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [data, setData] = useState<Data>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const ref = useModal<HTMLDivElement>(open, onClose);

  if (!open) return null;

  const set = (k: keyof Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = k === 'phone' ? maskPhone(e.target.value) : e.target.value;
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    if (integrations.eventFormEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(integrations.eventFormEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sent');
      } catch {
        setStatus('error');
      }
      return;
    }
    window.open(whatsappUrl(toMessage(data)), '_blank', 'noopener,noreferrer');
    setStatus('sent');
  };

  const close = () => { onClose(); setStatus('idle'); if (status === 'sent') setData(empty); };

  const field = (k: keyof Data, label: string, input: React.ReactNode) => (
    <label className="field">
      <span className="field__label">{label}</span>
      {input}
      {errors[k] && <span className="field__error" id={`err-${k}`}>{errors[k]}</span>}
    </label>
  );
  const common = (k: keyof Data) => ({ value: data[k], onChange: set(k), 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `err-${k}` : undefined });

  return (
    <div className="modal" role="presentation">
      <div className="modal__backdrop" onClick={close} />
      <div className="modal__panel" ref={ref} role="dialog" aria-modal="true" aria-labelledby="event-form-title" tabIndex={-1}>
        <button className="icon-btn modal__close" onClick={close} aria-label="Fechar formulário"><IconClose /></button>
        {status === 'sent' ? (
          <div className="form-success">
            <span aria-hidden="true">🚀</span>
            <h2 id="event-form-title">Pedido de orçamento enviado!</h2>
            <p>{integrations.eventFormEndpoint ? 'Recebemos sua solicitação e entraremos em contato em breve.' : 'Abrimos o WhatsApp com todos os detalhes. É só enviar a mensagem para nossa equipe.'}</p>
            <button className="btn btn--primary" onClick={close}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="eyebrow">Orçamento para eventos</p>
            <h2 id="event-form-title" className="modal__title">Leve a Poison para o seu evento</h2>
            <div className="form-grid">
              {field('name', 'Nome *', <input {...common('name')} autoComplete="name" />)}
              {field('phone', 'Telefone *', <input {...common('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(21) 90000-0000" />)}
              {field('email', 'E-mail', <input {...common('email')} type="email" autoComplete="email" />)}
              {field('type', 'Tipo de evento *', (
                <select {...common('type')}>
                  <option value="">Selecione…</option>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              ))}
              {field('date', 'Data *', <input {...common('date')} type="date" min={today()} />)}
              {field('guests', 'Número de convidados', <input {...common('guests')} type="number" inputMode="numeric" min={1} />)}
            </div>
            {field('message', 'Mensagem', <textarea {...common('message')} rows={3} placeholder="Conte um pouco sobre o evento, sabores desejados…" />)}
            {status === 'error' && <p className="field__error" role="alert">Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.</p>}
            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Solicitar orçamento'}
            </button>
            {!integrations.eventFormEndpoint && <p className="note note--center">Ao enviar, abriremos o WhatsApp com sua solicitação pronta.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
