import { hours, timeZone } from '../config/site';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** dia da semana e minutos atuais no fuso da loja */
const nowInStore = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
};

const fmt = (hhmm: string) => {
  const [h, m] = hhmm.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
};

export interface OpenStatus {
  open: boolean;
  label: string;
  detail: string;
}

export const getOpenStatus = (date = new Date()): OpenStatus => {
  const { day, minutes } = nowInStore(date);
  const today = hours.find((h) => h.day === day);
  if (today?.open && today.close) {
    const o = toMinutes(today.open);
    const c = toMinutes(today.close);
    if (minutes >= o && minutes < c) return { open: true, label: 'Aberto', detail: `Fecha às ${fmt(today.close)}` };
    if (minutes < o) return { open: false, label: 'Fechado', detail: `Abre hoje às ${fmt(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = hours.find((h) => h.day === (day + i) % 7);
    if (next?.open) return { open: false, label: 'Fechado', detail: `Abre ${i === 1 ? 'amanhã' : next.label.toLowerCase()} às ${fmt(next.open)}` };
  }
  return { open: false, label: 'Fechado', detail: 'Consulte os horários' };
};

export const formatRange = (open: string | null, close: string | null) => (open && close ? `${fmt(open)} – ${fmt(close)}` : 'Fechado');

/** dia da semana atual no fuso da loja */
export const storeDay = () => nowInStore().day;
