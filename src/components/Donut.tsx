import { memo, useId, type ReactElement } from 'react';
import type { DonutArt } from '../config/site';

/** gerador pseudo-aleatório determinístico: o mesmo `seed` sempre desenha o mesmo donut */
export const rng = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const C = 100;
const polar = (r: number, a: number): [number, number] => [C + r * Math.cos(a), C + r * Math.sin(a)];

/** contorno ondulado fechado (cobertura com "pingos") */
export const wavyRing = (base: number, amp: number, rand: () => number, steps = 72, drips = true) => {
  const phase = rand() * Math.PI * 2;
  let radii = Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    const r = base + Math.sin(a * 7 + phase) * amp * 0.5 + Math.sin(a * 3 + phase * 2) * amp * 0.5;
    return drips && rand() > 0.8 ? r + amp * 2.2 : r;
  });
  // suaviza os pingos para ficarem arredondados
  for (let pass = 0; pass < 2; pass++) {
    radii = radii.map((r, i) => radii[(i - 1 + steps) % steps] * 0.25 + r * 0.5 + radii[(i + 1) % steps] * 0.25);
  }
  const pts = radii.map((r, i) => polar(r, (i / steps) * Math.PI * 2));
  // curva suave (Catmull-Rom -> Bézier)
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < steps; i++) {
    const p0 = pts[(i - 1 + steps) % steps];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % steps];
    const p3 = pts[(i + 2) % steps];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
};

const circle = (r: number) => `M${C - r},${C}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0Z`;

const SPRINKLE_COLORS = ['#ffd23f', '#39e991', '#3aa0ff', '#ffffff', '#ff2fb3', '#a77bff', '#ff7a45'];

/** posição aleatória dentro da faixa da cobertura (evita o furo) */
const spot = (rand: () => number, rMin = 44, rMax = 70) => polar(rMin + rand() * (rMax - rMin), rand() * Math.PI * 2);

function Toppings({ art, rand, gid }: { art: DonutArt; rand: () => number; gid: string }) {
  const items: ReactElement[] = [];
  switch (art.topping) {
    case 'sprinkles':
      for (let i = 0; i < 46; i++) {
        const [x, y] = spot(rand, art.filled ? 8 : 40, 72);
        items.push(
          <rect key={i} x={x - 5} y={y - 1.6} width={10} height={3.2} rx={1.6}
            fill={SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]} transform={`rotate(${rand() * 180} ${x} ${y})`} />,
        );
      }
      break;
    case 'wafer':
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 0.95 + rand() * 0.2;
        const [x, y] = polar(57, a);
        const rot = (a * 180) / Math.PI + 90;
        items.push(
          <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
            <rect x={x - 17} y={y - 8} width={34} height={16} rx={4} fill="#e9c38a" stroke="#b9854a" strokeWidth={1.2} />
            <rect x={x - 17} y={y - 2.5} width={34} height={5} fill="#6b3a1f" />
            {[-10, -3, 4, 11].map((dx) => (
              <line key={dx} x1={x + dx} y1={y - 8} x2={x + dx} y2={y - 3} stroke="#b9854a" strokeWidth={1} />
            ))}
          </g>,
        );
      }
      for (let i = 0; i < 14; i++) {
        const [x, y] = spot(rand);
        items.push(<circle key={`c${i}`} cx={x} cy={y} r={1.8 + rand() * 1.4} fill="#d8b07a" />);
      }
      break;
    case 'hazelnut': {
      const [x, y] = polar(56, -Math.PI / 2.4);
      for (let i = 0; i < 22; i++) {
        const [hx, hy] = spot(rand);
        items.push(<circle key={`n${i}`} cx={hx} cy={hy} r={1.6 + rand() * 1.8} fill="#c8913f" opacity={0.95} />);
      }
      items.push(
        <g key="ball">
          <circle cx={x} cy={y + 3} r={17} fill="rgba(0,0,0,.25)" />
          <circle cx={x} cy={y} r={16} fill={`url(#${gid}-gold)`} />
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={x - 8 + k * 4} cy={y - 2 + (k % 2) * 5} r={2} fill="#8a5a1a" opacity={0.55} />
          ))}
          <ellipse cx={x - 5} cy={y - 7} rx={5} ry={3} fill="#fff7d6" opacity={0.7} />
        </g>,
      );
      break;
    }
    case 'cookie':
      for (let i = 0; i < 26; i++) {
        const [x, y] = spot(rand, 40, 72);
        const s = 2.5 + rand() * 4.5;
        items.push(
          <path key={i} fill="#1d1a1a"
            d={`M${x - s},${y} L${x - s * 0.3},${y - s} L${x + s},${y - s * 0.4} L${x + s * 0.6},${y + s * 0.8} L${x - s * 0.5},${y + s * 0.7}Z`}
            transform={`rotate(${rand() * 360} ${x} ${y})`} />,
        );
      }
      {
        const [x, y] = polar(56, -Math.PI / 2);
        items.push(
          <g key="whole">
            <circle cx={x} cy={y} r={13} fill="#1d1a1a" />
            <circle cx={x} cy={y} r={10} fill="none" stroke="#2f2a2a" strokeWidth={1.5} strokeDasharray="2 2.5" />
          </g>,
        );
      }
      break;
    case 'strawberry':
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 1.1;
        const [x, y] = polar(56, a);
        items.push(
          <g key={i} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}>
            <circle cx={x} cy={y + 9} r={9} fill="#fffaf5" />
            <path d={`M${x},${y + 13} C${x - 14},${y + 2} ${x - 10},${y - 13} ${x},${y - 10} C${x + 10},${y - 13} ${x + 14},${y + 2} ${x},${y + 13}Z`} fill="#e8193c" />
            <path d={`M${x},${y + 8} C${x - 6},${y + 1} ${x - 5},${y - 7} ${x},${y - 6} C${x + 5},${y - 7} ${x + 6},${y + 1} ${x},${y + 8}Z`} fill="#ff8a9e" />
            <path d={`M${x - 6},${y - 10} Q${x},${y - 16} ${x + 6},${y - 10} Q${x},${y - 8} ${x - 6},${y - 10}Z`} fill="#2fbf5a" />
          </g>,
        );
      }
      break;
    case 'popcorn':
      for (let i = 0; i < 9; i++) {
        const [x, y] = spot(rand, 46, 66);
        items.push(
          <g key={i}>
            {[0, 1, 2, 3].map((k) => (
              <circle key={k} cx={x + Math.cos(k * 1.7) * 4} cy={y + Math.sin(k * 1.7) * 4} r={4.2} fill={k === 3 ? '#f6d48a' : '#fff6df'} />
            ))}
          </g>,
        );
      }
      break;
    case 'pretzel':
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        const [x, y] = polar(57, a);
        items.push(
          <g key={i} transform={`rotate(${rand() * 360} ${x} ${y})`} fill="none" stroke="#9c5a24" strokeWidth={3.4} strokeLinecap="round">
            <path d={`M${x - 9},${y + 6} C${x - 14},${y - 8} ${x + 2},${y - 10} ${x + 3},${y + 2} M${x + 9},${y + 6} C${x + 14},${y - 8} ${x - 2},${y - 10} ${x - 3},${y + 2} M${x - 9},${y + 6} L${x + 9},${y + 6}`} />
            <circle cx={x - 4} cy={y - 4} r={0.9} fill="#fff" stroke="none" />
            <circle cx={x + 5} cy={y - 2} r={0.9} fill="#fff" stroke="none" />
          </g>,
        );
      }
      break;
    case 'banana':
      for (let i = 0; i < 5; i++) {
        const [x, y] = polar(57, (i / 5) * Math.PI * 2 + 0.3);
        items.push(
          <g key={i}>
            <circle cx={x} cy={y} r={8.5} fill="#fff1b8" stroke="#e6cf7a" strokeWidth={1.5} />
            <circle cx={x} cy={y} r={2.2} fill="#c9a94a" opacity={0.6} />
          </g>,
        );
      }
      break;
    case 'cream':
      items.push(
        <g key="cream">
          <circle cx={C} cy={C + 4} r={26} fill="rgba(0,0,0,.12)" />
          <circle cx={C} cy={C} r={25} fill="#fff4d6" />
          <circle cx={C} cy={C} r={17} fill="#ffe9b0" />
          <circle cx={C} cy={C} r={8} fill="#ffd77a" />
          <ellipse cx={C - 8} cy={C - 10} rx={7} ry={3.5} fill="#fff" opacity={0.8} />
        </g>,
      );
      for (let i = 0; i < 40; i++) {
        const [x, y] = spot(rand, 30, 78);
        items.push(<circle key={`s${i}`} cx={x} cy={y} r={0.9 + rand()} fill="#fff" opacity={0.85} />);
      }
      break;
    case 'none':
      break;
  }
  return <>{items}</>;
}

function DonutSvg({ art, seed, title, className }: { art: DonutArt; seed: string; title?: string; className?: string }) {
  const raw = useId().replace(/:/g, '');
  const gid = `d${raw}`;
  const rand = rng(seed);
  const dough = art.dough ?? '#d9934a';
  const filled = !!art.filled;

  const outerDough = circle(88);
  const doughPath = filled ? outerDough : `${outerDough} ${circle(25)}`;
  const glazeOuter = wavyRing(filled ? 70 : 74, 6, rand);
  const glazePath = filled ? glazeOuter : `${glazeOuter} ${wavyRing(35, 2.5, rand, 40, false)}`;

  return (
    <svg viewBox="0 0 200 200" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <radialGradient id={`${gid}-dough`} cx="50%" cy="50%" r="50%">
          <stop offset={filled ? '0' : '0.26'} stopColor={filled ? '#f3c486' : '#7a3d12'} />
          <stop offset="0.45" stopColor="#f3c486" />
          <stop offset="0.78" stopColor={dough} />
          <stop offset="1" stopColor="#8a4515" />
        </radialGradient>
        <radialGradient id={`${gid}-shine`} cx="35%" cy="28%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
        <radialGradient id={`${gid}-gold`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.45" stopColor="#e6b64a" />
          <stop offset="1" stopColor="#8a5a14" />
        </radialGradient>
        <clipPath id={`${gid}-clip`}>
          <path d={glazePath} clipRule="evenodd" />
        </clipPath>
      </defs>

      <path d={doughPath} fill={`url(#${gid}-dough)`} fillRule="evenodd" />
      {art.topping === 'cream' && filled ? (
        <path d={outerDough} fill="#fff" opacity={0.1} />
      ) : (
        <>
          <path d={glazePath} fill={art.glaze} fillRule="evenodd" />
          <path d={glazePath} fill={`url(#${gid}-shine)`} fillRule="evenodd" />
        </>
      )}
      {art.drizzle && (
        <g clipPath={`url(#${gid}-clip)`} fill="none" stroke={art.drizzle} strokeWidth={3.2} strokeLinecap="round" opacity={0.95}>
          {[-48, -24, 0, 24, 48].map((dy) => (
            <path key={dy} d={`M10,${C + dy} q12,-14 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0`} transform={`rotate(-28 ${C} ${C})`} />
          ))}
        </g>
      )}
      <Toppings art={art} rand={rand} gid={gid} />
      {!filled && <path d={circle(25)} fill="none" stroke="rgba(0,0,0,.25)" strokeWidth={2} />}
    </svg>
  );
}

export const Donut = memo(DonutSvg);
