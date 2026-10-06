import { useCart } from '../context/CartContext';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { IconCart, IconDonut, IconHome, IconPin, IconWhatsApp } from './Icons';

export function MobileBar() {
  const cart = useCart();
  return (
    <nav className="mobile-bar" aria-label="Atalhos">
      <button onClick={() => scrollToId('inicio')}><IconHome /><span>Início</span></button>
      <button onClick={() => scrollToId('cardapio')}><IconDonut /><span>Cardápio</span></button>
      <button className="mobile-bar__cart" onClick={cart.open} aria-label={`Carrinho, ${cart.count} ${cart.count === 1 ? 'item' : 'itens'}`}>
        <span className="mobile-bar__cart-icon">
          <IconCart />
          {cart.count > 0 && <span key={cart.bump} className="badge badge--bump">{cart.count}</span>}
        </span>
        <span>Carrinho</span>
      </button>
      <button onClick={() => scrollToId('localizacao')}><IconPin /><span>Local</span></button>
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mobile-bar__wa"><IconWhatsApp /><span>Pedir</span></a>
    </nav>
  );
}
