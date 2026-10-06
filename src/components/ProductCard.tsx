import type { Product } from '../config/site';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { IconMinus, IconPlus } from './Icons';
import { Media } from './Media';

export function QtyControl({ id, name }: { id: string; name: string }) {
  const cart = useCart();
  const qty = cart.lines.find((l) => l.product.id === id)?.qty ?? 0;
  return (
    <div className="qty" role="group" aria-label={`Quantidade de ${name}`}>
      <button className="qty__btn" onClick={() => cart.dec(id)} aria-label={`Diminuir ${name}`}><IconMinus width={18} height={18} /></button>
      <span className="qty__value" aria-live="polite">{qty}</span>
      <button className="qty__btn" onClick={() => cart.inc(id)} aria-label={`Aumentar ${name}`}><IconPlus width={18} height={18} /></button>
    </div>
  );
}

export function ProductBadges({ product }: { product: Product }) {
  return (
    <div className="badges">
      {product.bestSeller && <span className="tag tag--hot">🔥 Mais pedidos</span>}
      {product.isNew && <span className="tag tag--new">✨ Novidade</span>}
    </div>
  );
}

export function AddButton({ product, block = false }: { product: Product; block?: boolean }) {
  const cart = useCart();
  const inCart = cart.lines.some((l) => l.product.id === product.id);
  return inCart ? (
    <QtyControl id={product.id} name={product.name} />
  ) : (
    <button className={`btn btn--primary btn--sm ${block ? 'btn--block' : ''}`} onClick={() => cart.add(product.id)}>
      <IconPlus width={18} height={18} /> Adicionar ao pedido
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card" style={{ ['--glaze' as string]: product.art.glaze }}>
      <div className="product-card__media">
        <ProductBadges product={product} />
        <Media src={product.image} art={product.art} seed={product.id} alt={`Donut ${product.name}`} className="product-card__img" />
      </div>
      <div className="product-card__body">
        <div className="product-card__head">
          <h3>{product.name}</h3>
          <span className={`price ${product.price === null ? 'price--ask' : ''}`}>{formatPrice(product.price)}</span>
        </div>
        <p className="product-card__desc">{product.description}</p>
        <ul className="chips" aria-label="Ingredientes principais">
          {product.ingredients.map((i) => <li key={i}>{i}</li>)}
        </ul>
        <div className="product-card__foot">
          <AddButton product={product} block />
        </div>
      </div>
    </article>
  );
}
