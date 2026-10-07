import { categories, products } from '../config/site';
import { useCart } from '../context/CartContext';
import { useProductDialog } from '../context/ProductDialogContext';
import { useModal } from '../hooks/useModal';
import { formatPrice } from '../lib/format';
import { whatsappUrl } from '../lib/whatsapp';
import { IconCart, IconClose, IconWhatsApp } from './Icons';
import { Media } from './Media';
import { AddButton, ProductBadges } from './ProductCard';

export function ProductDialog() {
  const { product, show, hide } = useProductDialog();
  const cart = useCart();
  const ref = useModal<HTMLDivElement>(!!product, hide);
  if (!product) return null;

  const category = categories.find((c) => c.id === product.category);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  const inCart = cart.lines.some((l) => l.product.id === product.id);

  return (
    <div className="modal" role="presentation">
      <div className="modal__backdrop" onClick={hide} />
      <div className="modal__panel product-dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" tabIndex={-1} style={{ ['--glaze' as string]: product.art.glaze }}>
        <button className="icon-btn modal__close" onClick={hide} aria-label="Fechar detalhes"><IconClose /></button>
        <div className="product-dialog__media" key={product.id}>
          <ProductBadges product={product} />
          <Media src={product.image} art={product.art} seed={product.id} alt={`Donut ${product.name}`} className="product-dialog__img" eager />
        </div>
        <div className="product-dialog__body">
          <p className="eyebrow">{category?.emoji} {category?.label}</p>
          <h2 id="product-dialog-title" className="modal__title">{product.name}</h2>
          <p className="product-dialog__desc">{product.description}</p>
          <div>
            <h3 className="field__label">Ingredientes principais</h3>
            <ul className="chips">{product.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div className="product-dialog__buy">
            <span className={`price price--lg ${product.price === null ? 'price--ask' : ''}`}>{formatPrice(product.price)}</span>
            <AddButton product={product} />
          </div>
          {inCart && (
            <button className="btn btn--ghost btn--block" onClick={() => { hide(); cart.open(); }}>
              <IconCart width={20} height={20} /> Ver meu pedido
            </button>
          )}
          <a className="link-btn product-dialog__ask" href={whatsappUrl(`Olá, Poison Donuts! Vocês têm o donut ${product.name} hoje?`)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp width={16} height={16} /> Perguntar disponibilidade
          </a>
          {related.length > 0 && (
            <div className="product-dialog__related">
              <h3 className="field__label">Você também pode gostar</h3>
              <ul>
                {related.map((p) => (
                  <li key={p.id}>
                    <button onClick={() => show(p)}>
                      <Media src={p.image} art={p.art} seed={p.id} alt="" />
                      <span>{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
