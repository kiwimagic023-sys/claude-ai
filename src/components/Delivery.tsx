import { integrations, links, products } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { Donut } from './Donut';
import { IconPin, IconWhatsApp } from './Icons';

const ways = [
  { icon: '🏬', title: 'Na loja', text: 'Venha ao Barra Shopping escolher seus sabores no balcão e aproveitar na hora.' },
  { icon: '🛍️', title: 'Para levar', text: 'Leve seus donuts favoritos para casa, para o trabalho ou para presentear alguém.' },
  { icon: '🚀', title: 'Delivery', text: 'A experiência Poison Donuts também chega até você, onde estiver.' },
  { icon: '🎉', title: 'Eventos e encomendas', text: 'Donuts para festas, empresas e datas especiais.' },
];

export function Delivery() {
  const platforms = integrations.deliveryPlatforms.filter((p) => p.enabled && p.url);
  const art = products.find((p) => p.id === 'ferrero-rocher')!.art;

  return (
    <section id="delivery" className="section delivery" aria-labelledby="delivery-title">
      <div className="container">
        <div className="delivery__card" data-reveal>
          <div className="delivery__copy">
            <p className="eyebrow">Delivery e muito mais</p>
            <h2 id="delivery-title" className="section-title">Seu donut favorito na sua porta <span aria-hidden="true">🚀</span></h2>
            <p className="section-lead">Na loja, para levar ou em casa: a Poison Donuts tem um jeito para cada momento.</p>
            <ul className="ways">
              {ways.map((w) => (
                <li key={w.title}>
                  <span className="ways__icon" aria-hidden="true">{w.icon}</span>
                  <div><strong>{w.title}</strong><p>{w.text}</p></div>
                </li>
              ))}
            </ul>
            <div className="delivery__ctas">
              <a className="btn btn--primary btn--lg" href={links.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin width={20} height={20} /> Como chegar</a>
              <button className="btn btn--ghost btn--lg" onClick={() => scrollToId('cardapio')}>Ver sabores</button>
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
                <a className="chip-link chip-link--wa" href={whatsappUrl('Olá, Poison Donuts! Como funciona o delivery de vocês?')} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp width={18} height={18} /> Saiba como funciona o delivery
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
