// Abertura: letreiro de neon (S') que pisca duas vezes e fica aceso, barra de progresso dos frames
// do hero e uma tela que se abre com linhas de luz. Dura cerca de 2,5 s com tudo em cache.
import gsap from 'gsap';
import type { FrameSequence } from './frames';

interface LoaderOptions {
  seq: FrameSequence;
  fontsReady: Promise<unknown>;
  reduceMotion: boolean;
}

const MIN_MS = 1700; // tempo mínimo com o letreiro aceso antes de abrir
const MAX_MS = 9000; // limite: abre mesmo que a conexão esteja lenta
const READY_RATIO = 0.6; // fração dos frames necessária para abrir

export function runLoader({ seq, fontsReady, reduceMotion }: LoaderOptions): Promise<void> {
  const root = document.getElementById('loader');
  const html = document.documentElement;
  if (!root) {
    html.classList.remove('is-loading');
    return Promise.resolve();
  }
  const el = {
    top: root.querySelector<HTMLElement>('.loader__panel--top')!,
    bottom: root.querySelector<HTMLElement>('.loader__panel--bottom')!,
    dust: root.querySelector<HTMLElement>('.loader__dust')!,
    beam: root.querySelector<HTMLElement>('.loader__beam')!,
    lines: Array.from(root.querySelectorAll<HTMLElement>('.loader__lines i')),
    center: root.querySelector<HTMLElement>('.loader__center')!,
    on: root.querySelector<HTMLElement>('.loader__logo-on')!,
    hint: root.querySelector<HTMLElement>('.loader__hint')!,
    bar: root.querySelector<HTMLElement>('.loader__bar span')!,
  };

  html.classList.add('loader-active');

  // partículas rosa no fundo preto (CSS puro)
  const dots = document.createDocumentFragment();
  const total = window.matchMedia('(max-width: 767px)').matches ? 22 : 36;
  for (let n = 0; n < total; n++) {
    const dot = document.createElement('i');
    dot.style.cssText = `--x:${(Math.random() * 100).toFixed(1)}%;--s:${(1.5 + Math.random() * 2.5).toFixed(1)}px;--t:${(5 + Math.random() * 6).toFixed(1)}s;--d:-${(Math.random() * 8).toFixed(1)}s`;
    dots.appendChild(dot);
  }
  el.dust.appendChild(dots);

  return new Promise<void>((resolve) => {
    const started = performance.now();
    let shown = 0;
    let opened = false;

    // letreiro: apagado -> pisca -> apagado -> pisca -> fica aceso
    const sign = gsap.timeline({ defaults: { ease: 'none' } });
    if (reduceMotion) {
      sign.set(el.on, { opacity: 1 });
    } else {
      sign
        .to(el.on, { opacity: 1, duration: 0.05 }, 0.35)
        .to(el.on, { opacity: 0.1, duration: 0.05 }, 0.55)
        .to(el.on, { opacity: 1, duration: 0.05 }, 0.72)
        .to(el.on, { opacity: 0.12, duration: 0.05 }, 0.92)
        .to(el.on, { opacity: 1, duration: 0.08 }, 1.08)
        .to(el.on, { opacity: 0.93, duration: 0.09, repeat: 3, yoyo: true }, 1.4); // zumbido sutil
    }
    gsap.fromTo(el.hint, { opacity: 0, y: 8 }, { opacity: 0.9, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });

    // barra de progresso (a suavização fica por conta da transição CSS; nunca anda para trás)
    const updateBar = (): void => {
      const elapsed = performance.now() - started;
      const target = Math.min(seq.ratio / READY_RATIO, elapsed / (MIN_MS * 0.92), 1);
      shown = Math.max(shown, target);
      el.bar.style.transform = `scaleX(${shown.toFixed(3)})`;
    };
    const barTimer = window.setInterval(updateBar, 90);
    updateBar();

    const open = (): void => {
      if (opened) return;
      opened = true;
      window.clearInterval(barTimer);
      el.bar.style.transform = 'scaleX(1)';

      const done = (): void => {
        sign.kill();
        root.remove();
        html.classList.remove('is-loading', 'loader-active');
        resolve();
      };

      if (reduceMotion) {
        gsap.to(root, { opacity: 0, duration: 0.4, onComplete: done });
        return;
      }

      // a tela abre: feixe de luz, linhas e as duas metades se afastam
      const t = gsap.timeline({ onComplete: done });
      t.to(el.center, { scale: 1.08, duration: 0.4, ease: 'power2.out' }, 0)
        .to(el.beam, { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' }, 0.05)
        .to(el.lines, { opacity: 1, scaleX: 1, duration: 0.55, stagger: 0.045, ease: 'power3.out' }, 0.12)
        .to(el.center, { opacity: 0, scale: 1.3, duration: 0.4, ease: 'power2.in' }, 0.32)
        .to(el.dust, { opacity: 0, duration: 0.4 }, 0.4)
        .to(el.top, { yPercent: -101, duration: 0.85, ease: 'power4.inOut' }, 0.48)
        .to(el.bottom, { yPercent: 101, duration: 0.85, ease: 'power4.inOut' }, 0.48)
        .to([el.beam, ...el.lines], { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.7);
    };

    // abre quando: tempo mínimo + fontes + frames suficientes (ou tempo máximo)
    const minTime = new Promise<void>((r) => window.setTimeout(r, MIN_MS));
    const cap = new Promise<void>((r) => window.setTimeout(r, MAX_MS));
    Promise.race([Promise.all([minTime, fontsReady, seq.waitFor(READY_RATIO)]), cap]).then(open);
  });
}
