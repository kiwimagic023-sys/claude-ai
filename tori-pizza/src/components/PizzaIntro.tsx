import { useEffect, useRef, useState } from 'react';
import { store } from '../config/site';
import { prefersReducedMotion } from '../hooks/useScrollProgress';
import { useOpenStatus } from '../hooks/useOpenStatus';
import { loadTextures, PizzaRenderer, stages, stageT } from '../lib/pizzaRenderer';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { IconPizza, IconWhatsApp } from './Icons';

/** frases que aparecem durante a montagem (uma por etapa) */
const captions = [
  { title: 'Tudo começa com a massa.', text: 'Aberta na mão, na hora do pedido.' },
  { title: 'Molho de tomate da casa.', text: 'Espalhado com calma, do centro até a borda.' },
  { title: 'Queijo sem economia.', text: 'Mussarela cobrindo cada pedaço.' },
  { title: 'Calabresa, cebola e azeitona.', text: 'O recheio que a cidade inteira conhece.' },
  { title: 'Forno bem quente.', text: 'A borda doura e o queijo derrete.' },
  { title: 'Orégano para finalizar.', text: 'O cheirinho que chega antes da pizza.' },
  { title: 'Cortada em 8 fatias.', text: 'Do jeito certo para dividir.' },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; kind: 'steam' | 'flour' | 'spark' }

export function PizzaIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const hudStep = useRef<HTMLSpanElement>(null);
  const hudName = useRef<HTMLSpanElement>(null);
  const hudPct = useRef<HTMLSpanElement>(null);
  const hudTemp = useRef<HTMLSpanElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const status = useOpenStatus();

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const fx = fxRef.current!;
    const ctx = canvas.getContext('2d')!;
    const fctx = fx.getContext('2d')!;
    let renderer: PizzaRenderer | null = null;
    let raf = 0;
    let alive = true;
    let visible = true;
    let target = reduced ? 1 : 0;
    let current = target;
    let drawn = -1;
    let spin = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999 };
    let bounce = 0;
    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      const px = Math.min(1024, Math.round(box.width * dpr));
      if (canvas.width !== px) {
        canvas.width = canvas.height = px;
        drawn = -1;
      }
      fx.width = Math.round(stage.clientWidth * Math.min(dpr, 1.5));
      fx.height = Math.round(stage.clientHeight * Math.min(dpr, 1.5));
    };

    const readScroll = () => {
      const range = section.offsetHeight - window.innerHeight;
      target = range > 0 ? clamp(-section.getBoundingClientRect().top / range) : 1;
    };

    const emit = (kind: Particle['kind'], n: number, cx: number, cy: number, spread: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * spread;
        const max = kind === 'steam' ? 2.6 + Math.random() * 1.6 : 0.9 + Math.random() * 0.8;
        particles.push({
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r * 0.7,
          vx: kind === 'steam' ? (Math.random() - 0.5) * 12 : Math.cos(a) * (60 + Math.random() * 160),
          vy: kind === 'steam' ? -18 - Math.random() * 26 : Math.sin(a) * (60 + Math.random() * 160) - 40,
          life: 0,
          max,
          size: kind === 'steam' ? 40 + Math.random() * 60 : kind === 'spark' ? 1.5 + Math.random() * 2 : 1 + Math.random() * 2.5,
          kind,
        });
      }
    };

    let last = performance.now();
    let steamAcc = 0;
    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // progresso com inércia: segue a rolagem de forma suave, sem travar
      current += (target - current) * (reduced ? 1 : 1 - Math.pow(0.0008, dt));
      if (Math.abs(target - current) < 0.0004) current = target;
      const p = current;

      // inclinação 3D seguindo o mouse/dedo
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      bounce *= 0.9;
      if (tiltRef.current) {
        const s = 1 + bounce * 0.04;
        tiltRef.current.style.transform = `rotateX(${(-pointer.y * 9).toFixed(2)}deg) rotateY(${(pointer.x * 11).toFixed(2)}deg) scale(${s.toFixed(4)})`;
        tiltRef.current.style.setProperty('--lx', `${(50 + pointer.x * 40).toFixed(1)}%`);
        tiltRef.current.style.setProperty('--ly', `${(50 + pointer.y * 40).toFixed(1)}%`);
      }

      const targetSpin = p * 0.9;
      spin += (targetSpin - spin) * 0.1;
      if (renderer && (Math.abs(drawn - p) > 0.00025 || Math.abs(spin - targetSpin) > 0.0005)) {
        renderer.render(ctx, p, spin);
        drawn = p;
      }

      // HUD
      const idx = stages.findIndex((s) => p < s.to) === -1 ? stages.length - 1 : stages.findIndex((s) => p < s.to);
      if (hudStep.current) hudStep.current.textContent = String(idx + 1).padStart(2, '0');
      if (hudName.current) hudName.current.textContent = stages[idx].label;
      if (hudPct.current) hudPct.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
      const oven = stageT(p, 4);
      const temp = Math.round(24 + 356 * clamp(oven * 1.3) - 120 * clamp((p - 0.72) / 0.28));
      if (hudTemp.current) hudTemp.current.textContent = String(temp);
      stage.style.setProperty('--oven', (Math.sin(oven * Math.PI) * 1).toFixed(3));
      stage.style.setProperty('--p', p.toFixed(4));
      stage.style.setProperty('--end', clamp((p - 0.9) / 0.08).toFixed(3));
      section.dataset.stage = stages[idx].id;

      // frases
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = stageT(p, i);
        const o = i === 0 && p < 0.02 ? 1 : clamp(Math.min(t / 0.18, (1 - t) / 0.18));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * (t < 0.5 ? 24 : -24)).toFixed(1)}px, 0)`;
        el.style.filter = o < 1 ? `blur(${((1 - o) * 8).toFixed(1)}px)` : 'none';
      });

      // partículas: vapor depois do forno, faíscas no forno
      const rect = canvas.getBoundingClientRect();
      const srect = stage.getBoundingClientRect();
      const scale = fx.width / srect.width;
      const cx = (rect.left - srect.left + rect.width / 2) * scale;
      const cy = (rect.top - srect.top + rect.height / 2) * scale;
      const R = (rect.width / 2) * scale * 0.85;
      if (visible) {
        steamAcc += dt;
        const baked = clamp((stageT(p, 4) - 0.6) / 0.4);
        if (baked > 0 && steamAcc > 0.22 && particles.length < 40) {
          emit('steam', 1, cx, cy - R * 0.2, R * 0.7);
          steamAcc = 0;
        }
        if (oven > 0.05 && oven < 0.95 && Math.random() < 0.5) emit('spark', 1, cx, cy + R * 0.9, R);
      }
      fctx.setTransform(1, 0, 0, 1, 0, 0);
      fctx.clearRect(0, 0, fx.width, fx.height);
      const ppx = pointer.px * scale;
      const ppy = pointer.py * scale;
      for (let i = particles.length - 1; i >= 0; i--) {
        const q = particles[i];
        q.life += dt;
        if (q.life > q.max) {
          particles.splice(i, 1);
          continue;
        }
        // o vapor desvia do mouse/dedo
        const dx = q.x - ppx;
        const dy = q.y - ppy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 160 * 160 * scale * scale) {
          const f = (1 - Math.sqrt(d2) / (160 * scale)) * 900 * dt;
          q.vx += (dx / Math.sqrt(d2 + 1)) * f;
          q.vy += (dy / Math.sqrt(d2 + 1)) * f;
        }
        if (q.kind !== 'steam') q.vy += 260 * dt;
        q.vx *= q.kind === 'steam' ? 0.985 : 0.97;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        const t = q.life / q.max;
        if (q.kind === 'steam') {
          const a = Math.sin(t * Math.PI) * 0.07;
          const r = q.size * scale * (0.6 + t);
          const g = fctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, r);
          g.addColorStop(0, `rgba(255, 240, 235, ${a})`);
          g.addColorStop(1, 'rgba(255, 240, 235, 0)');
          fctx.fillStyle = g;
          fctx.fillRect(q.x - r, q.y - r, r * 2, r * 2);
        } else {
          fctx.fillStyle = q.kind === 'spark' ? `rgba(255, ${120 + Math.random() * 80}, 60, ${1 - t})` : `rgba(250, 246, 236, ${(1 - t) * 0.9})`;
          fctx.beginPath();
          fctx.arc(q.x, q.y, q.size * scale, 0, Math.PI * 2);
          fctx.fill();
        }
      }

      // só continua animando enquanto há algo mudando (economiza bateria)
      const moving = Math.abs(target - current) > 0 || Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002 || bounce > 0.01 || Math.abs(spin - targetSpin) > 0.0005;
      const live = visible && (stageT(p, 4) > 0.05 || particles.length > 0);
      if (alive && (moving || live || particles.length)) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && alive) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    const onScroll = () => { readScroll(); kick(); };
    const onResize = () => { resize(); readScroll(); kick(); };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      pointer.tx = clamp((e.clientX - r.left) / r.width, 0, 1) * 2 - 1;
      pointer.ty = clamp((e.clientY - r.top) / r.height, 0, 1) * 2 - 1;
      pointer.px = e.clientX - r.left;
      pointer.py = e.clientY - r.top;
      kick();
    };
    const onLeave = () => { pointer.tx = pointer.ty = 0; pointer.px = pointer.py = -9999; };
    const onTap = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const scale = fx.width / r.width;
      bounce = 1;
      emit(current > 0.65 ? 'steam' : 'flour', current > 0.65 ? 6 : 40, (e.clientX - r.left) * scale, (e.clientY - r.top) * scale, 20 * scale);
      kick();
    };

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); });
    io.observe(stage);

    loadTextures()
      .then((tex) => {
        if (!alive) return;
        renderer = new PizzaRenderer(tex);
        resize();
        readScroll();
        if (!reduced) current = target;
        drawn = -1;
        setReady(true);
        const r = stage.getBoundingClientRect();
        emit('flour', 50, (r.width / 2) * (fx.width / r.width), (r.height / 2) * (fx.width / r.width), 60);
        kick();
      })
      .catch(() => setReady(true));

    resize();
    readScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onTap);
    kick();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onTap);
    };
  }, [reduced]);

  return (
    <section id="inicio" ref={sectionRef} className={`intro ${reduced ? 'intro--static' : ''}`} aria-labelledby="intro-title">
      <div ref={stageRef} className={`intro__stage ${ready ? 'is-ready' : ''}`}>
        <div className="intro__table" aria-hidden="true" />
        <div className="intro__grid" aria-hidden="true" />
        <div className="intro__oven" aria-hidden="true" />

        <div className="intro__pizza-wrap">
          <div ref={tiltRef} className="intro__tilt">
            <div className="intro__ring" aria-hidden="true"><span /><span /></div>
            <canvas ref={canvasRef} className="intro__canvas" role="img" aria-label="Animação: uma pizza de calabresa sendo montada e assada" />
            <div className="intro__shine" aria-hidden="true" />
          </div>
        </div>
        <canvas ref={fxRef} className="intro__fx" aria-hidden="true" />

        <div className="intro__hud intro__hud--tl" aria-hidden="true">
          <span className="hud-label">Toripizza // linha de produção</span>
          <span className="hud-big">ETAPA <span ref={hudStep}>01</span><small>/08</small></span>
          <span className="hud-tag" ref={hudName}>Massa</span>
        </div>
        <div className="intro__hud intro__hud--tr" aria-hidden="true">
          <span className="hud-label">Forno</span>
          <span className="hud-big"><span ref={hudTemp}>24</span><small>°C</small></span>
          <span className="hud-bar"><span /></span>
        </div>
        <div className="intro__hud intro__hud--bl" aria-hidden="true">
          <span className="hud-label">Progresso</span>
          <span className="hud-big"><span ref={hudPct}>000</span><small>%</small></span>
        </div>
        <ol className="intro__steps" aria-hidden="true">
          {stages.map((s) => <li key={s.id} data-id={s.id}><span>{s.label}</span></li>)}
        </ol>

        <div className="intro__captions">
          {captions.map((c, i) => (
            <div key={c.title} className="intro__caption" ref={(el) => { capRefs.current[i] = el; }} aria-hidden={i > 0}>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
            </div>
          ))}
        </div>

        <div className="intro__final">
          <span className={`status ${status.open ? 'status--open' : 'status--closed'}`}>
            <span className="status__dot" /> {status.label} <small>· {status.detail}</small>
          </span>
          <h1 id="intro-title">Toripizza</h1>
          <p>{store.slogan} Em Toritama - PE.</p>
          <div className="intro__ctas">
            <a className="btn btn--primary btn--lg" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Pedir pelo WhatsApp</a>
            <button className="btn btn--ghost btn--lg" onClick={() => scrollToId('cardapio')}><IconPizza /> Ver cardápio</button>
          </div>
        </div>

        <div className="intro__hint" aria-hidden="true"><span className="intro__mouse" /> Role para montar a pizza</div>
        {!ready && <div className="intro__loading" aria-hidden="true">Preparando o forno…</div>}
      </div>
    </section>
  );
}
