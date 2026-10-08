import { store } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { IconHome, IconPhone, IconPin, IconPizza, IconWhatsApp } from './Icons';

export function MobileBar() {
  return (
    <nav className="mobile-bar" aria-label="Atalhos">
      <button onClick={() => scrollToId('inicio')}><IconHome /><span>Início</span></button>
      <a href={`tel:+${store.phoneE164}`} aria-label={`Ligar para a pizzaria: ${store.phoneDisplay}`}><IconPhone /><span>Ligar</span></a>
      <button onClick={() => scrollToId('cardapio')} className="mobile-bar__main">
        <span className="mobile-bar__main-icon"><IconPizza /></span>
        <span>Cardápio</span>
      </button>
      <button onClick={() => scrollToId('localizacao')}><IconPin /><span>Local</span></button>
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mobile-bar__wa"><IconWhatsApp /><span>Contato</span></a>
    </nav>
  );
}
