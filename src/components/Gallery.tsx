import { useCallback, useEffect, useState } from 'react';
import { gallery } from '../config/site';
import { useModal } from '../hooks/useModal';
import { IconArrow, IconChevron, IconClose } from './Icons';
import { Media } from './Media';

const tags = ['Todos', ...Array.from(new Set(gallery.map((g) => g.tag)))];

export function Gallery() {
  const [tag, setTag] = useState('Todos');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = tag === 'Todos' ? gallery : gallery.filter((g) => g.tag === tag);
  const close = useCallback(() => setOpenIndex(null), []);
  const ref = useModal<HTMLDivElement>(openIndex !== null, close);

  const step = useCallback((d: number) => setOpenIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openIndex, step]);

  const current = openIndex !== null ? items[openIndex] : null;

  return (
    <section id="galeria" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Galeria</p>
          <h2 id="gallery-title" className="section-title">Um universo de <span className="text-gradient">sabor</span></h2>
        </header>
        <div className="pills" role="group" aria-label="Filtrar galeria">
          {tags.map((t) => (
            <button key={t} className={`pill ${tag === t ? 'is-active' : ''}`} aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>
          ))}
        </div>
        <div className="masonry">
          {items.map((g, i) => (
            <button key={g.id} className={`masonry__item shape-${g.shape ?? 'square'}`} onClick={() => setOpenIndex(i)} aria-label={`Ampliar: ${g.title}`} style={{ ['--glaze' as string]: g.art?.glaze ?? '#7b2ff7' }}>
              <Media src={g.image} art={g.art} seed={g.id} alt={g.title} className="masonry__media" />
              <span className="masonry__caption"><small>{g.tag}</small>{g.title}</span>
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div className="lightbox" role="presentation">
          <div className="lightbox__backdrop" onClick={close} />
          <div className="lightbox__panel" ref={ref} role="dialog" aria-modal="true" aria-label={current.title} tabIndex={-1}>
            <button className="icon-btn lightbox__close" onClick={close} aria-label="Fechar"><IconClose /></button>
            <figure style={{ ['--glaze' as string]: current.art?.glaze ?? '#7b2ff7' }}>
              <div className="lightbox__media" key={current.id}>
                <Media src={current.image} art={current.art} seed={current.id} alt={current.title} eager />
              </div>
              <figcaption><small>{current.tag}</small> {current.title} <span className="lightbox__count">{(openIndex ?? 0) + 1} / {items.length}</span></figcaption>
            </figure>
            {items.length > 1 && (
              <>
                <button className="icon-btn lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Anterior"><IconChevron /></button>
                <button className="icon-btn lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Próxima"><IconArrow /></button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
