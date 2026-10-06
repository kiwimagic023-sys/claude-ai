import { store, whatsappDefaultMessage } from '../config/site';
import { formatPrice } from './format';
import type { CartLine } from '../context/CartContext';

export const whatsappUrl = (message: string = whatsappDefaultMessage): string =>
  `https://wa.me/${store.phoneE164}?text=${encodeURIComponent(message)}`;

export interface OrderDetails {
  name?: string;
  mode?: 'delivery' | 'retirada';
  address?: string;
  notes?: string;
}

export const buildOrderMessage = (lines: CartLine[], total: number, hasUnpriced: boolean, details: OrderDetails = {}): string => {
  const rows = lines.map((l) => {
    const unit = formatPrice(l.product.price);
    const sub = l.product.price === null ? 'a confirmar' : formatPrice(l.product.price * l.qty);
    return `• ${l.qty}x ${l.product.name} (${unit} un.) — ${sub}`;
  });
  const parts = ['Olá, Poison Donuts! 🍩 Gostaria de fazer um pedido:', '', ...rows, ''];
  parts.push(hasUnpriced ? `*Total parcial:* ${formatPrice(total)} + itens a confirmar` : `*Total:* ${formatPrice(total)}`);
  if (details.name) parts.push(`*Nome:* ${details.name}`);
  if (details.mode) parts.push(`*Entrega:* ${details.mode === 'delivery' ? 'Delivery' : 'Retirada na loja'}`);
  if (details.mode === 'delivery' && details.address) parts.push(`*Endereço:* ${details.address}`);
  if (details.notes) parts.push(`*Observações:* ${details.notes}`);
  return parts.join('\n');
};
