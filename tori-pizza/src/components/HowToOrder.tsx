import { store } from '../config/site';
import { whatsappUrl } from '../lib/whatsapp';
import { IconBike, IconPhone, IconStore, IconTable, IconWhatsApp } from './Icons';

const ways = [
  { icon: IconBike, title: 'Delivery', text: 'A pizzaria entrega sem contato em Toritama. A taxa depende da distância.' },
  { icon: IconStore, title: 'Retirada', text: 'Também dá para retirar a pizza na porta da pizzaria.' },
  { icon: IconTable, title: 'No local', text: 'Venha comer a pizza saindo do forno com a família e os amigos.' },
];

export function HowToOrder() {
  return (
    <section id="atendimento" className="section order" aria-labelledby="order-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">// atendimento</p>
          <h2 id="order-title" className="section-title">Três jeitos de <em>aproveitar</em></h2>
        </header>
        <ul className="order__grid">
          {ways.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="order-card" data-reveal data-tilt style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="order-card__icon"><Icon width={28} height={28} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        <div className="order__ctas" data-reveal>
          <a className="btn btn--whatsapp btn--lg" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Fale com a gente</a>
          <a className="btn btn--ghost btn--lg" href={`tel:+${store.phoneE164}`}><IconPhone /> {store.phoneDisplay}</a>
        </div>
      </div>
    </section>
  );
}
