// Utilitários matemáticos: ruído, RNG com semente e funções de suavização.
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

const perlin = new ImprovedNoise();

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const deg = (d) => (d * Math.PI) / 180;

/** Perlin 3D em [-1, 1]. O deslocamento evita o zero nos pontos inteiros da malha. */
export const noise3 = (x, y, z) => perlin.noise(x + 0.137, y + 0.311, z + 0.529);

export function fbm3(x, y, z, oct = 4) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * noise3(x * freq, y * freq, z * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

/** Ruído "ridged" (nervuras) em [0, 1]. */
export function ridged3(x, y, z, oct = 3) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * (1 - Math.abs(noise3(x * freq, y * freq, z * freq)));
    freq *= 2.1;
    amp *= 0.5;
  }
  return sum / 0.875;
}

/** Gerador pseudoaleatório determinístico (mulberry32). */
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ihash(x, y, s) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Ruído celular (Worley) 2D: distâncias ao ponto mais próximo (f1) e ao segundo (f2). */
export function worley(x, y, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  let f1 = 9;
  let f2 = 9;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const cx = xi + i;
      const cy = yi + j;
      const px = cx + ihash(cx, cy, seed * 2 + 1);
      const py = cy + ihash(cx, cy, seed * 2 + 2);
      const d = Math.hypot(px - x, py - y);
      if (d < f1) {
        f2 = f1;
        f1 = d;
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  return { f1, f2 };
}

/** '#rrggbb' -> [r, g, b] (0..255) */
export function rgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Gradiente por paradas: stops = [[pos, [r,g,b]], ...] */
export function gradient(stops, t) {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [p0, c0] = stops[i - 1];
      const [p1, c1] = stops[i];
      return mix(c0, c1, (t - p0) / (p1 - p0));
    }
  }
  return stops[stops.length - 1][1];
}
