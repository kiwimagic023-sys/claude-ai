import { linkHandler } from '../lib/router';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { store } from '../config/site';
import { IconDonut, IconHome, IconPhone, IconPin, IconWhatsApp } from './Icons';

export function MobileBar() {
  return (
    <nav className="mobile-bar" aria-label="Atalhos">
      <button onClick={() => scrollToId('inicio')}><IconHome /><span>Início</span></button>
      <a href={`tel:+${store.phoneE164}`} aria-label={`Ligar para a loja: ${store.phoneDisplay}`}><IconPhone /><span>Ligar</span></a>
      <a href="/cardapio" onClick={linkHandler('/cardapio')} className="mobile-bar__main">
        <span className="mobile-bar__main-icon"><IconDonut /></span>
        <span>Sabores</span>
      </a>
      <button onClick={() => scrollToId('localizacao')}><IconPin /><span>Local</span></button>
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mobile-bar__wa"><IconWhatsApp /><span>Contato</span></a>
    </nav>
  );
}
