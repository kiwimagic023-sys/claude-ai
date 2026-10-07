import { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { IconWhatsApp } from '../components/Icons';
import { categories, products } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { whatsappUrl } from '../lib/whatsapp';

/** remove acentos para a busca encontrar "cafe" em "café" */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function MenuPage() {
  usePageMeta(
    'Cardápio | Poison Donuts',
    'Cardápio completo da Poison Donuts: donuts gigantes, mini donuts e edições especiais. Peça pelo WhatsApp com delivery ou retirada no Barra Shopping.',
    '/cardapio',
  );
  const [query, setQuery] = useState('');
  const q = fold(query.trim());

  const results = useMemo(
    () => (q ? products.filter((p) => fold([p.name, p.description, ...p.ingredients].join(' ')).includes(q)) : products),
    [q],
  );

  const goTo = (id: string) => document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div id="cardapio" className="menu-page">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="eyebrow">Cardápio completo</p>
          <h1 className="section-title">Escolha seu <span className="text-gradient">planeta</span> favorito</h1>
          <p className="section-lead">Toque em um donut para ver os detalhes. Monte seu pedido e finalize pelo WhatsApp, com delivery ou retirada no Barra Shopping.</p>
          <label className="search">
            <span className="sr-only">Buscar no cardápio</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar sabor ou ingrediente (ex.: morango, Oreo)" />
          </label>
        </div>
      </header>

      <div className="container">
        {!q && (
          <nav className="menu__tabs" aria-label="Ir para a categoria">
            {categories.map((c) => (
              <button key={c.id} className="menu__tab" onClick={() => goTo(c.id)}><span aria-hidden="true">{c.emoji}</span> {c.label}</button>
            ))}
          </nav>
        )}

        {q ? (
          <section className="menu-page__section" aria-live="polite">
            <h2 className="menu-page__title">{results.length} {results.length === 1 ? 'resultado' : 'resultados'} para “{query.trim()}”</h2>
            {results.length > 0 ? (
              <div className="menu__grid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            ) : (
              <div className="empty-card">
                <span className="empty-card__icon" aria-hidden="true">🔭</span>
                <h3>Nenhum donut encontrado</h3>
                <p>Não achamos esse sabor por aqui, mas a loja pode ter novidades do dia.</p>
                <a className="btn btn--whatsapp" href={whatsappUrl(`Olá, Poison Donuts! Vocês têm donut de ${query.trim()}?`)} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp width={20} height={20} /> Perguntar pelo WhatsApp
                </a>
              </div>
            )}
          </section>
        ) : (
          categories.map((c) => {
            const items = products.filter((p) => p.category === c.id);
            return (
              <section key={c.id} id={`cat-${c.id}`} className="menu-page__section" aria-labelledby={`cat-${c.id}-title`}>
                <h2 id={`cat-${c.id}-title`} className="menu-page__title"><span aria-hidden="true">{c.emoji}</span> {c.label} <small>{items.length || ''}</small></h2>
                {items.length > 0 ? (
                  <div className="menu__grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
                ) : (
                  <div className="empty-card empty-card--inline">
                    <p>{c.emptyMessage ?? 'Em breve novidades por aqui.'}</p>
                    <a className="btn btn--whatsapp btn--sm" href={whatsappUrl(`Olá, Poison Donuts! Quais ${c.label.toLowerCase()} vocês têm hoje?`)} target="_blank" rel="noopener noreferrer">
                      <IconWhatsApp width={18} height={18} /> Consultar
                    </a>
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
