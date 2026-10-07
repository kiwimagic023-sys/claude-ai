import type { Product } from '../config/site';
import { useProductDialog } from '../context/ProductDialogContext';
import { Media } from './Media';

export function ProductBadges({ product }: { product: Product }) {
  return (
    <span className="badges">
      {product.bestSeller && <span className="tag tag--hot">⭐ Favorito</span>}
      {product.isNew && <span className="tag tag--new">✨ Novidade</span>}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const dialog = useProductDialog();
  return (
    <article className="product-card" style={{ ['--glaze' as string]: product.art.glaze }}>
      <div className="product-card__media">
        <ProductBadges product={product} />
        <Media src={product.image} art={product.art} seed={product.id} alt={`Donut ${product.name}`} className="product-card__img" />
        <button className="product-card__open" onClick={() => dialog.show(product)} aria-label={`Ver detalhes de ${product.name}`}>
          <span className="product-card__zoom">Ver detalhes</span>
        </button>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name"><button className="product-card__title" onClick={() => dialog.show(product)}>{product.name}</button></h3>
        <p className="product-card__desc">{product.description}</p>
        <ul className="chips" aria-label="Ingredientes principais">
          {product.ingredients.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </div>
    </article>
  );
}
