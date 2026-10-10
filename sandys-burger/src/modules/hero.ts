// Hero: sequência de frames desenhada em <canvas>, sincronizada com o scroll (GSAP + ScrollTrigger).
// A seção fica "pinada" por ~400vh; os textos da esquerda trocam em etapas com um glitch neon sutil,
// o hambúrguer inclina em 3D seguindo o mouse/toque e a cena termina com um pulso de luz rosa.
import gsap from 'gsap';
import { frames as framesConfig } from '../config';
import type { FrameSequence } from './frames';
import type { ParticleField } from './fx';

/** Em que ponto do scroll (0..1) cada etapa de texto entra. */
const STEP_AT = [0, 0.16, 0.45, 0.74];

const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Mesma curva usada na renderização: quão "explodido" está o hambúrguer em t. */
const explosion = (t: number): number => smoothstep(0.04, 0.34, t) * (1 - smoothstep(0.6, 0.9, t));

export interface Hero {
  /** entrada suave depois da abertura */
  intro(): void;
  attachFx(fx: ParticleField): void;
}

export function initHero(seq: FrameSequence, reduceMotion: boolean): Hero {
  const section = document.querySelector<HTMLElement>('#inicio')!;
  const stage = section.querySelector<HTMLElement>('.hero__stage')!;
  const canvas = section.querySelector<HTMLCanvasElement>('.hero__canvas')!;
  const tilt = section.querySelector<HTMLElement>('[data-tilt]')!;
  const ring = section.querySelector<HTMLElement>('.hero__ring')!;
  const seal = section.querySelector<HTMLElement>('.seal')!;
  const pulse = section.querySelector<HTMLElement>('.hero__pulse')!;
  const hint = section.querySelector<HTMLElement>('.hero__scroll');
  const steps = Array.from(section.querySelectorAll<HTMLElement>('.step'));
  const ticks = Array.from(section.querySelectorAll<HTMLElement>('.hero__ticks i'));
  const counter = section.querySelector<HTMLElement>('.hero__count b');

  const ctx = canvas.getContext('2d', { alpha: true })!;
  canvas.width = seq.width;
  canvas.height = seq.height;
  if (framesConfig.blend === 'screen') canvas.style.mixBlendMode = 'screen';

  let fx: ParticleField | undefined;
  let want = 0;
  let shown = -1;
  let current = 0;
  let pulsed = false;

  // ---------- desenho do frame ----------
  let shownExact = false;
  const paint = (force = false): void => {
    const index = Math.max(0, Math.min(seq.count - 1, Math.round(want)));
    if (index === shown && shownExact && !force) return;
    const img = seq.nearest(index);
    if (!img) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    shown = index;
    shownExact = img === seq.nearest(index) && seq.has(index);
  };

  // quando chega o frame que está faltando na tela, redesenha (e só nesse caso)
  let repaintQueued = false;
  seq.onFrame = (index) => {
    if (shownExact || repaintQueued || index !== Math.max(0, Math.min(seq.count - 1, Math.round(want)))) return;
    repaintQueued = true;
    requestAnimationFrame(() => {
      repaintQueued = false;
      paint(true);
    });
  };

  // ---------- etapas de texto ----------
  const setStep = (i: number): void => {
    if (i === current) return;
    const prev = steps[current];
    const next = steps[i];
    prev.classList.remove('is-active', 'is-glitch');
    prev.setAttribute('aria-hidden', 'true');
    next.classList.add('is-active');
    next.removeAttribute('aria-hidden');
    if (!reduceMotion) {
      next.classList.add('is-glitch');
      window.setTimeout(() => next.classList.remove('is-glitch'), 620);
    }
    ticks.forEach((tick, k) => tick.classList.toggle('is-on', k === i));
    if (counter) counter.textContent = String(i + 1).padStart(2, '0');
    current = i;
  };

  // ---------- progresso do scroll ----------
  const onProgress = (t: number): void => {
    want = t * (seq.count - 1);
    paint();

    let step = 0;
    STEP_AT.forEach((at, i) => {
      if (t >= at) step = i;
    });
    setStep(step);

    if (fx) {
      fx.burn = explosion(t);
      const r = stage.getBoundingClientRect();
      fx.anchor.x = r.left + r.width / 2;
      fx.anchor.y = r.top + r.height / 2;
    }

    hint?.classList.toggle('is-hidden', t > 0.015);

    // pulso de luz rosa quando o hambúrguer fecha de novo
    if (t > 0.93 && !pulsed) {
      pulsed = true;
      pulse.classList.remove('is-on');
      void pulse.offsetWidth;
      pulse.classList.add('is-on');
      fx?.burst(stage.getBoundingClientRect().left + stage.offsetWidth / 2, stage.getBoundingClientRect().top + stage.offsetHeight / 2, 34);
    } else if (t < 0.85) {
      pulsed = false;
    }
  };

  if (reduceMotion) {
    // sem pin nem animação: mostra o hambúrguer montado e a primeira etapa
    want = 0;
    paint(true);
  } else {
    const proxy = { frame: 0 };
    gsap.to(proxy, {
      frame: seq.count - 1,
      ease: 'none',
      snap: { frame: 1 },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: () => onProgress(proxy.frame / (seq.count - 1)),
    });
  }

  // ---------- inclinação 3D com mouse/toque ----------
  if (!reduceMotion) {
    gsap.set(tilt, { transformPerspective: 1200, transformOrigin: '50% 55%' });
    const rotX = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' });
    const rotY = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' });
    const sealX = gsap.quickTo(seal, 'x', { duration: 1.2, ease: 'power3.out' });
    const sealY = gsap.quickTo(seal, 'y', { duration: 1.2, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 1.4, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 1.4, ease: 'power3.out' });

    const aim = (clientX: number, clientY: number): void => {
      const nx = Math.max(-1, Math.min(1, (clientX / window.innerWidth - 0.5) * 2));
      const ny = Math.max(-1, Math.min(1, (clientY / window.innerHeight - 0.5) * 2));
      rotY(nx * 15);
      rotX(-ny * 9);
      sealX(nx * -16);
      sealY(ny * -12);
      ringX(nx * 10);
      ringY(ny * 8);
    };
    const rest = (): void => aim(window.innerWidth / 2, window.innerHeight / 2);

    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'touch') aim(e.clientX, e.clientY);
      },
      { passive: true },
    );
    window.addEventListener(
      'touchmove',
      (e) => {
        const t = e.touches[0];
        if (t) aim(t.clientX, t.clientY);
      },
      { passive: true },
    );
    window.addEventListener('touchend', rest, { passive: true });
    document.addEventListener('mouseleave', rest);
  }

  // estado inicial (escondido atrás da abertura)
  const firstParts = Array.from(steps[0].querySelectorAll<HTMLElement>('.eyebrow, .line, .lead, .cta, .proof'));
  if (!reduceMotion) gsap.set([canvas, seal, ring], { opacity: 0 });

  paint(true);

  return {
    attachFx(instance) {
      fx = instance;
    },
    intro() {
      if (reduceMotion) return;
      // o texto já está pintado por trás da abertura (bom para o carregamento): só desliza para o lugar
      gsap.fromTo(firstParts, { y: 38 }, { y: 0, duration: 1.05, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' });
      gsap.fromTo(canvas, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out', clearProps: 'transform,opacity' });
      gsap.fromTo(ring, { opacity: 0 }, { opacity: 0.55, duration: 1.6, delay: 0.2, ease: 'power2.out', clearProps: 'opacity' });
      gsap.fromTo(seal, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.9, delay: 0.7, ease: 'back.out(1.7)', clearProps: 'opacity' });
    },
  };
}
