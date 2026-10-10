// Modelos procedurais dos ingredientes. Cada fábrica devolve { obj, h, update? }.
// A origem de cada camada fica no centro da base (y = 0 é a face de baixo).
import * as THREE from 'three';
import { noise3, fbm3, rng, smoothstep, clamp, lerp, deg } from './util.js';
import { revolved, polarSurface, sampleSurface, taperedTube } from './geometry.js';
import {
  bunTopTex,
  bunUnderTex,
  pattyTex,
  tomatoTex,
  lettuceTex,
  pickleTex,
  baconTex,
  cheeseTex,
} from './textures.js';

const col = (hex) => new THREE.Color(hex);

/** Texturas e materiais compartilhados (gerados uma única vez). */
export function createKit() {
  const T = {
    bunTop: bunTopTex(1024),
    bunUnder: bunUnderTex(512),
    patty: pattyTex(1024),
    tomato: tomatoTex(512),
    lettuce: lettuceTex(512),
    pickle: pickleTex(256),
    bacon: baconTex(512, 128),
    cheese: cheeseTex(256),
  };
  const phys = (o) => new THREE.MeshPhysicalMaterial(o);
  const M = {
    bunTop: phys({
      map: T.bunTop.map,
      bumpMap: T.bunTop.bump,
      bumpScale: 2.2,
      roughnessMap: T.bunTop.rough,
      roughness: 1,
      clearcoat: 0.28,
      clearcoatRoughness: 0.4,
      sheen: 0.6,
      sheenRoughness: 0.55,
      sheenColor: col('#ffc27a'),
    }),
    bunUnder: phys({
      map: T.bunUnder.map,
      bumpMap: T.bunUnder.bump,
      bumpScale: 2.4,
      roughnessMap: T.bunUnder.rough,
      roughness: 1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      sheen: 0.5,
      sheenColor: col('#ffd9a0'),
    }),
    patty: phys({
      map: T.patty.map,
      bumpMap: T.patty.bump,
      bumpScale: 3.5,
      roughnessMap: T.patty.rough,
      roughness: 1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.45,
    }),
    cheese: phys({
      map: T.cheese.map,
      bumpMap: T.cheese.bump,
      bumpScale: 0.8,
      roughness: 0.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      sheen: 0.3,
      sheenColor: col('#ffc860'),
      emissive: col('#8a4300'),
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
    }),
    lettuce: phys({
      map: T.lettuce.map,
      bumpMap: T.lettuce.bump,
      bumpScale: 1.4,
      roughness: 0.4,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
      sheen: 0.6,
      sheenColor: col('#e8ffa0'),
      emissive: col('#14420a'),
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
    }),
    tomato: phys({
      map: T.tomato.map,
      bumpMap: T.tomato.bump,
      bumpScale: 1.5,
      roughness: 0.34,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      emissive: col('#3a0600'),
      emissiveIntensity: 0.25,
    }),
    onion: phys({
      color: col('#7f2f7c'),
      roughness: 0.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      emissive: col('#2a0b36'),
      emissiveIntensity: 0.4,
      sheen: 0.5,
      sheenColor: col('#e9a0e0'),
    }),
    onionPale: phys({
      color: col('#ecc4e3'),
      roughness: 0.4,
      clearcoat: 0.5,
      emissive: col('#5a2358'),
      emissiveIntensity: 0.25,
    }),
    sauce: phys({
      color: col('#ff7f8e'),
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      emissive: col('#7a1830'),
      emissiveIntensity: 0.55,
    }),
    sesame: new THREE.MeshStandardMaterial({ color: col('#f3e2b8'), roughness: 0.48 }),
    bacon: phys({
      map: T.bacon.map,
      bumpMap: T.bacon.bump,
      bumpScale: 2,
      roughness: 0.38,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide,
    }),
    pickle: phys({
      map: T.pickle.map,
      bumpMap: T.pickle.bump,
      bumpScale: 1,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: col('#233a08'),
      emissiveIntensity: 0.3,
    }),
    diced: phys({
      color: col('#f1e8cf'),
      roughness: 0.4,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
      emissive: col('#403820'),
      emissiveIntensity: 0.25,
    }),
    ketchup: phys({ color: col('#b4121c'), roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06, emissive: col('#3a0004'), emissiveIntensity: 0.4 }),
    mustard: phys({ color: col('#e8b50a'), roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06, emissive: col('#4a3400'), emissiveIntensity: 0.4 }),
    mayo: phys({ color: col('#fff0d2'), roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.15, emissive: col('#7a6a3a'), emissiveIntensity: 0.4 }),
    drop: phys({
      color: col('#ffd2ec'),
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      emissive: col('#ff2e9a'),
      emissiveIntensity: 0.55,
    }),
    dropSauce: phys({ color: col('#ff8c86'), roughness: 0.08, clearcoat: 1, emissive: col('#5c1620'), emissiveIntensity: 0.4 }),
  };
  return { T, M };
}

const shadow = (m) => {
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};

// ---------------------------------------------------------------------------------------------
// Pão de cima (com gergelim). Altura total ~0.57.
function topBunProfile() {
  const pts = [];
  const N = 40;
  const y0 = 0.1;
  const H = 0.47;
  const n = 2.35;
  for (let i = 0; i <= N; i++) {
    const phi = (i / N) * (Math.PI / 2);
    pts.push([Math.pow(Math.sin(phi), 2 / n), y0 + H * Math.pow(Math.cos(phi), 2 / n)]);
  }
  pts.push([1, y0 * 0.55]);
  const rr = 0.07;
  pts.push([1, rr]);
  const kUnder = pts.length - 1;
  for (let i = 1; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push([1 - rr + rr * Math.cos(a), rr - rr * Math.sin(a)]);
  }
  const U = 14;
  for (let i = 1; i <= U; i++) {
    const rho = (1 - rr) * (1 - i / U);
    pts.push([rho, 0.075 * Math.pow(1 - rho / (1 - rr), 2)]);
  }
  return { pts, kUnder };
}

export function makeTopBun(kit, { seed = 3, sesame = 120 } = {}) {
  const R = rng(seed);
  const { pts, kUnder } = topBunProfile();
  const geo = revolved({
    profile: pts,
    segments: 192,
    ragged: (th) => 1 + 0.012 * noise3(Math.cos(th) * 1.4, Math.sin(th) * 1.4, seed),
    displace: (x, y, z) => 0.02 * fbm3(x * 1.2 + seed, y * 1.2, z * 1.2, 3) + 0.004 * noise3(x * 11, y * 11, z * 11),
    // coroa: UV por comprimento de arco (sem esticar na lateral); parte de baixo: projeção planar
    uvRadius: (k, rho, arc) => (k <= kUnder ? arc[k] / arc[kUnder] : rho),
    groups: [
      { from: 0, to: kUnder, material: 0 },
      { from: kUnder, to: pts.length - 1, material: 1 },
    ],
  });
  const mesh = shadow(new THREE.Mesh(geo, [kit.M.bunTop, kit.M.bunUnder]));
  const obj = new THREE.Group();
  obj.add(mesh);

  // gergelim
  const seedGeo = new THREE.SphereGeometry(1, 10, 8);
  const inst = new THREE.InstancedMesh(seedGeo, kit.M.sesame, sesame);
  inst.castShadow = true;
  inst.receiveShadow = true;
  inst.frustumCulled = false;
  const spots = sampleSurface(geo, sesame, (cx, cy, cz, nx, ny) => ny > 0.45 && cy > 0.26 && Math.hypot(cx, cz) < 0.8, R);
  const items = spots.map((s) => {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), s.n);
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), R() * Math.PI * 2));
    const fly = R() < 0.5;
    return {
      p: s.p,
      n: s.n,
      q,
      sc: new THREE.Vector3(0.036 + R() * 0.012, 0.011 + R() * 0.004, 0.02 + R() * 0.006),
      fly,
      dist: 0.35 + R() * 1.05,
      delay: R() * 0.35,
      dir: new THREE.Vector3((R() - 0.5) * 1.6, (R() - 0.5) * 1.5 - 0.05, (R() - 0.5) * 1.6).normalize(),
      axis: new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).normalize(),
      spin: (R() - 0.5) * 7,
      ph: R() * 6.28,
    };
  });
  obj.add(inst);

  // fios de molho que escorrem da parte de baixo do pão quando ele se afasta
  const dripGeo = new THREE.LatheGeometry(
    [[0.9, 0], [0.8, -0.1], [0.55, -0.3], [0.45, -0.5], [0.5, -0.68], [0.7, -0.82], [0.74, -0.92], [0.5, -0.985], [0, -1]].map(([r, y]) => new THREE.Vector2(r, y)),
    14,
  );
  const sauceDrips = [];
  for (let i = 0; i < 9; i++) {
    const a = R() * Math.PI * 2;
    const rho = i < 2 ? 0.12 + R() * 0.25 : 0.55 + R() * 0.38;
    const m = new THREE.Mesh(dripGeo, kit.M.sauce);
    const r = 0.04 + R() * 0.03;
    m.userData = { r, k: 0.4 + R() * 0.6, ph: R() * 6.28 };
    m.position.set(Math.cos(a) * rho, 0.075 * Math.pow(Math.max(0, 1 - rho / 0.93), 2) + 0.012, Math.sin(a) * rho);
    m.castShadow = true;
    m.visible = false;
    obj.add(m);
    sauceDrips.push(m);
  }

  const m4 = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();
  const one = new THREE.Vector3();
  function update({ lift = 0, time = 0, drip = 0 } = {}) {
    for (const d of sauceDrips) {
      const len = drip * (0.1 + 0.34 * d.userData.k) * (1 + 0.1 * Math.sin(time * 4 + d.userData.ph));
      d.visible = len > 0.003;
      d.scale.set(d.userData.r * Math.min(1, len / 0.08), len, d.userData.r * Math.min(1, len / 0.08));
    }
    items.forEach((it, i) => {
      pos.copy(it.p).addScaledVector(it.n, -0.004);
      qa.copy(it.q);
      one.copy(it.sc);
      if (it.fly && lift > 0) {
        const l = smoothstep(it.delay, it.delay + 0.65, lift);
        pos.addScaledVector(it.dir, it.dist * l);
        pos.y += Math.sin(time * 6.28 * 0.8 + it.ph) * 0.03 * l;
        qb.setFromAxisAngle(it.axis, it.spin * l + time * 2 * l);
        qa.premultiply(qb);
      }
      m4.compose(pos, qa, one);
      inst.setMatrixAt(i, m4);
    });
    inst.instanceMatrix.needsUpdate = true;
  }
  update();
  return { obj, h: 0.57, update };
}

// ---------------------------------------------------------------------------------------------
export function makeBottomBun(kit, { seed = 5, h = 0.3 } = {}) {
  const rr = 0.1;
  const pts = [];
  const T = 12;
  for (let i = 0; i <= T; i++) {
    const s = i / T;
    pts.push([s * (1 - rr), h - 0.032 * (1 - s * s)]);
  }
  const A = 8;
  for (let i = 1; i <= A; i++) {
    const a = (i / A) * (Math.PI / 2);
    pts.push([1 - rr + rr * Math.sin(a), h - rr + rr * Math.cos(a)]);
  }
  const kSide = pts.length - 1;
  const sideTop = h - rr;
  const rb = 0.09;
  const S = 6;
  for (let i = 1; i <= S; i++) {
    const u = i / S;
    pts.push([1 + 0.018 * Math.sin(Math.PI * u), lerp(sideTop, rb, u)]);
  }
  for (let i = 1; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push([1 - rb + rb * Math.cos(a), rb - rb * Math.sin(a)]);
  }
  const kBottom = pts.length - 1;
  for (let i = 1; i <= 6; i++) pts.push([(1 - rb) * (1 - i / 6), 0]);
  const geo = revolved({
    profile: pts,
    segments: 192,
    ragged: (th) => 1 + 0.01 * noise3(Math.cos(th) * 1.3, Math.sin(th) * 1.3, seed),
    displace: (x, y, z, rho, th, k) => (k < kSide ? 0.012 : 0.01) * fbm3(x * 2 + seed, y * 2, z * 2, 3),
    // face de cima: planar (miolo tostado); lateral: faixa dourada sem esticar; fundo: planar
    uvRadius: (k, rho, arc) => {
      if (k <= kSide) return rho;
      if (k <= kBottom) return 0.42 + 0.4 * ((arc[k] - arc[kSide]) / (arc[kBottom] - arc[kSide]));
      return rho;
    },
    groups: [
      { from: 0, to: kSide, material: 1 },
      { from: kSide, to: pts.length - 1, material: 0 },
    ],
  });
  const mesh = shadow(new THREE.Mesh(geo, [kit.M.bunTop, kit.M.bunUnder]));
  const obj = new THREE.Group();
  obj.add(mesh);
  return { obj, h };
}

// ---------------------------------------------------------------------------------------------
// Carne ultra smash: fina, com bordas rendadas e crocantes.
export function makePatty(kit, { seed = 7, radius = 1.045, t = 0.075 } = {}) {
  const te = 0.034;
  const rr = 0.02;
  const pts = [];
  const N = 26;
  for (let i = 0; i <= N; i++) {
    const s = (i / N) * (1 - rr);
    pts.push([s, te + (t - te) * (1 - Math.pow(s / (1 - rr), 2.4))]);
  }
  const kTop = pts.length;
  const yEdge = pts[pts.length - 1][1];
  for (let i = 1; i <= 5; i++) {
    const a = (i / 5) * (Math.PI / 2);
    pts.push([1 - rr + rr * Math.sin(a), yEdge - rr + rr * Math.cos(a) - (i / 5) * (yEdge - rr) * 0.9]);
  }
  pts.push([1 - rr * 0.5, 0]);
  for (let i = 1; i <= 8; i++) pts.push([(1 - rr * 0.5) * (1 - i / 8), 0]);
  const geo = revolved({
    profile: pts,
    segments: 224,
    ragged: (th) => {
      const c = Math.cos(th);
      const s = Math.sin(th);
      return radius * (1 + 0.032 * fbm3(c * 2.2 + seed, s * 2.2, seed, 3) + 0.018 * noise3(c * 7, s * 7, seed + 3) + 0.011 * noise3(c * 19, s * 19, seed + 5));
    },
    displace: (x, y, z, rho, th, k) => (k < kTop + 3 ? 0.011 * fbm3(x * 6, y * 6, z * 6 + seed, 3) + 0.005 * noise3(x * 22, y * 22, z * 22) : 0),
  });
  const mesh = shadow(new THREE.Mesh(geo, kit.M.patty));
  const obj = new THREE.Group();
  obj.add(mesh);
  return { obj, h: t };
}

// ---------------------------------------------------------------------------------------------
// Fatia de American Cheese: quadrada, derrete e escorre pelas pontas.
export function makeCheese(kit, { seed = 9, side = 1.84, grid = 56, patty = 1.0, th = 0.028 } = {}) {
  const V = grid + 1;
  const half = side / 2;
  const total = V * V * 2 + 4 * V * 2;
  const pos = new Float32Array(total * 3);
  const uv = new Float32Array(total * 2);
  const idx = [];
  const ti = (i, j) => i * V + j;
  const bi = (i, j) => V * V + i * V + j;
  const sideBase = (s) => 2 * V * V + s * 2 * V;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const a = ti(i, j);
      const b = ti(i + 1, j);
      const c = ti(i, j + 1);
      const d = ti(i + 1, j + 1);
      idx.push(a, c, b, b, c, d);
      const a2 = bi(i, j);
      const b2 = bi(i + 1, j);
      const c2 = bi(i, j + 1);
      const d2 = bi(i + 1, j + 1);
      idx.push(a2, b2, c2, b2, d2, c2);
    }
  }
  for (let s = 0; s < 4; s++) {
    for (let i = 0; i < grid; i++) {
      const a = sideBase(s) + i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      const U = i / grid;
      const W = j / grid;
      uv.set([U, W], ti(i, j) * 2);
      uv.set([U, W], bi(i, j) * 2);
    }
  }
  for (let s = 0; s < 4; s++) for (let i = 0; i <= grid; i++) uv.set([i / grid, 0.5], (sideBase(s) + i * 2) * 2), uv.set([i / grid, 0.5], (sideBase(s) + i * 2 + 1) * 2);

  const R = rng(seed);
  const lowerY = (u, v, m) => {
    const d = Math.hypot(u, v);
    const rEff = patty * (0.86 - 0.06 * m);
    const t = clamp((d - rEff) / (side * 0.7071 - rEff + 1e-6));
    const L = 0.1 + 0.26 * m;
    let y = -L * Math.pow(t, 1.25);
    y -= 0.028 * smoothstep(0.45, 1, d / patty);
    y += 0.016 * noise3(u * 4.6 + seed, v * 4.6, seed) * (0.25 + 1.2 * t);
    return y;
  };

  // gotas de queijo: 4 pontas + algumas laterais
  const drips = [];
  const spots = [
    [half, half, 1.0],
    [half, -half, 0.8],
    [-half, half, 0.9],
    [-half, -half, 1.0],
  ];
  for (let i = 0; i < 6; i++) {
    const e = Math.floor(R() * 4);
    const p = (R() - 0.5) * side * 0.7;
    spots.push([e < 2 ? (e ? half : -half) : p, e < 2 ? p : e === 2 ? half : -half, 0.35 + R() * 0.3]);
  }
  const dripProfile = [
    [1.0, 0],
    [0.92, -0.08],
    [0.7, -0.25],
    [0.52, -0.45],
    [0.5, -0.62],
    [0.62, -0.78],
    [0.64, -0.88],
    [0.45, -0.96],
    [0, -1],
  ];
  const obj = new THREE.Group();
  const cheese = shadow(new THREE.Mesh(geo, kit.M.cheese));
  obj.add(cheese);
  const dripMeshes = spots.map(([u, v, k]) => {
    const g = new THREE.LatheGeometry(
      dripProfile.map(([r, y]) => new THREE.Vector2(r * (0.075 + 0.04 * k), y)),
      16,
    );
    const mesh = shadow(new THREE.Mesh(g, kit.M.cheese));
    const corner = Math.abs(u) > half * 0.98 && Math.abs(v) > half * 0.98;
    mesh.userData = { u: u * (corner ? 0.9 : 0.99), v: v * (corner ? 0.9 : 0.99), k, ph: R() * 6.28 };
    mesh.rotation.y = Math.PI / 2 - Math.atan2(v, u);
    mesh.visible = false;
    obj.add(mesh);
    return mesh;
  });

  /** m: derretimento (0..1); drip: comprimento das gotas (0..1) */
  function update({ m = 0.5, drip = 0.3, time = 0 } = {}) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        const u = (i / grid - 0.5) * side;
        const v = (j / grid - 0.5) * side;
        const y = lowerY(u, v, m);
        pos.set([u, y + th, v], ti(i, j) * 3);
        pos.set([u, y, v], bi(i, j) * 3);
      }
    }
    for (let i = 0; i <= grid; i++) {
      const w = (i / grid - 0.5) * side;
      const set = (s, u, v) => {
        const y = lowerY(u, v, m);
        pos.set([u, y + th, v], (sideBase(s) + i * 2) * 3);
        pos.set([u, y, v], (sideBase(s) + i * 2 + 1) * 3);
      };
      set(0, w, -half);
      set(1, w, half);
      set(2, -half, w);
      set(3, half, w);
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    for (const d of dripMeshes) {
      const { u, v, k, ph } = d.userData;
      const len = drip * (0.1 + 0.34 * k) * (1 + 0.12 * Math.sin(time * 4 + ph));
      d.visible = len > 0.003;
      if (!d.visible) continue;
      const y = lowerY(u, v, m);
      d.position.set(u, y + th * 0.9, v);
      d.scale.set(1, len, 0.4);
    }
  }
  update();
  return { obj, h: th, update };
}

// ---------------------------------------------------------------------------------------------
export function makeLettuce(kit, { seed = 13 } = {}) {
  const leaf = (R0, sd, y, rotY) => {
    const geo = polarSurface({
      rings: 46,
      segs: 220,
      radius: (th) => R0 * (1 + 0.05 * fbm3(Math.cos(th) * 1.6 + sd, Math.sin(th) * 1.6, sd, 3)),
      height: (rho, th, x, z) => {
        const edge = smoothstep(0.3, 1, rho);
        const wave = Math.sin(th * 11 + 2.6 * noise3(x * 1.6, z * 1.6, sd)) * 0.5 + Math.sin(th * 23 - rho * 8 + sd) * 0.35 + 0.28 * noise3(x * 6, z * 6, sd);
        return 0.11 * edge * edge * wave - 0.1 * Math.pow(rho, 3.0) + 0.022 * fbm3(x * 2, z * 2, sd, 3) + 0.05;
      },
    });
    const m = shadow(new THREE.Mesh(geo, kit.M.lettuce));
    m.position.y = y;
    m.rotation.y = rotY;
    return m;
  };
  const obj = new THREE.Group();
  obj.add(leaf(1.13, seed, 0.0, 0));
  obj.add(leaf(0.97, seed + 4, 0.045, 1.1));
  return { obj, h: 0.11 };
}

// ---------------------------------------------------------------------------------------------
export function makeTomato(kit, { seed = 17, slices = 2, radius = 0.9 } = {}) {
  const t = 0.07;
  const rr = 0.03;
  const make = (sd, rad) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const s = (i / 12) * (1 - rr);
      pts.push([s, t + 0.01 * (1 - Math.pow(s / (1 - rr), 2))]);
    }
    for (let i = 1; i <= 5; i++) {
      const a = (i / 5) * (Math.PI / 2);
      pts.push([1 - rr + rr * Math.sin(a), t - rr + rr * Math.cos(a)]);
    }
    pts.push([1, t * 0.5]);
    for (let i = 1; i <= 5; i++) {
      const a = (i / 5) * (Math.PI / 2);
      pts.push([1 - rr + rr * Math.cos(a), rr - rr * Math.sin(a)]);
    }
    for (let i = 1; i <= 12; i++) pts.push([(1 - rr) * (1 - i / 12), 0.002 - 0.008 * (1 - i / 12) ** 2]);
    const geo = revolved({
      profile: pts,
      segments: 120,
      ragged: (th) => rad * (1 + 0.03 * fbm3(Math.cos(th) * 1.8 + sd, Math.sin(th) * 1.8, sd, 2)),
      // lateral com a cor da polpa (casca fina só nas quinas), como uma fatia de verdade
      uvRadius: (k, rho) => (k <= 12 ? rho : k <= 14 ? 0.97 : k <= 21 ? 0.8 : k <= 23 ? 0.97 : rho),
    });
    return shadow(new THREE.Mesh(geo, kit.M.tomato));
  };
  const obj = new THREE.Group();
  const a = make(seed, radius);
  obj.add(a);
  let h = t + 0.01;
  if (slices > 1) {
    const b = make(seed + 5, radius * 0.94);
    b.position.set(0.1, t * 0.8, -0.06);
    b.rotation.y = 1.4;
    obj.add(b);
    h = t * 1.8;
  }
  return { obj, h };
}

// ---------------------------------------------------------------------------------------------
export function makeOnionRings(kit, { seed = 19 } = {}) {
  const R = rng(seed);
  const obj = new THREE.Group();
  // pares de anéis (casca roxa + miolo claro), como fatias finas de cebola
  const rings = [
    { r: 0.88, tube: 0.026, arc: 1.0, a0: 0 },
    { r: 0.8, tube: 0.022, arc: 0.9, a0: 0.5 },
    { r: 0.7, tube: 0.026, arc: 0.78, a0: 1.3 },
    { r: 0.61, tube: 0.022, arc: 1.0, a0: 2.1 },
    { r: 0.52, tube: 0.024, arc: 0.7, a0: 3.0 },
    { r: 0.43, tube: 0.02, arc: 1.0, a0: 3.7 },
    { r: 0.34, tube: 0.02, arc: 0.6, a0: 4.4 },
    { r: 0.78, tube: 0.02, arc: 0.45, a0: 4.9 },
    { r: 0.58, tube: 0.02, arc: 0.5, a0: 5.6 },
  ];
  rings.forEach((rg, i) => {
    const g = new THREE.TorusGeometry(rg.r, rg.tube * 1.5, 10, 140, rg.arc * Math.PI * 2);
    g.rotateX(-Math.PI / 2);
    g.rotateY(rg.a0);
    const m = shadow(new THREE.Mesh(g, i % 3 === 1 ? kit.M.onionPale : kit.M.onion));
    m.scale.set(1 + (R() - 0.5) * 0.06, 1.7, 1 + (R() - 0.5) * 0.06);
    m.position.y = 0.045 + (i % 3) * 0.016;
    obj.add(m);
  });
  return { obj, h: 0.1 };
}

// ---------------------------------------------------------------------------------------------
/** Molho em espiral cônica (dollop): rosé, ketchup, mostarda, maionese. */
export function makeSauceSpiral(kit, { mat = 'sauce', radius = 0.78, turns = 3.2, tube = 0.06, seed = 23, rise = 0.14 } = {}) {
  const R = rng(seed);
  const points = [];
  const N = 120;
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const a = s * turns * Math.PI * 2;
    const r = Math.max(0.03, radius * (1 - Math.pow(s, 0.9)) + 0.02 * noise3(s * 6, seed, 0));
    points.push(new THREE.Vector3(Math.cos(a) * r, rise * Math.pow(s, 1.3), Math.sin(a) * r));
  }
  const geo = taperedTube(points, (t) => tube * (0.8 + 0.2 * Math.sin(Math.min(t * 10, Math.PI / 2))) * (1 - 0.5 * smoothstep(0.9, 1, t)) * (0.97 + 0.06 * R()), 260, 14);
  const mesh = shadow(new THREE.Mesh(geo, kit.M[mat]));
  mesh.position.y = tube * 0.85;
  const obj = new THREE.Group();
  obj.add(mesh);
  return { obj, h: tube * 1.7 + rise };
}

/** Zigue-zague de ketchup/mostarda sobre o hambúrguer. */
export function makeSquiggle(kit, { mat = 'ketchup', length = 1.5, amp = 0.16, waves = 8, angle = 0, tube = 0.032, seed = 29 } = {}) {
  const points = [];
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const s = i / N - 0.5;
    points.push(new THREE.Vector3(s * length, 0, Math.sin(s * waves * Math.PI * 2 * 0.5) * amp + 0.02 * noise3(s * 5, seed, 0)));
  }
  const geo = taperedTube(points, (t) => tube * (0.5 + 0.5 * Math.sin(Math.min(t * 14, Math.PI / 2))) * (1 - 0.4 * smoothstep(0.88, 1, t)), 200, 10);
  const mesh = shadow(new THREE.Mesh(geo, kit.M[mat]));
  mesh.rotation.y = angle;
  mesh.position.y = tube;
  const obj = new THREE.Group();
  obj.add(mesh);
  return { obj, h: tube * 1.8 };
}

// ---------------------------------------------------------------------------------------------
export function makeBacon(kit, { seed = 31, strips = 3 } = {}) {
  const R = rng(seed);
  const obj = new THREE.Group();
  for (let s = 0; s < strips; s++) {
    const L = 1.75;
    const W = 0.24;
    const g = new THREE.PlaneGeometry(L, W, 90, 6);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    const ph = R() * 6;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      p.setY(i, 0.04 * Math.sin(x * 7.5 + ph) + 0.025 * Math.sin(x * 17 + ph * 2) + 0.02 * Math.cos((z / W) * Math.PI) + 0.012 * noise3(x * 4, z * 4, seed));
      p.setZ(i, z + 0.035 * Math.sin(x * 5 + ph));
    }
    g.computeVertexNormals();
    const m = shadow(new THREE.Mesh(g, kit.M.bacon));
    m.rotation.y = (s / strips) * Math.PI * 0.9 + 0.3 + (R() - 0.5) * 0.25;
    m.position.set((R() - 0.5) * 0.2, 0.03 + s * 0.012, (R() - 0.5) * 0.2);
    obj.add(m);
  }
  return { obj, h: 0.08 };
}

export function makePickles(kit, { seed = 37, count = 5 } = {}) {
  const R = rng(seed);
  const obj = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const r = 0.27 + R() * 0.04;
    const t = 0.03;
    const pts = [];
    for (let k = 0; k <= 8; k++) {
      const s = (k / 8) * 0.95;
      pts.push([s, t + 0.006 * (1 - s * s)]);
    }
    pts.push([1, t * 0.6]);
    pts.push([0.95, 0]);
    for (let k = 1; k <= 8; k++) pts.push([0.95 * (1 - k / 8), 0]);
    const geo = revolved({
      profile: pts,
      segments: 64,
      ragged: (th) => r * (1 + 0.02 * Math.sin(th * 18) + 0.025 * noise3(Math.cos(th) * 2 + i, Math.sin(th) * 2, i)),
    });
    const m = shadow(new THREE.Mesh(geo, kit.M.pickle));
    const a = (i / count) * Math.PI * 2 + R() * 0.5;
    const d = i === 0 ? 0 : 0.42 + R() * 0.12;
    m.position.set(Math.cos(a) * d, 0, Math.sin(a) * d);
    m.rotation.y = R() * 6;
    obj.add(m);
  }
  return { obj, h: 0.04 };
}

export function makeDicedOnion(kit, { seed = 41, count = 70, radius = 0.78 } = {}) {
  const R = rng(seed);
  const geo = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (1 + (R() - 0.5) * 0.2), p.getY(i) * (1 + (R() - 0.5) * 0.2), p.getZ(i) * (1 + (R() - 0.5) * 0.2));
  geo.computeVertexNormals();
  const inst = new THREE.InstancedMesh(geo, kit.M.diced, count);
  inst.castShadow = true;
  inst.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < count; i++) {
    const a = R() * Math.PI * 2;
    const d = Math.sqrt(R()) * radius;
    const s = 0.045 + R() * 0.04;
    e.set(R() * 6, R() * 6, R() * 6);
    q.setFromEuler(e);
    m4.compose(new THREE.Vector3(Math.cos(a) * d, 0.03 + R() * 0.03, Math.sin(a) * d), q, new THREE.Vector3(s, s * 0.7, s * (0.8 + R() * 0.5)));
    inst.setMatrixAt(i, m4);
  }
  const obj = new THREE.Group();
  obj.add(inst);
  return { obj, h: 0.07 };
}

// ---------------------------------------------------------------------------------------------
/** Gotas e gergelim voando (partículas 3D das cenas explodidas). */
export function makeDroplets(kit, { count = 34, seed = 51 } = {}) {
  const R = rng(seed);
  const geo = new THREE.SphereGeometry(1, 16, 12);
  const inst = new THREE.InstancedMesh(geo, kit.M.drop, count);
  inst.frustumCulled = false;
  inst.castShadow = false;
  const colors = [new THREE.Color('#ffd0ea'), new THREE.Color('#ff8c86'), new THREE.Color('#ffffff'), new THREE.Color('#c9a0ff')];
  const items = [];
  for (let i = 0; i < count; i++) {
    const a = R() * Math.PI * 2;
    const r = 0.55 + R() * 1.05;
    items.push({
      x: Math.cos(a) * r,
      z: Math.sin(a) * r,
      y: (R() - 0.5) * 2.6,
      s: 0.016 + Math.pow(R(), 2.2) * 0.05,
      rise: 0.25 + R() * 0.5,
      ph: R() * 6.28,
      delay: R() * 0.4,
    });
    inst.setColorAt(i, colors[i % colors.length]);
  }
  const m4 = new THREE.Matrix4();
  function update({ e = 0, time = 0, yc = 0 } = {}) {
    items.forEach((it, i) => {
      const k = smoothstep(it.delay * 0.5, it.delay * 0.5 + 0.45, e);
      const y = yc + it.y * (0.55 + 0.45 * e) + ((time * it.rise) % 1) * 0.3 + Math.sin(time * 6.28 + it.ph) * 0.04;
      const s = it.s * k;
      m4.compose(new THREE.Vector3(it.x * (0.8 + 0.3 * e) + Math.sin(time * 4 + it.ph) * 0.03, y, it.z * (0.8 + 0.3 * e)), new THREE.Quaternion(), new THREE.Vector3(s, s * 1.15, s));
      inst.setMatrixAt(i, m4);
    });
    inst.instanceMatrix.needsUpdate = true;
  }
  update();
  return { obj: inst, update };
}

/** Pedaços de ingredientes voando em volta da pilha (tomate, alface, cebola, migalhas). */
export function makeShards(kit, { seed = 61 } = {}) {
  const R = rng(seed);
  const root = new THREE.Group();
  const items = [];
  const add = (obj, extra) => {
    root.add(obj);
    items.push({
      obj,
      s0: obj.scale.clone(),
      a: R() * Math.PI * 2,
      r: 1.35 + R() * 0.75,
      y: -0.4 + R() * 3.4,
      ph: R() * 6.28,
      spin: new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(2.4),
      rot0: new THREE.Euler(R() * 6, R() * 6, R() * 6),
      delay: R() * 0.4,
      base: extra?.scale ?? 1,
      ...extra,
    });
  };
  // fatias de tomate pequenas
  for (let i = 0; i < 4; i++) {
    const t = makeTomato(kit, { slices: 1, radius: 0.17 + R() * 0.05, seed: 70 + i });
    add(t.obj, { scale: 1 });
  }
  // folhas de alface
  for (let i = 0; i < 4; i++) {
    const geo = polarSurface({
      rings: 14,
      segs: 56,
      radius: () => 0.2 + R() * 0.06,
      height: (rho, th, x, z) => 0.05 * rho * rho * Math.sin(th * 5 + i) + 0.03 * noise3(x * 6, z * 6, i),
    });
    add(shadow(new THREE.Mesh(geo, kit.M.lettuce)), { scale: 1 });
  }
  // arcos de cebola
  for (let i = 0; i < 4; i++) {
    const g = new THREE.TorusGeometry(0.2 + R() * 0.12, 0.022, 8, 40, Math.PI * (0.7 + R() * 0.6));
    add(shadow(new THREE.Mesh(g, i % 2 ? kit.M.onion : kit.M.onionPale)), { scale: 1 });
  }
  // migalhas de pão
  const crumbGeo = new THREE.IcosahedronGeometry(1, 0);
  for (let i = 0; i < 8; i++) {
    const m = shadow(new THREE.Mesh(crumbGeo, kit.M.sesame));
    m.scale.set(0.03 + R() * 0.03, 0.025 + R() * 0.02, 0.03 + R() * 0.03);
    add(m, { scale: 1, crumb: true });
  }
  function update({ e = 0, time = 0, yc = 0 } = {}) {
    for (const it of items) {
      const k = smoothstep(it.delay * 0.5, it.delay * 0.5 + 0.5, e);
      it.obj.visible = k > 0.01;
      if (!it.obj.visible) continue;
      const a = it.a + time * 0.35 + Math.sin(time * 1.3 + it.ph) * 0.15;
      const r = it.r * (0.7 + 0.3 * e);
      it.obj.position.set(Math.cos(a) * r, yc - 1.6 + (it.y + 0.4) * (0.55 + 0.45 * e) + Math.sin(time * 2 + it.ph) * 0.06, Math.sin(a) * r * 0.55);
      it.obj.rotation.set(it.rot0.x + it.spin.x * time, it.rot0.y + it.spin.y * time, it.rot0.z + it.spin.z * time);
      it.obj.scale.copy(it.s0).multiplyScalar(k * it.base);
    }
  }
  update();
  return { obj: root, update };
}

export { deg };
