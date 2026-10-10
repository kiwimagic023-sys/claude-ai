import './styles/index.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pickFrameSet, FrameSequence } from './modules/frames';
import { runLoader } from './modules/loader';
import { initHero } from './modules/hero';
import { ParticleField } from './modules/fx';
import { initNav } from './modules/nav';
import { initMenu } from './modules/menu';
import { initReveals } from './modules/reveal';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const html = document.documentElement;
html.classList.add('js', 'is-loading');

// sempre começa no topo (o hero é pinado e depende da posição inicial)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ?perf na URL imprime o tempo de cada fase de inicialização no console
const perf = location.search.includes('perf');
const t0 = performance.now();
const mark = (label: string): void => {
  if (perf) console.info(`[perf] ${label}: ${(performance.now() - t0).toFixed(0)}ms`);
};

async function boot(): Promise<void> {
  // 1) começa a baixar os frames do hero e monta a página
  const seq = new FrameSequence(pickFrameSet());
  seq.start();

  mark('início');
  initMenu(reduceMotion);
  mark('menu');
  initNav();
  mark('nav');
  const hero = initHero(seq, reduceMotion);
  mark('hero');

  // 2) abertura (termina quando há frames, fontes e o tempo mínimo)
  await runLoader({ seq, fontsReady: document.fonts?.ready ?? Promise.resolve(), reduceMotion });
  mark('abertura concluída');

  // 3) entrada do hero e, logo depois, fumaça e partículas globais
  hero.intro();
  if (!reduceMotion) {
    window.setTimeout(() => {
      const small = window.matchMedia('(max-width: 767px)').matches;
      const fx = new ParticleField({
        canvas: document.getElementById('fx') as HTMLCanvasElement,
        dust: small ? 30 : 78,
        smoke: small ? 3 : 8,
        scale: small ? 0.6 : 1,
      });
      fx.start();
      hero.attachFx(fx);
    }, 700);
  }
  initReveals(reduceMotion);

  // 4) o endereço pode pedir uma seção específica (ex.: /#cardapio)
  ScrollTrigger.refresh();
  if (location.hash) {
    const target = document.querySelector(location.hash);
    target?.scrollIntoView();
  }
}

boot().catch((error) => {
  // nunca deixa o visitante preso na abertura
  console.error(error);
  document.getElementById('loader')?.remove();
  html.classList.remove('is-loading', 'loader-active');
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-in'));
});

