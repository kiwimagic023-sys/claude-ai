import { useRef } from 'react';
import { photos } from '../config/site';
import { useScrollProgress } from '../hooks/useScrollProgress';

/** pontos de "leitura" sobre a foto real (posição em % da imagem) */
const tags = [
  { x: 24, y: 22, label: 'Tomate fresco' },
  { x: 74, y: 30, label: 'Queijo derretido' },
  { x: 30, y: 60, label: 'Presunto' },
  { x: 66, y: 74, label: 'Borda dourada' },
  { x: 52, y: 47, label: 'Milho e ervilha' },
];

export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const animated = useScrollProgress(ref);
  return (
    <section ref={ref} className={`showcase ${animated ? '' : 'showcase--static'}`} aria-labelledby="showcase-title">
      <div className="showcase__sticky">
        <div className="container showcase__grid">
          <div className="showcase__text">
            <p className="eyebrow">// pizza de verdade</p>
            <h2 id="showcase-title" className="section-title">Saiu do forno <em>assim</em>.</h2>
            <p className="section-lead">Esta é uma pizza real da Toripizza, meio calabresa, meio portuguesa. Sem filtro, do jeito que chega na sua mesa.</p>
            <ul className="showcase__stats">
              <li><strong>8</strong><span>fatias</span></li>
              <li><strong>2+</strong><span>sabores por pizza</span></li>
              <li><strong>4,6★</strong><span>no Google</span></li>
            </ul>
          </div>
          <div className="showcase__visual">
            <div className="showcase__orbit" aria-hidden="true"><span /><span /><span /></div>
            <img className="showcase__pizza" src={photos.cutoutCalabresaPortuguesa} alt="Pizza da Toripizza, metade calabresa e metade portuguesa" loading="lazy" decoding="async" />
            <div className="showcase__scan" aria-hidden="true" />
            {tags.map((t, i) => (
              <span key={t.label} className="scan-tag" style={{ left: `${t.x}%`, top: `${t.y}%`, ['--i' as string]: i }} aria-hidden="true">
                <i /> {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
