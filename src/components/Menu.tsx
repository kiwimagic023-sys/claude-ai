import { useMemo, useState } from 'react';
import { categories, products, type CategoryId } from '../config/site';
import { whatsappUrl } from '../lib/whatsapp';
import { linkHandler } from '../lib/router';
import { IconWhatsApp } from './Icons';
import { ProductCard } from './ProductCard';

type Filter = CategoryId | 'todos';

export function Menu() {
  const [filter, setFilter] = useState<Filter>('todos');
  const tabs = [{ id: 'todos' as Filter, label: 'Todos', emoji: '🌌' }, ...categories];
  const list = useMemo(() => (filter === 'todos' ? products : products.filter((p) => p.category === filter)), [filter]);
  const category = categories.find((c) => c.id === filter);

  return (
    <section id="cardapio" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Cardápio</p>
          <h2 id="menu-title" className="section-title">Escolha seu <span className="text-gradient">planeta</span> favorito</h2>
          <p className="section-lead">Conheça os sabores da casa. Toque em um donut para ver os detalhes. Os sabores disponíveis podem variar a cada dia.</p>
        </header>

        <div className="menu__tabs" role="tablist" aria-label="Categorias do cardápio">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={filter === t.id}
              aria-controls="menu-panel"
              className={`menu__tab ${filter === t.id ? 'is-active' : ''}`}
              onClick={() => setFilter(t.id)}
            >
              <span aria-hidden="true">{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${filter}`} className="menu__panel">
          {list.length > 0 ? (
            <div className="menu__grid" key={filter}>
              {list.map((p, i) => (
                <div key={p.id} className="menu__item" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-card">
              <span className="empty-card__icon" aria-hidden="true">{category?.emoji}</span>
              <h3>{category?.label}</h3>
              <p>{category?.emptyMessage ?? 'Em breve novidades por aqui.'}</p>
              <a className="btn btn--whatsapp" href={whatsappUrl(`Olá, Poison Donuts! Quais ${category?.label.toLowerCase()} vocês têm hoje?`)} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp width={20} height={20} /> Consultar pelo WhatsApp
              </a>
            </div>
          )}
        </div>
        <div className="menu__more">
          <a className="btn btn--ghost btn--lg" href="/cardapio" onClick={linkHandler('/cardapio')}>Ver cardápio completo</a>
        </div>
      </div>
    </section>
  );
}
