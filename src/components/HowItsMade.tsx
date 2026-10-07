import { useEffect, useMemo, useRef, useState } from 'react';
import { brandLogo } from '../config/site';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { rng, wavyRing } from './Donut';

const steps = [
  { icon: '🥣', title: 'Massa', text: 'Tudo começa com uma massa macia, sovada até ficar no ponto certo.' },
  { icon: '⏳', title: 'Descanso', text: 'A massa descansa e cresce, ficando leve e fofinha.' },
  { icon: '🔥', title: 'Fritura', text: 'No óleo quente, ganha aquela cor dourada por fora e maciez por dentro.' },
  { icon: '🍫', title: 'Cobertura', text: 'Chocolate, morango, caramelo… cada sabor ganha a sua cobertura.' },
  { icon: '🍯', title: 'Recheio', text: 'No centro, recheios generosos como brigadeiro branco e doce de leite.' },
  { icon: '✨', title: 'Decoração', text: 'Por fim, granulado, frutas e muita criatividade. Pronto para a galáxia!' },
];

const SPRINKLES = ['#ffd23f', '#39e991', '#3aa0ff', '#ffffff', '#a77bff', '#ff7a45'];

/**
 * Cena do donut sendo feito. Cada camada reage às variáveis CSS de etapa
 * (--s1 … --s6, calculadas a partir do progresso da rolagem --p).
 */
function DonutScene() {
  const { glaze, sprinkles, flour, bubbles } = useMemo(() => {
    const rand = rng('como-e-feito');
    return {
      glaze: wavyRing(74, 6, rand),
      sprinkles: Array.from({ length: 38 }, (_, i) => {
        const a = rand() * Math.PI * 2;
        const r = 38 + rand() * 34;
        return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a), rot: rand() * 180, c: SPRINKLES[i % SPRINKLES.length], d: rand() };
      }),
      flour: Array.from({ length: 22 }, () => ({ x: 30 + rand() * 140, y: 10 + rand() * 150, r: 0.8 + rand() * 1.8, d: rand() })),
      bubbles: Array.from({ length: 12 }, () => ({ x: 24 + rand() * 152, r: 2 + rand() * 4, d: rand() })),
    };
  }, []);

  return (
    <svg viewBox="-20 -60 240 300" className="how__svg" aria-hidden="true">
      <defs>
        <radialGradient id="how-raw" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff8e8" />
          <stop offset="1" stopColor="#ead0a0" />
        </radialGradient>
        <radialGradient id="how-fried" cx="50%" cy="50%" r="50%">
          <stop offset="0.35" stopColor="#f3c486" />
          <stop offset="0.8" stopColor="#d9934a" />
          <stop offset="1" stopColor="#8a4515" />
        </radialGradient>
        <radialGradient id="how-shine" cx="35%" cy="28%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="how-cream" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="1" stopColor="#f2d9a0" />
        </radialGradient>
        <linearGradient id="how-oil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf5a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#c27712" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="how-pan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4560" />
          <stop offset="1" stopColor="#1c1830" />
        </linearGradient>
        <linearGradient id="how-bag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d2ee" />
        </linearGradient>
      </defs>

      <ellipse className="how__shadow" cx="100" cy="196" rx="74" ry="9" />

      {/* panela de óleo (fundo) */}
      <g className="how__pan">
        <ellipse cx="100" cy="150" rx="104" ry="30" fill="url(#how-pan)" />
        <ellipse cx="100" cy="146" rx="94" ry="22" fill="url(#how-oil)" />
      </g>

      <g className="how__body">
      {/* massa crua: balança e cresce */}
      <g className="how__layer how__raw">
        <g className="how__squish">
          <circle cx="100" cy="100" r="88" fill="url(#how-raw)" />
          <ellipse cx="72" cy="66" rx="20" ry="10" fill="#fff" opacity=".45" />
        </g>
      </g>

      {/* massa frita, dourada */}
      <g className="how__layer how__fried">
        <circle cx="100" cy="100" r="88" fill="url(#how-fried)" />
      </g>

      {/* frente da panela: o óleo cobre a parte de baixo do donut */}
      <g className="how__pan how__pan--front">
        <path d="M-4 150 A104 30 0 0 0 204 150 L204 162 A104 30 0 0 1 -4 162 Z" fill="#2a2540" />
        <path d="M6 148 A94 22 0 0 0 194 148 L194 176 A94 30 0 0 1 6 176 Z" fill="url(#how-oil)" opacity=".9" />
        <rect x="200" y="140" width="34" height="9" rx="4" fill="#2a2540" />
      </g>
      <g className="how__bubbles">
        {bubbles.map((b, i) => (
          <circle key={i} className="how__bubble" cx={b.x} cy={150} r={b.r} style={{ ['--d' as string]: b.d }} />
        ))}
      </g>

      {/* fio de cobertura caindo */}
      <g className="how__stream">
        <rect x="93" y="-60" width="14" height="150" rx="7" fill="#ff6fc0" />
        <circle cx="100" cy="92" r="12" fill="#ff6fc0" />
      </g>
      <g className="how__layer how__glaze">
        <path d={glaze} fill="#ff6fc0" />
        <path d={glaze} fill="url(#how-shine)" />
      </g>

      {/* saco de confeiteiro + recheio */}
      <g className="how__bag">
        <path d="M150 -40 L210 -10 L122 82 Z" fill="url(#how-bag)" stroke="#bfb6dc" strokeWidth="2" strokeLinejoin="round" />
        <path d="M118 78 L128 86 L120 96 Z" fill="#9b91c2" />
        <path d="M168 -30 L196 -16" stroke="#ff2fb3" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="how__layer how__cream">
        <circle cx="100" cy="104" r="27" fill="rgba(0,0,0,.18)" />
        <circle cx="100" cy="100" r="26" fill="url(#how-cream)" />
        <ellipse cx="91" cy="90" rx="8" ry="4" fill="#fff" opacity=".8" />
      </g>

      {/* decoração: granulado e morangos caindo */}
      <g className="how__decor">
        {sprinkles.map((s, i) => (
          <rect key={i} className="how__sprinkle" x={s.x - 5} y={s.y - 1.6} width="10" height="3.2" rx="1.6" fill={s.c}
            transform={`rotate(${s.rot} ${s.x} ${s.y})`} style={{ ['--d' as string]: s.d }} />
        ))}
        {[[72, 62, -18], [126, 58, 22]].map(([x, y, r], i) => (
          <g key={i} className="how__berry" style={{ ['--d' as string]: i * 0.5 }}>
            <g transform={`rotate(${r} ${x} ${y})`}>
              <path d={`M${x},${y + 16} C${x - 17},${y + 2} ${x - 12},${y - 16} ${x},${y - 12} C${x + 12},${y - 16} ${x + 17},${y + 2} ${x},${y + 16}Z`} fill="#e8193c" />
              <path d={`M${x},${y + 9} C${x - 7},${y + 1} ${x - 6},${y - 8} ${x},${y - 7} C${x + 6},${y - 8} ${x + 7},${y + 1} ${x},${y + 9}Z`} fill="#ff8a9e" />
              <path d={`M${x - 8},${y - 12} Q${x},${y - 20} ${x + 8},${y - 12} Q${x},${y - 9} ${x - 8},${y - 12}Z`} fill="#2fbf5a" />
            </g>
          </g>
        ))}
      </g>

      {/* carinha que acompanha o dedo/mouse e pisca */}
      <g className="how__face">
        {[78, 122].map((x) => (
          <g key={x} className="how__eye">
            <ellipse cx={x} cy="58" rx="11" ry="13" fill="#fff" stroke="#2a1450" strokeWidth="2.5" />
            <circle className="how__pupil" cx={x} cy="60" r="5.5" fill="#2a1450" />
            <circle className="how__pupil" cx={x + 2} cy="57" r="1.8" fill="#fff" />
          </g>
        ))}
        <path className="how__mouth" d="M84 146 Q100 160 116 146" fill="none" stroke="#2a1450" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="66" cy="138" rx="8" ry="5" fill="#ff7ac8" opacity=".55" />
        <ellipse cx="134" cy="138" rx="8" ry="5" fill="#ff7ac8" opacity=".55" />
      </g>
      </g>

      {/* estrelinhas quando a pessoa toca no donut */}
      <g className="how__burst">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <circle key={i} cx="100" cy="100" r="5" fill={SPRINKLES[i % SPRINKLES.length]} style={{ ['--bx' as string]: `${Math.cos(a) * 120}px`, ['--by' as string]: `${Math.sin(a) * 120}px` }} />;
        })}
      </g>

      {/* farinha caindo na etapa da massa */}
      <g className="how__flour">
        {flour.map((f, i) => <circle key={i} className="how__flake" cx={f.x} cy={f.y} r={f.r} style={{ ['--d' as string]: f.d }} />)}
      </g>

      {/* brilhos de "pronto" */}
      <g className="how__done">
        {[[20, 30], [182, 40], [196, 150], [6, 150], [100, -30]].map(([x, y], i) => (
          <path key={i} d={`M${x},${y - 9} L${x + 3},${y - 3} L${x + 9},${y} L${x + 3},${y + 3} L${x},${y + 9} L${x - 3},${y + 3} L${x - 9},${y} L${x - 3},${y - 3}Z`} fill="#ffd23f" />
        ))}
      </g>
    </svg>
  );
}

/** `intro`: versão de abertura do site (primeira tela), com logo e nome da marca */
export function HowItsMade({ intro = false }: { intro?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const last = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const [boop, setBoop] = useState(0);
  // olhos e inclinação seguem o dedo/mouse
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
        const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.2)));
        el.style.setProperty('--ex', x.toFixed(3));
        el.style.setProperty('--ey', y.toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerdown', onMove); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    if (!boop) return;
    const t = setTimeout(() => setBoop(0), 700);
    return () => clearTimeout(t);
  }, [boop]);
  const animated = useScrollProgress(section, (p) => {
    const s = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (s !== last.current) { last.current = s; setStep(s); }
  });

  return (
    <section ref={section} id={intro ? 'inicio' : 'como-e-feito'} className={`how ${intro ? 'how--intro' : ''} ${animated ? 'how--animated' : ''}`} data-step={step} aria-labelledby="how-title">
      <div className="how__sticky container">
        <div className="how__copy">
          {intro ? (
            <>
              <img className="how__logo" src={brandLogo.large} width={96} height={96} alt="" fetchPriority="high" />
              <h1 id="how-title" className="how__brand"><span>Poison</span> <span className="text-gradient">Donuts</span></h1>
              <p className="section-lead how__lead">Os melhores donuts da galáxia. <strong>Arraste a tela</strong> e veja um donut Poison nascer.</p>
            </>
          ) : (
            <>
              <p className="eyebrow">Como é feito</p>
              <h2 id="how-title" className="section-title">Como nasce um <span className="text-gradient">donut Poison</span></h2>
            </>
          )}
          <ol className="how__steps">
            {steps.map((s, i) => (
              <li key={s.title} className={`how__step ${animated && i === step ? 'is-active' : ''} ${animated && i < step ? 'is-done' : ''}`}>
                <span className="how__icon" aria-hidden="true">{s.icon}</span>
                <div>
                  <strong><span className="how__num">{String(i + 1).padStart(2, '0')}</span> {s.title}</strong>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div ref={stage} className={`how__stage ${boop ? 'is-boop' : ''}`}>
          <div className="how__glow" aria-hidden="true" />
          <button className="how__touch" onClick={() => setBoop((b) => b + 1)} aria-label="Tocar no donut">
            <DonutScene />
          </button>
          <span className="how__ready" aria-hidden="true">Pronto! 🍩</span>
          {intro && animated && <span className="how__hint" aria-hidden="true">Arraste para cima <span className="how__hint-arrow">↓</span></span>}
          {animated && (
            <p className="how__current" aria-live="polite">
              <strong><span aria-hidden="true">{steps[step].icon}</span> {String(step + 1).padStart(2, '0')} · {steps[step].title}</strong>
              <span>{steps[step].text}</span>
            </p>
          )}
          {animated && (
            <div className="how__bar" aria-hidden="true"><span /></div>
          )}
        </div>
      </div>
    </section>
  );
}
