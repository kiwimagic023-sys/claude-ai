import { useState } from 'react';
import { products } from '../config/site';
import { formatPrice } from '../lib/format';
import { Media } from './Media';
import { AddButton } from './ProductCard';

const groups = {
  hot: { label: '🔥 Mais pedidos', items: products.filter((p) => p.bestSeller) },
  new: { label: '✨ Novidades', items: products.filter((p) => p.isNew) },
};

export function Flavors() {
  const [group, setGroup] = useState<keyof typeof groups>('hot');
  const items = groups[group].items;
  const [index, setIndex] = useState(0);
  const current = items[Math.min(index, items.length - 1)];

  const switchGroup = (g: keyof typeof groups) => { setGroup(g); setIndex(0); };

  return (
    <section id="sabores" className="section flavors" aria-labelledby="flavors-title">
      <div className="container">
        <header className="section-head section-head--row" data-reveal>
          <div>
            <p className="eyebrow">Sabores</p>
            <h2 id="flavors-title" className="section-title">Estrelas da <span className="text-gradient">casa</span></h2>
          </div>
          <div className="segmented" role="tablist" aria-label="Destaques">
            {(Object.keys(groups) as (keyof typeof groups)[]).map((g) => (
              <button key={g} role="tab" aria-selected={group === g} className={group === g ? 'is-active' : ''} onClick={() => switchGroup(g)}>
                {groups[g].label}
              </button>
            ))}
          </div>
        </header>

        {current && (
          <div className="spotlight" data-reveal style={{ ['--glaze' as string]: current.art.glaze }}>
            <div className="spotlight__visual">
              <div className="spotlight__halo" aria-hidden="true" />
              <div className="spotlight__donut" key={current.id}>
                <Media src={current.image} art={current.art} seed={current.id} alt={`Donut ${current.name}`} className="spotlight__img" />
              </div>
            </div>
            <div className="spotlight__info" key={`i-${current.id}`}>
              <span className={`tag ${group === 'hot' ? 'tag--hot' : 'tag--new'}`}>{groups[group].label}</span>
              <h3 className="spotlight__name">{current.name}</h3>
              <p className="spotlight__desc">{current.description}</p>
              <ul className="chips">{current.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
              <div className="spotlight__buy">
                <span className={`price price--lg ${current.price === null ? 'price--ask' : ''}`}>{formatPrice(current.price)}</span>
                <AddButton product={current} />
              </div>
            </div>
            <div className="spotlight__thumbs" role="tablist" aria-label="Escolher sabor">
              {items.map((p, i) => (
                <button key={p.id} role="tab" aria-selected={p.id === current.id} aria-label={p.name} className={p.id === current.id ? 'is-active' : ''} onClick={() => setIndex(i)}>
                  <Media src={p.image} art={p.art} seed={p.id} alt="" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
