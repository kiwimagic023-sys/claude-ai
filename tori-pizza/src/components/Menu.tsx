import { useState } from 'react';
import { categories, products, showPrices, sizes, type CategoryId } from '../config/site';
import { whatsappUrl } from '../lib/whatsapp';
import { IconWhatsApp } from './Icons';

const money = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function Menu() {
  const [cat, setCat] = useState<CategoryId>('salgadas');
  const current = categories.find((c) => c.id === cat)!;
  const items = products.filter((p) => p.category === cat);

  return (
    <section id="cardapio" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">// cardápio</p>
          <h2 id="menu-title" className="section-title">Escolha seus <em>sabores</em>.</h2>
          <p className="section-lead">17 sabores salgados e 3 doces, em três tamanhos: pequena, média e grande. Toque em “Como é feita” para ver o preparo de cada um.</p>
        </header>

        <div className="tabs" role="tablist" aria-label="Categorias">
          {categories.map((c) => (
            <button key={c.id} role="tab" id={`tab-${c.id}`} aria-selected={cat === c.id} aria-controls="menu-panel" className={`tab ${cat === c.id ? 'is-active' : ''}`} onClick={() => setCat(c.id)}>
              <span aria-hidden="true">{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${cat}`} key={cat} className="menu__panel">
          {items.length === 0 ? (
            <div className="menu__empty">
              <p>{current.emptyMessage}</p>
              <a className="btn btn--primary" href={whatsappUrl(`Olá, Toripizza! Quais são as opções de ${current.label.toLowerCase()}?`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Perguntar no WhatsApp</a>
            </div>
          ) : (
            <ul className="menu__list">
              {items.map((p, i) => (
                <li key={p.id} className="menu-item" data-tilt style={{ animationDelay: `${i * 35}ms` }}>
                  <span className="menu-item__num" aria-hidden="true">{String(p.number).padStart(2, '0')}</span>
                  <div className="menu-item__body">
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <ul className="chips" aria-label="Ingredientes">{p.ingredients.map((x) => <li key={x}>{x}</li>)}</ul>
                    {showPrices && p.prices && (
                      <dl className="menu-item__prices">
                        {sizes.map((s, k) => <div key={s}><dt>{s}</dt><dd>{money(p.prices![k])}</dd></div>)}
                      </dl>
                    )}
                    <details className="howto">
                      <summary>Como é feita</summary>
                      <p>{p.howTo}</p>
                    </details>
                  </div>
                  {p.image && <img className="menu-item__img" src={p.image} alt={`Pizza da Toripizza com o sabor ${p.name}`} loading="lazy" decoding="async" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
