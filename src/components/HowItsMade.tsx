import { useMemo, useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { rng, wavyRing } from './Donut';

const steps = [
  { icon: '🥣', title: 'Massa', text: 'Tudo começa com uma massa macia, sovada até ficar no ponto certo.' },
  { icon: '⏳', title: 'Descanso', text: 'A massa descansa e cresce, ficando leve e fofinha.' },
  { icon: '🔥', title: 'Fritura', text: 'Na fritura, ganha aquela cor dourada por fora e maciez por dentro.' },
  { icon: '🍫', title: 'Cobertura', text: 'Chocolate, morango, caramelo… cada sabor ganha a sua cobertura.' },
  { icon: '🍯', title: 'Recheio', text: 'No centro, recheios generosos como brigadeiro branco e doce de leite.' },
  { icon: '✨', title: 'Decoração', text: 'Por fim, granulado, frutas, lascas e muita criatividade. Pronto para a galáxia!' },
];

const SPRINKLES = ['#ffd23f', '#39e991', '#3aa0ff', '#ffffff', '#a77bff', '#ff7a45'];

/** ilustração do donut sendo montado: cada camada aparece numa etapa da rolagem */
function BuildingDonut() {
  const { glaze, sprinkles } = useMemo(() => {
    const rand = rng('como-e-feito');
    return {
      glaze: wavyRing(74, 6, rand),
      sprinkles: Array.from({ length: 34 }, (_, i) => {
        const a = rand() * Math.PI * 2;
        const r = 40 + rand() * 32;
        return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a), rot: rand() * 180, c: SPRINKLES[i % SPRINKLES.length], d: rand() };
      }),
    };
  }, []);

  return (
    <svg viewBox="0 0 200 200" className="how__svg" aria-hidden="true">
      <defs>
        <radialGradient id="how-raw" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff6e0" />
          <stop offset="1" stopColor="#ecd3a4" />
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
      </defs>
      <ellipse className="how__shadow" cx="100" cy="186" rx="70" ry="8" />
      <g className="how__layer how__raw"><circle cx="100" cy="100" r="88" fill="url(#how-raw)" /></g>
      <g className="how__layer how__fried">
        <circle cx="100" cy="100" r="88" fill="url(#how-fried)" />
      </g>
      <g className="how__bubbles">
        {[[50, 60], [150, 70], [40, 140], [160, 140], [100, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4 + (i % 3) * 2} />)}
      </g>
      <g className="how__layer how__glaze">
        <path d={glaze} fill="#ff6fc0" />
        <path d={glaze} fill="url(#how-shine)" />
      </g>
      <g className="how__layer how__cream">
        <circle cx="100" cy="104" r="27" fill="rgba(0,0,0,.18)" />
        <circle cx="100" cy="100" r="26" fill="url(#how-cream)" />
        <ellipse cx="91" cy="90" rx="8" ry="4" fill="#fff" opacity=".8" />
      </g>
      <g className="how__decor">
        {sprinkles.map((s, i) => (
          <rect key={i} className="how__sprinkle" x={s.x - 5} y={s.y - 1.6} width="10" height="3.2" rx="1.6" fill={s.c}
            transform={`rotate(${s.rot} ${s.x} ${s.y})`} style={{ ['--d' as string]: s.d }} />
        ))}
      </g>
    </svg>
  );
}

export function HowItsMade() {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const last = useRef(0);
  const animated = useScrollProgress(section, (p) => {
    const s = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (s !== last.current) { last.current = s; setStep(s); }
  });

  return (
    <section ref={section} id="como-e-feito" className={`how ${animated ? 'how--animated' : ''}`} aria-labelledby="how-title">
      <div className="how__sticky container">
        <div className="how__copy">
          <p className="eyebrow">Como é feito</p>
          <h2 id="how-title" className="section-title">Como nasce um <span className="text-gradient">donut Poison</span></h2>
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
        <div className="how__stage">
          <div className="how__glow" aria-hidden="true" />
          <BuildingDonut />
          {animated && (
            <p className="how__current" aria-live="polite">
              <strong><span aria-hidden="true">{steps[step].icon}</span> {String(step + 1).padStart(2, '0')} · {steps[step].title}</strong>
              <span>{steps[step].text}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
