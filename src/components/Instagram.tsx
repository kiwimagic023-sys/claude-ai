import { instagramPosts, links } from '../config/site';
import { IconInstagram } from './Icons';
import { Media } from './Media';

export function Instagram() {
  return (
    <section id="instagram" className="section instagram" aria-labelledby="ig-title">
      <div className="container">
        <header className="section-head section-head--row" data-reveal>
          <div>
            <p className="eyebrow">{links.instagramHandle}</p>
            <h2 id="ig-title" className="section-title">Siga a <span className="text-gradient">Poison Donuts</span></h2>
          </div>
          <a className="btn btn--instagram" href={links.instagram} target="_blank" rel="noopener noreferrer">
            <IconInstagram /> Seguir no Instagram
          </a>
        </header>
        <ul className="ig-grid">
          {instagramPosts.map((p, i) => (
            <li key={p.id} data-reveal style={{ transitionDelay: `${i * 60}ms`, ['--glaze' as string]: p.art.glaze }}>
              <a href={p.url ?? links.instagram} target="_blank" rel="noopener noreferrer" className="ig-tile" aria-label={`${p.caption} no Instagram`}>
                <Media src={p.image} art={p.art} seed={`ig-${p.id}`} alt={p.caption} className="ig-tile__media" />
                <span className="ig-tile__overlay"><IconInstagram width={28} height={28} /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
