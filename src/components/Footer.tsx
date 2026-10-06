import { links, store } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { IconInstagram, IconPhone, IconPin, IconWhatsApp } from './Icons';
import { Logo } from './Logo';
import { whatsappUrl } from '../lib/whatsapp';

const footerLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'cardapio', label: 'Cardápio' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'localizacao', label: 'Contato' },
];

export function Footer() {
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };
  return (
    <footer className="footer">
      <div className="footer__cta container">
        <h2>Bateu vontade? <span className="text-gradient">A gente entrega.</span></h2>
        <a className="btn btn--whatsapp btn--lg" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><IconWhatsApp width={22} height={22} /> Pedir pelo WhatsApp</a>
      </div>
      <div className="footer__grid container">
        <div className="footer__brand">
          <Logo size={52} />
          <p className="footer__slogan">{store.slogan}</p>
          <p className="footer__meta">{store.segment} · {store.priceRange} por pessoa</p>
        </div>
        <nav aria-label="Rodapé">
          <h3>Navegue</h3>
          <ul>{footerLinks.map((l) => <li key={l.id}><a href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a></li>)}</ul>
        </nav>
        <div>
          <h3>Contato</h3>
          <ul className="footer__contact">
            <li><a href={`tel:+${store.phoneE164}`}><IconPhone width={18} height={18} /> {store.phoneDisplay}</a></li>
            <li><a href={links.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin width={18} height={18} /> {store.address.street} - {store.address.neighborhood}, {store.address.city} - {store.address.state}</a></li>
          </ul>
        </div>
        <div>
          <h3>Redes sociais</h3>
          <a className="footer__social" href={links.instagram} target="_blank" rel="noopener noreferrer"><IconInstagram /> {links.instagramHandle}</a>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} {store.name}. Todos os direitos reservados.</p>
        <p>Barra Shopping · Rio de Janeiro - RJ</p>
      </div>
      <div className="footer__wordmark" aria-hidden="true">POISON</div>
    </footer>
  );
}
