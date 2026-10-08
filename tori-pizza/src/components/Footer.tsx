import { links, navItems, store } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { IconInstagram, IconPhone, IconPin, IconWhatsApp } from './Icons';
import { Logo } from './Logo';

export function Footer() {
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };
  const { address } = store;
  return (
    <footer className="footer">
      <div className="footer__cta container">
        <h2>Bateu a fome? <em>Peça a sua agora.</em></h2>
        <div className="footer__cta-btns">
          <a className="btn btn--whatsapp btn--lg" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Pedir pelo WhatsApp</a>
          <a className="btn btn--ghost btn--lg" href={links.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin /> Como chegar</a>
        </div>
      </div>
      <div className="footer__grid container">
        <div className="footer__brand">
          <Logo size={80} />
          <p>{store.slogan}</p>
        </div>
        <nav aria-label="Rodapé">
          <h3>Navegue</h3>
          <ul>{navItems.map((n) => <li key={n.id}><a href={n.id === 'inicio' ? '/' : `#${n.id}`} onClick={go(n.id)}>{n.label}</a></li>)}</ul>
        </nav>
        <div>
          <h3>Contato</h3>
          <ul className="footer__contact">
            <li><a href={`tel:+${store.phoneE164}`}><IconPhone width={18} height={18} /> {store.phoneDisplay}</a></li>
            <li><a href={links.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin width={18} height={18} /> {address.street}, {address.neighborhood}, {address.city} - {address.state}</a></li>
            <li><a href={links.instagram} target="_blank" rel="noopener noreferrer"><IconInstagram width={18} height={18} /> {links.instagramHandle}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} {store.name}. Todos os direitos reservados.</p>
        <p>{address.city} - {address.state}</p>
      </div>
    </footer>
  );
}
