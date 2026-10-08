import { whatsappUrl } from '../lib/whatsapp';
import { IconWhatsApp } from './Icons';

export function WhatsAppButton() {
  return (
    <a className="wa-float" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Pedir pelo WhatsApp da Toripizza">
      <IconWhatsApp width={30} height={30} />
      <span className="wa-float__label">Peça pelo WhatsApp</span>
    </a>
  );
}
