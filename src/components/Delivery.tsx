import { integrations, products } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { Donut } from './Donut';
import { IconArrow, IconWhatsApp } from './Icons';
import { usePedirAgora } from './Navbar';

const steps = [
  { n: '01', title: 'Escolha', text: 'Navegue pelo cardápio e adicione seus sabores.' },
  { n: '02', title: 'Envie', text: 'Finalize e mande o pedido pronto pelo WhatsApp.' },
  { n: '03', title: 'Receba', text: 'Delivery até você ou retirada no Barra Shopping.' },
];

export function Delivery() {
  const pedir = usePedirAgora();
  const platforms = integrations.deliveryPlatforms.filter((p) => p.enabled && p.url);
  const art = products.find((p) => p.id === 'ferrero-rocher')!.art;

  return (
    <section id="delivery" className="section delivery" aria-labelledby="delivery-title">
      <div className="container">
        <div className="delivery__card" data-reveal>
          <div className="delivery__copy">
            <p className="eyebrow">Delivery</p>
            <h2 id="delivery-title" className="section-title">Seu donut favorito na sua porta <span aria-hidden="true">🚀</span></h2>
            <p className="section-lead">Escolha seus sabores favoritos, monte seu pedido e receba a experiência Poison Donuts onde estiver.</p>
            <ol className="steps">
              {steps.map((s) => (
                <li key={s.n}><span className="steps__n">{s.n}</span><div><strong>{s.title}</strong><p>{s.text}</p></div></li>
              ))}
            </ol>
            <div className="delivery__ctas">
              <button className="btn btn--primary btn--lg" onClick={pedir}>Pedir delivery <IconArrow /></button>
              <button className="btn btn--ghost btn--lg" onClick={() => scrollToId('cardapio')}>Ver cardápio</button>
            </div>
            <div className="platforms">
              {platforms.length > 0 ? (
                <>
                  <span className="platforms__label">Também estamos em:</span>
                  {platforms.map((p) => (
                    <a key={p.name} className="chip-link" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                  ))}
                </>
              ) : (
                <a className="chip-link chip-link--wa" href={whatsappUrl('Olá, Poison Donuts! Vocês entregam no meu endereço?')} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp width={18} height={18} /> Consultar área de entrega
                </a>
              )}
            </div>
          </div>
          <div className="delivery__visual" aria-hidden="true">
            <div className="delivery__ring" />
            <div className="delivery__donut"><Donut art={art} seed="delivery" /></div>
            <span className="delivery__rocket">🚀</span>
          </div>
        </div>
      </div>
    </section>
  );
}
