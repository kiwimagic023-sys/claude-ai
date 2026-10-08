import { store } from '../config/site';
import { whatsappUrl } from '../lib/whatsapp';
import { IconBike, IconPhone, IconStore, IconTable, IconWhatsApp } from './Icons';

const ways = [
  { icon: IconBike, title: 'Delivery', text: 'Entrega sem contato. Mande o pedido e o endereço pelo WhatsApp; a taxa depende da distância.' },
  { icon: IconStore, title: 'Retirada', text: 'Peça antes e pegue na porta da pizzaria, sem esperar.' },
  { icon: IconTable, title: 'No local', text: 'Venha comer a pizza saindo do forno com a família e os amigos.' },
];

export function HowToOrder() {
  return (
    <section id="como-pedir" className="section order" aria-labelledby="order-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">// como pedir</p>
          <h2 id="order-title" className="section-title">Do jeito que for <em>melhor pra você</em></h2>
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
          <a className="btn btn--whatsapp btn--lg" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Fazer pedido no WhatsApp</a>
          <a className="btn btn--ghost btn--lg" href={`tel:+${store.phoneE164}`}><IconPhone /> {store.phoneDisplay}</a>
        </div>
      </div>
    </section>
  );
}
