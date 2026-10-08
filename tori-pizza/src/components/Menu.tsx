import { useState } from 'react';
import { categories, products, type CategoryId } from '../config/site';
import { whatsappUrl } from '../lib/whatsapp';
import { IconWhatsApp } from './Icons';

export function Menu() {
  const [cat, setCat] = useState<CategoryId>('salgadas');
  const current = categories.find((c) => c.id === cat)!;
  const items = products.filter((p) => p.category === cat);

  return (
    <section id="cardapio" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Cardápio</p>
          <h2 id="menu-title" className="section-title">Escolha seus <em>sabores</em></h2>
          <p className="section-lead">Peça uma pizza de um sabor só ou divida em vários. Os valores e o cardápio completo do dia você recebe pelo WhatsApp.</p>
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
              <a className="btn btn--primary" href={whatsappUrl(`Olá, Toripizza! Quais são as opções de ${current.label.toLowerCase()} hoje?`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Perguntar no WhatsApp</a>
            </div>
          ) : (
            <ul className="menu__grid">
              {items.map((p) => (
                <li key={p.id} className="menu-card">
                  {p.image && <img className="menu-card__img" src={p.image} alt={`Foto de uma pizza da Toripizza com o sabor ${p.name}`} loading="lazy" decoding="async" />}
                  <div className="menu-card__body">
                    <h3>{p.name} {p.bestSeller && <span className="badge">Favorito</span>}</h3>
                    <p>{p.description}</p>
                    <ul className="chips" aria-label="Ingredientes">{p.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
                    <a className="menu-card__cta" href={whatsappUrl(`Olá, Toripizza! Quero pedir uma pizza de ${p.name}.`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp width={18} height={18} /> Pedir este sabor</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
