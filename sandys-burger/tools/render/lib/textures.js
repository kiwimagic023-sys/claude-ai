// Texturas procedurais (canvas 2D) para cada ingrediente: cor, relevo (bump) e rugosidade.
import * as THREE from 'three';
import { noise3, fbm3, ridged3, worley, rng, smoothstep, clamp, rgb, mix, gradient } from './util.js';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

const toTexture = (canvas, srgb) => {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};

/**
 * Pinta mapas a partir de uma função fn(U, V) com U,V em [0,1].
 * Retorna { map, bump, rough } (THREE.CanvasTexture).
 */
function paint(w, h, fn) {
  const cc = makeCanvas(w, h);
  const cb = makeCanvas(w, h);
  const cr = makeCanvas(w, h);
  const ic = cc.getContext('2d').createImageData(w, h);
  const ib = cb.getContext('2d').createImageData(w, h);
  const ir = cr.getContext('2d').createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      const s = fn((x + 0.5) / w, (y + 0.5) / h);
      ic.data[o] = clamp(s.c[0], 0, 255);
      ic.data[o + 1] = clamp(s.c[1], 0, 255);
      ic.data[o + 2] = clamp(s.c[2], 0, 255);
      ic.data[o + 3] = 255;
      const b = clamp(s.b ?? 0.5) * 255;
      const r = clamp(s.r ?? 0.5) * 255;
      ib.data[o] = ib.data[o + 1] = ib.data[o + 2] = b;
      ir.data[o] = ir.data[o + 1] = ir.data[o + 2] = r;
      ib.data[o + 3] = ir.data[o + 3] = 255;
    }
  }
  cc.getContext('2d').putImageData(ic, 0, 0);
  cb.getContext('2d').putImageData(ib, 0, 0);
  cr.getContext('2d').putImageData(ir, 0, 0);
  return { map: toTexture(cc, true), bump: toTexture(cb, false), rough: toTexture(cr, false) };
}

// ---------------------------------------------------------------------------------------------
export function bunTopTex(size = 1024) {
  const stops = [
    [0, rgb('#F0BA70')],
    [0.42, rgb('#E2A24B')],
    [0.76, rgb('#CC8130')],
    [0.92, rgb('#A9601F')],
    [1, rgb('#84461A')],
  ];
  const dark = rgb('#92501C');
  return paint(size, size, (U, V) => {
    const u = U * 2 - 1;
    const v = V * 2 - 1;
    const r = Math.hypot(u, v);
    let c = gradient(stops, Math.min(r, 1));
    const n1 = fbm3(u * 2.2, v * 2.2, 1.7, 4);
    const n2 = fbm3(u * 8, v * 8, 5.1, 3);
    const n3 = noise3(u * 70, v * 70, 9.3);
    const patch = smoothstep(0.02, 0.34, fbm3(u * 1.5 + 3, v * 1.5 - 2, 7.7, 3));
    c = mix(c, dark, patch * 0.4);
    const k = 1 + n1 * 0.2 + n2 * 0.07 + n3 * 0.035;
    return {
      c: [c[0] * k, c[1] * k, c[2] * k],
      b: 0.5 + n2 * 0.5 + n3 * 0.2,
      r: clamp(0.4 + n1 * 0.35 + n2 * 0.25, 0.2, 0.8),
    };
  });
}

export function bunUnderTex(size = 512) {
  const stops = [
    [0, rgb('#EBBE78')],
    [0.55, rgb('#DCA45A')],
    [0.9, rgb('#BC7A34')],
    [1, rgb('#8F5320')],
  ];
  return paint(size, size, (U, V) => {
    const u = U * 2 - 1;
    const v = V * 2 - 1;
    const r = Math.hypot(u, v);
    let c = gradient(stops, Math.min(r, 1));
    const toast = smoothstep(-0.05, 0.3, fbm3(u * 2.4 + 9, v * 2.4 + 3, 2.2, 4));
    c = mix(c, rgb('#A8662A'), toast * 0.38);
    const pore = smoothstep(0.3, 0.14, worley(u * 78, v * 78, 3).f1);
    c = mix(c, rgb('#7A4719'), pore * 0.2);
    const n = fbm3(u * 9, v * 9, 6.6, 3);
    return { c: [c[0] * (1 + n * 0.12), c[1] * (1 + n * 0.12), c[2] * (1 + n * 0.12)], b: 0.5 - pore * 0.4 + n * 0.2, r: clamp(0.34 + n * 0.25 + pore * 0.2) };
  });
}

// ---------------------------------------------------------------------------------------------
export function pattyTex(size = 1024) {
  const base = rgb('#7C4A2B');
  const hi = rgb('#AE6D45');
  const crust = rgb('#4A2512');
  const fat = rgb('#DDB483');
  const char = rgb('#24120A');
  return paint(size, size, (U, V) => {
    const u = U * 2 - 1;
    const v = V * 2 - 1;
    const r = Math.hypot(u, v);
    const w = worley(u * 36, v * 36, 7);
    const gran = smoothstep(0.6, 0.05, w.f1);
    const edge = smoothstep(0.03, 0.2, w.f2 - w.f1);
    const n1 = fbm3(u * 3, v * 3, 4.2, 4);
    let c = mix(base, hi, clamp(gran * 0.55 + n1 * 0.9 + 0.22, 0, 1));
    const rimT = smoothstep(0.58, 0.97, r + n1 * 0.12 + noise3(u * 14, v * 14, 1.1) * 0.05);
    c = mix(c, crust, rimT * 0.92);
    const fatSpeck = smoothstep(0.86, 0.96, noise3(u * 55, v * 55, 3.3));
    c = mix(c, fat, fatSpeck * 0.6 * (1 - rimT));
    c = mix(c, char, (1 - edge) * 0.3);
    const sear = smoothstep(0.1, 0.5, fbm3(u * 5 + 2, v * 5 - 4, 9.9, 3));
    c = mix(c, rgb('#3B1D0D'), sear * 0.25);
    return { c, b: clamp(0.3 + gran * 0.5 + edge * 0.25 + n1 * 0.2), r: clamp(0.58 - fatSpeck * 0.3 + rimT * 0.1, 0.25, 0.85) };
  });
}

// ---------------------------------------------------------------------------------------------
export function tomatoTex(size = 512) {
  const R = rng(11);
  const N = 5;
  const seeds = [];
  for (let s = 0; s < N; s++) {
    const a0 = ((s + 0.5) / N) * Math.PI * 2;
    for (let i = 0; i < 9; i++) {
      const a = a0 + (R() - 0.5) * ((Math.PI * 2) / N) * 0.6;
      const r = 0.44 + R() * 0.3;
      seeds.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  }
  const skin = rgb('#B3170F');
  const peri = rgb('#D93B22');
  const gel = rgb('#EC6D48');
  const septa = rgb('#F7BBA8');
  const core = rgb('#F4CDB7');
  const seedC = rgb('#F1D88C');
  return paint(size, size, (U, V) => {
    const u = U * 2 - 1;
    const v = V * 2 - 1;
    const r = Math.hypot(u, v);
    const th = Math.atan2(v, u);
    const n = fbm3(u * 5, v * 5, 8.2, 3);
    let c;
    let bump = 0.5;
    if (r > 0.965) {
      c = skin;
    } else if (r > 0.86) {
      c = mix(peri, skin, smoothstep(0.86, 0.965, r));
    } else {
      c = mix(gel, peri, smoothstep(0.5, 0.86, r) * 0.75 + n * 0.2);
      const sector = (th / (Math.PI * 2)) * N;
      const fr = sector - Math.floor(sector);
      const d = Math.min(fr, 1 - fr) * ((Math.PI * 2) / N) * r;
      const w = 0.03 + 0.008 * n;
      if (r > 0.16 && d < w) {
        c = mix(c, septa, 1 - smoothstep(w * 0.5, w, d));
        bump = 0.7;
      }
      if (r < 0.2) c = mix(c, core, smoothstep(0.2, 0.12, r));
      let sd = 9;
      for (const s of seeds) sd = Math.min(sd, Math.hypot(u - s[0], v - s[1]));
      const seedMask = smoothstep(0.036, 0.022, sd);
      c = mix(c, seedC, seedMask);
      bump += seedMask * 0.2;
    }
    return { c, b: bump + n * 0.1, r: 0.16 + n * 0.12 };
  });
}

// ---------------------------------------------------------------------------------------------
export function lettuceTex(size = 512) {
  return paint(size, size, (U, V) => {
    const u = U * 2 - 1;
    const v = V * 2 - 1;
    const r = Math.hypot(u, v);
    const th = Math.atan2(v, u);
    const base = gradient(
      [
        [0, rgb('#CFE88C')],
        [0.3, rgb('#86C43D')],
        [0.72, rgb('#4F9E26')],
        [1, rgb('#9BD252')],
      ],
      Math.min(r, 1),
    );
    const n = fbm3(u * 3, v * 3, 3.1, 4);
    const warp = noise3(u * 3, v * 3, 0.5) * 0.5;
    const vein = Math.pow(Math.abs(Math.sin((th + warp * r) * 7)), 16) * smoothstep(1, 0.1, r);
    const web = Math.pow(ridged3(u * 7, v * 7, 4.4), 7);
    let c = mix(base, rgb('#F0F9C4'), clamp(vein * 0.35 + web * 0.3, 0, 0.7));
    c = mix(c, rgb('#2F7D1C'), clamp(-n * 0.7, 0, 0.35));
    return { c, b: clamp(0.5 + vein * 0.4 + web * 0.3), r: 0.36 + n * 0.1 };
  });
}

// ---------------------------------------------------------------------------------------------
export function pickleTex(size = 256) {
  const R = rng(21);
  const seeds = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + R() * 0.2;
    seeds.push([Math.cos(a) * 0.46, Math.sin(a) * 0.46]);
  }
  return paint(size, size, (U, V) => {
    const u = U * 2 - 1;
    const v = V * 2 - 1;
    const r = Math.hypot(u, v);
    const n = fbm3(u * 6, v * 6, 2.2, 3);
    let c;
    if (r > 0.95) c = rgb('#3E5F18');
    else if (r > 0.8) c = mix(rgb('#7A9B2E'), rgb('#3E5F18'), smoothstep(0.8, 0.95, r));
    else c = mix(rgb('#CBDB78'), rgb('#9DB74B'), smoothstep(0.15, 0.8, r));
    let sd = 9;
    for (const s of seeds) sd = Math.min(sd, Math.hypot(u - s[0], v - s[1]));
    c = mix(c, rgb('#E8F0A8'), smoothstep(0.07, 0.04, sd));
    return { c: [c[0] * (1 + n * 0.1), c[1] * (1 + n * 0.1), c[2] * (1 + n * 0.1)], b: 0.5 + n * 0.2, r: 0.25 + n * 0.1 };
  });
}

// ---------------------------------------------------------------------------------------------
export function baconTex(w = 512, h = 128) {
  return paint(w, h, (U, V) => {
    const n = fbm3(U * 12, V * 4, 1.3, 4);
    const band = Math.sin(V * Math.PI * 5 + n * 2.2);
    const fat = smoothstep(0.05, 0.55, band);
    let c = mix(rgb('#9D3521'), rgb('#6A2012'), clamp(n * 1.5 + 0.4, 0, 1));
    c = mix(c, rgb('#F2CDAA'), fat);
    const crisp = smoothstep(0.35, 0.7, fbm3(U * 9 + 4, V * 6, 8.1, 3));
    c = mix(c, rgb('#4F1A0E'), crisp * 0.45);
    return { c, b: clamp(0.5 + band * 0.25 + n * 0.3), r: 0.3 + fat * 0.05 };
  });
}

// ---------------------------------------------------------------------------------------------
export function cheeseTex(size = 256) {
  return paint(size, size, (U, V) => {
    const u = U * 2 - 1;
    const v = V * 2 - 1;
    const n = fbm3(u * 3, v * 3, 5.5, 4);
    const blotch = smoothstep(-0.2, 0.3, n);
    const c = mix(rgb('#FF9400'), rgb('#FFB41F'), blotch);
    const fine = noise3(u * 40, v * 40, 2.8);
    return { c: [c[0], c[1] * (1 + fine * 0.03), c[2]], b: 0.5 + n * 0.5 + fine * 0.15, r: 0.28 + n * 0.1 };
  });
}
