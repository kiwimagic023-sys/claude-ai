import { gallery, links } from '../config/site';
import { IconInstagram } from './Icons';

export function Gallery() {
  return (
    <section id="fotos" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Fotos</p>
          <h2 id="gallery-title" className="section-title">Dá água na <em>boca</em></h2>
        </header>
        <ul className="gallery__grid">
          {gallery.map((g, i) => (
            <li key={g.image} className={`gallery__item ${g.shape ? `gallery__item--${g.shape}` : ''}`} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
              <img src={g.image} alt={`Pizza da Toripizza: ${g.title}`} loading="lazy" decoding="async" />
              <span className="gallery__caption">{g.title}</span>
            </li>
          ))}
        </ul>
        <div className="gallery__more" data-reveal>
          <a className="btn btn--instagram btn--lg" href={links.instagram} target="_blank" rel="noopener noreferrer"><IconInstagram /> Siga {links.instagramHandle}</a>
        </div>
      </div>
    </section>
  );
}
