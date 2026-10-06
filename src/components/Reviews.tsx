import { links, reviews, store } from '../config/site';
import { IconStar } from './Icons';

const Stars = ({ value, size = 20 }: { value: number; size?: number }) => (
  <span className="stars" role="img" aria-label={`${value.toLocaleString('pt-BR')} de 5 estrelas`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className="stars__item">
        <IconStar width={size} height={size} className="stars__bg" />
        <span className="stars__fill" style={{ width: `${Math.max(0, Math.min(1, value - i + 1)) * 100}%` }}>
          <IconStar width={size} height={size} />
        </span>
      </span>
    ))}
  </span>
);

export function Reviews() {
  return (
    <section id="avaliacoes" className="section reviews" aria-labelledby="reviews-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Avaliações</p>
          <h2 id="reviews-title" className="section-title">Quem experimenta, <span className="text-gradient">ama</span></h2>
        </header>
        <div className="rating-hero" data-reveal>
          <div className="rating-hero__score">
            <span className="rating-hero__number">{store.rating.toLocaleString('pt-BR')}</span>
            <span className="rating-hero__max">/ 5</span>
          </div>
          <div className="rating-hero__meta">
            <Stars value={store.rating} size={28} />
            <p>{store.ratingCountLabel}</p>
            <a className="btn btn--ghost btn--sm" href={links.googleReviews} target="_blank" rel="noopener noreferrer">Ver avaliações no Google</a>
          </div>
        </div>

        {reviews.length > 0 && (
          <ul className="reviews__grid">
            {reviews.map((r, i) => (
              <li key={i} className="review-card" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <Stars value={r.rating} size={16} />
                <blockquote>“{r.text}”</blockquote>
                <footer><strong>{r.author}</strong><span>{r.source}{r.date ? ` · ${r.date}` : ''}</span></footer>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
