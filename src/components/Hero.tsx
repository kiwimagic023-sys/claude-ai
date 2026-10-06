import { useEffect, useRef } from 'react';
import { products, store } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { Donut } from './Donut';
import { IconArrow, IconStar } from './Icons';
import { usePedirAgora } from './Navbar';
import { Starfield } from './Starfield';

const byId = (id: string) => products.find((p) => p.id === id)!;

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const pedir = usePedirAgora();

  // parallax leve com o mouse (apenas desktop e sem "reduzir movimento")
  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty('--px', x.toFixed(3));
        el.style.setProperty('--py', y.toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const main = byId('kinder-bueno');
  const left = byId('simpson');
  const right = byId('morango-chantininho');
  const small = byId('oreo');

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <Starfield />
      <div className="hero__glow hero__glow--a" aria-hidden="true" />
      <div className="hero__glow hero__glow--b" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <span className="pulse-dot" /> Barra Shopping · Rio de Janeiro
          </p>
          <h1 id="hero-title" className="hero__title">
            Os melhores <span className="text-gradient">donuts</span> da galáxia
          </h1>
          <p className="hero__lead">Donuts gigantes, recheios irresistíveis e sabores para deixar qualquer momento muito mais gostoso.</p>
          <div className="hero__ctas">
            <button className="btn btn--primary btn--lg" onClick={pedir}>
              Pedir agora <IconArrow />
            </button>
            <button className="btn btn--ghost btn--lg" onClick={() => scrollToId('cardapio')}>Ver cardápio</button>
          </div>
          <ul className="hero__stats" aria-label="Destaques">
            <li>
              <strong><IconStar className="star" /> {store.rating.toLocaleString('pt-BR')}</strong>
              <span>{store.ratingCountLabel}</span>
            </li>
            <li>
              <strong>🚀 Delivery</strong>
              <span>e retirada na loja</span>
            </li>
            <li>
              <strong>🎉 Eventos</strong>
              <span>e encomendas</span>
            </li>
          </ul>
        </div>

        <div className="hero__stage" ref={stage} aria-hidden="true">
          <div className="orbit orbit--1" />
          <div className="orbit orbit--2" />
          <div className="planet planet--ring" />
          <div className="planet planet--green" />
          <div className="planet planet--blue" />
          <span className="sparkle sparkle--1">✦</span>
          <span className="sparkle sparkle--2">✦</span>
          <span className="sparkle sparkle--3">✧</span>
          <div className="float-donut float-donut--main" data-depth="1">
            <Donut art={main.art} seed={main.id} className="float-donut__svg" />
          </div>
          <div className="float-donut float-donut--left" data-depth="2">
            <Donut art={left.art} seed={left.id} className="float-donut__svg" />
          </div>
          <div className="float-donut float-donut--right" data-depth="3">
            <Donut art={right.art} seed={right.id} className="float-donut__svg" />
          </div>
          <div className="float-donut float-donut--small" data-depth="4">
            <Donut art={small.art} seed={small.id} className="float-donut__svg" />
          </div>
          <div className="hero__chip hero__chip--a">🍩 Donuts gigantes</div>
          <div className="hero__chip hero__chip--b">✨ Sabores exclusivos</div>
        </div>
      </div>

      <button className="hero__scroll" onClick={() => scrollToId('por-que')} aria-label="Rolar para conhecer a Poison Donuts">
        <span />
      </button>
    </section>
  );
}
