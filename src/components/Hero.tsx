import { useEffect, useRef, useState } from 'react';
import { brandLogo, heroVideo, products, store } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { Donut } from './Donut';
import { IconArrow, IconPhone, IconStar } from './Icons';
import { Starfield } from './Starfield';
import { prefersReducedMotion as reducedMotion, useScrollProgress } from '../hooks/useScrollProgress';

const flyers = ['simpson', 'kinder-bueno', 'oreo'].map((id) => products.find((p) => p.id === id)!);
const taglines = ['Donuts gigantes.', 'Recheios irresistíveis.', 'Sabores de outra galáxia.'];

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  // versão mais leve do vídeo no celular
  const [sources] = useState(() => (window.matchMedia('(max-width: 767px)').matches ? heroVideo.mobile : heroVideo.desktop));
  const [playing, setPlaying] = useState(() => !reducedMotion());
  // estrelas animadas só em telas grandes (no celular o vídeo já dá movimento e economiza bateria)
  const [stars] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  // animação ligada à rolagem (desligada para quem pediu "reduzir movimento")
  const scrolly = useScrollProgress(section, (p) => { if (section.current) section.current.dataset.past = String(p > 0.35); });

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing]);

  // pausa o vídeo quando ele sai da tela (economiza bateria e processamento)
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) v.pause();
      else if (playing) v.play().catch(() => undefined);
    });
    io.observe(v);
    return () => io.disconnect();
  }, [playing]);

  return (
    <section id="capa" ref={section} className={`hero ${scrolly ? 'hero--scrolly' : ''}`} aria-labelledby="hero-title">
      <div className="hero__sticky">
        <div className="hero__media">
          <video
            ref={video}
            className="hero__video"
            poster={heroVideo.poster}
            muted
            loop
            playsInline
            autoPlay={playing}
            preload="auto"
            aria-hidden="true"
          >
            <source src={sources.webm} type="video/webm" />
            <source src={sources.mp4} type="video/mp4" />
          </video>
          <div className="hero__shade" aria-hidden="true" />
        </div>
        {stars && <Starfield density={0.00008} />}

        {scrolly && (
          <div className="hero__flyers" aria-hidden="true">
            {flyers.map((p, i) => (
              <div key={p.id} className={`hero__flyer hero__flyer--${i + 1}`}>
                <Donut art={p.art} seed={`hero-${p.id}`} />
              </div>
            ))}
          </div>
        )}

        <div className="container hero__content">
          <img className="hero__logo" src={brandLogo.large} width={128} height={128} alt="" fetchPriority="high" />
          <p className="eyebrow hero__eyebrow">
            <span className="pulse-dot" /> Barra Shopping · Rio de Janeiro
          </p>
          <h2 id="hero-title" className="hero__brand">
            <span className="hero__brand-top">Poison</span>
            <span className="hero__brand-bottom">Donuts</span>
          </h2>
          <div className="hero__panel">
            <p className="hero__slogan">Os melhores donuts da galáxia</p>
            <p className="hero__lead">Donuts gigantes, recheios irresistíveis e sabores para deixar qualquer momento muito mais gostoso.</p>
            <div className="hero__ctas">
              <button className="btn btn--primary btn--lg" onClick={() => scrollToId('sabores')}>
                Conheça os sabores <IconArrow />
              </button>
              <button className="btn btn--ghost btn--lg" onClick={() => scrollToId('localizacao')}>Como chegar</button>
              <a className="btn btn--ghost btn--lg" href={`tel:+${store.phoneE164}`}><IconPhone width={20} height={20} /> Ligar</a>
            </div>
            <ul className="hero__stats" aria-label="Destaques">
              <li><IconStar className="star" width={18} height={18} /> <strong>{store.rating.toLocaleString('pt-BR')}</strong> <span>· {store.ratingCountLabel}</span></li>
              <li><strong>🚀 Delivery</strong> <span>e retirada</span></li>
              <li><strong>🎉 Eventos</strong> <span>e encomendas</span></li>
            </ul>
          </div>
        </div>

        {scrolly && (
          <ul className="hero__taglines" aria-hidden="true">
            {taglines.map((t, i) => <li key={t} className={`hero__tagline hero__tagline--${i + 1}`}>{t}</li>)}
          </ul>
        )}

        <button
          className="hero__toggle icon-btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5v14l12-7z" /></svg>
          )}
        </button>

        <button className="hero__scroll" onClick={() => scrollToId('por-que')} aria-label="Rolar para conhecer a Poison Donuts">
          <span />
        </button>
      </div>
    </section>
  );
}
