import { store, whatsappDefaultMessage } from '../config/site';

/** link do WhatsApp da loja com uma mensagem pronta */
export const whatsappUrl = (message: string = whatsappDefaultMessage): string =>
  `https://wa.me/${store.phoneE164}?text=${encodeURIComponent(message)}`;
