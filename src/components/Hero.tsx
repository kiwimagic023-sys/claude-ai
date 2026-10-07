import { useEffect, useRef, useState } from 'react';
import { heroVideo, store } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { IconArrow, IconStar } from './Icons';
import { usePedirAgora } from './Navbar';
import { Starfield } from './Starfield';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const pedir = usePedirAgora();
  // versão mais leve do vídeo no celular
  const [sources] = useState(() => (window.matchMedia('(max-width: 767px)').matches ? heroVideo.mobile : heroVideo.desktop));
  const [playing, setPlaying] = useState(() => !reducedMotion());

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
    <section id="inicio" className="hero" aria-labelledby="hero-title">
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
      <Starfield density={0.00008} />

      <div className="container hero__content">
        <p className="eyebrow hero__eyebrow">
          <span className="pulse-dot" /> Barra Shopping · Rio de Janeiro
        </p>
        <h1 id="hero-title" className="hero__brand">
          <span className="hero__brand-top">Poison</span>
          <span className="hero__brand-bottom">Donuts</span>
        </h1>
        <div className="hero__panel">
        <p className="hero__slogan">Os melhores donuts da galáxia</p>
        <p className="hero__lead">Donuts gigantes, recheios irresistíveis e sabores para deixar qualquer momento muito mais gostoso.</p>
        <div className="hero__ctas">
          <button className="btn btn--primary btn--lg" onClick={pedir}>
            Pedir agora <IconArrow />
          </button>
          <button className="btn btn--ghost btn--lg" onClick={() => scrollToId('cardapio')}>Ver cardápio</button>
        </div>
        <ul className="hero__stats" aria-label="Destaques">
          <li><IconStar className="star" width={18} height={18} /> <strong>{store.rating.toLocaleString('pt-BR')}</strong> <span>· {store.ratingCountLabel}</span></li>
          <li><strong>🚀 Delivery</strong> <span>e retirada</span></li>
          <li><strong>🎉 Eventos</strong> <span>e encomendas</span></li>
        </ul>
        </div>
      </div>

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
    </section>
  );
}
