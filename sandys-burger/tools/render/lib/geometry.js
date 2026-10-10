// Construtores de geometria procedural: sólidos de revolução, superfícies polares e amostragem.
import * as THREE from 'three';

const clamp01 = (x) => Math.min(1, Math.max(0, x));

/**
 * Sólido de revolução com UV planar (vista de cima), bom para texturas orgânicas.
 * uvRadius(k, rho, arc) -> raio no UV (0..1); por padrão é o próprio rho (projeção de cima).
 * profile: [[rho, y], ...] do centro do topo, para fora, e de volta pelo fundo até o centro.
 * ragged(theta) -> multiplicador de raio (bordas irregulares)
 * displace(x, y, z, rho, theta, k) -> deslocamento ao longo da normal do perfil
 * groups: [{ from, to, material }] em linhas do perfil
 */
export function revolved({ profile, segments = 128, ragged, displace, groups, uvRadius }) {
  const K = profile.length;
  const S = segments;
  const pos = new Float32Array(K * S * 3);
  const uv = new Float32Array(K * S * 2);

  // comprimento de arco acumulado ao longo do perfil (para UVs sem esticamento nas laterais)
  const arc = new Float32Array(K);
  for (let k = 1; k < K; k++) arc[k] = arc[k - 1] + Math.hypot(profile[k][0] - profile[k - 1][0], profile[k][1] - profile[k - 1][1]);

  const nrho = new Float32Array(K);
  const ny = new Float32Array(K);
  for (let k = 0; k < K; k++) {
    const p = profile[Math.max(0, k - 1)];
    const n = profile[Math.min(K - 1, k + 1)];
    const tr = n[0] - p[0];
    const ty = n[1] - p[1];
    const len = Math.hypot(tr, ty) || 1;
    nrho[k] = -ty / len;
    ny[k] = tr / len;
  }

  for (let j = 0; j < S; j++) {
    const th = (j / S) * Math.PI * 2;
    const c = Math.cos(th);
    const s = Math.sin(th);
    const rag = ragged ? ragged(th) : 1;
    for (let k = 0; k < K; k++) {
      const rho = profile[k][0];
      let y = profile[k][1];
      let x = rho * rag * c;
      let z = rho * rag * s;
      if (displace) {
        const a = displace(x, y, z, rho, th, k);
        x += a * nrho[k] * c;
        z += a * nrho[k] * s;
        y += a * ny[k];
      }
      const i = k * S + j;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      const rc = clamp01(uvRadius ? uvRadius(k, rho, arc) : rho);
      uv[i * 2] = 0.5 + 0.5 * rc * c;
      uv[i * 2 + 1] = 0.5 + 0.5 * rc * s;
    }
  }

  const index = [];
  for (let k = 0; k < K - 1; k++) {
    for (let j = 0; j < S; j++) {
      const a = k * S + j;
      const c = k * S + ((j + 1) % S);
      const b = (k + 1) * S + j;
      const d = (k + 1) * S + ((j + 1) % S);
      index.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  if (groups) {
    for (const g of groups) geo.addGroup(g.from * S * 6, (g.to - g.from) * S * 6, g.material);
  }
  geo.computeVertexNormals();
  fixPoleNormals(geo, S, K, profile);
  return geo;
}

function fixPoleNormals(geo, S, K, profile) {
  const nrm = geo.attributes.normal;
  for (const k of [0, K - 1]) {
    if (profile[k][0] > 1e-6) continue;
    const acc = new THREE.Vector3();
    for (let j = 0; j < S; j++) acc.add(new THREE.Vector3().fromBufferAttribute(nrm, k * S + j));
    acc.normalize();
    for (let j = 0; j < S; j++) nrm.setXYZ(k * S + j, acc.x, acc.y, acc.z);
  }
  nrm.needsUpdate = true;
}

/**
 * Superfície polar de uma face (folhas, molhos). radius(theta) e height(rho, theta, x, z).
 */
export function polarSurface({ rings = 32, segs = 128, radius = () => 1, height = () => 0 }) {
  const pos = new Float32Array((rings + 1) * segs * 3);
  const uv = new Float32Array((rings + 1) * segs * 2);
  for (let j = 0; j < segs; j++) {
    const th = (j / segs) * Math.PI * 2;
    const c = Math.cos(th);
    const s = Math.sin(th);
    const R = radius(th);
    for (let i = 0; i <= rings; i++) {
      const rho = i / rings;
      const x = rho * R * c;
      const z = rho * R * s;
      const y = height(rho, th, x, z);
      const idx = i * segs + j;
      pos[idx * 3] = x;
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = z;
      uv[idx * 2] = 0.5 + 0.5 * rho * c;
      uv[idx * 2 + 1] = 0.5 + 0.5 * rho * s;
    }
  }
  const index = [];
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * segs + j;
      const c = i * segs + ((j + 1) % segs);
      const b = (i + 1) * segs + j;
      const d = (i + 1) * segs + ((j + 1) % segs);
      index.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  // centro: normal única
  const nrm = geo.attributes.normal;
  const acc = new THREE.Vector3();
  for (let j = 0; j < segs; j++) acc.add(new THREE.Vector3().fromBufferAttribute(nrm, j));
  acc.normalize();
  for (let j = 0; j < segs; j++) nrm.setXYZ(j, acc.x, acc.y, acc.z);
  return geo;
}

/**
 * Sorteia pontos sobre a superfície (ponderado pela área). accept(cx, cy, cz, nx, ny, nz) filtra triângulos.
 * Retorna [{ p: Vector3, n: Vector3 }]
 */
export function sampleSurface(geo, count, accept, rand) {
  const pos = geo.attributes.position;
  const idx = geo.index;
  const tris = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  let total = 0;
  for (let i = 0; i < idx.count; i += 3) {
    a.fromBufferAttribute(pos, idx.getX(i));
    b.fromBufferAttribute(pos, idx.getX(i + 1));
    c.fromBufferAttribute(pos, idx.getX(i + 2));
    e1.subVectors(b, a);
    e2.subVectors(c, a);
    nrm.crossVectors(e1, e2);
    const area = nrm.length() * 0.5;
    if (area < 1e-9) continue;
    nrm.normalize();
    const cx = (a.x + b.x + c.x) / 3;
    const cy = (a.y + b.y + c.y) / 3;
    const cz = (a.z + b.z + c.z) / 3;
    if (accept && !accept(cx, cy, cz, nrm.x, nrm.y, nrm.z)) continue;
    total += area;
    tris.push({ i, area: total, nx: nrm.x, ny: nrm.y, nz: nrm.z });
  }
  const out = [];
  for (let n = 0; n < count; n++) {
    const r = rand() * total;
    let lo = 0;
    let hi = tris.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tris[mid].area < r) lo = mid + 1;
      else hi = mid;
    }
    const t = tris[lo];
    a.fromBufferAttribute(pos, idx.getX(t.i));
    b.fromBufferAttribute(pos, idx.getX(t.i + 1));
    c.fromBufferAttribute(pos, idx.getX(t.i + 2));
    let u = rand();
    let v = rand();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const p = new THREE.Vector3().copy(a).addScaledVector(e1.subVectors(b, a), u).addScaledVector(e2.subVectors(c, a), v);
    out.push({ p, n: new THREE.Vector3(t.nx, t.ny, t.nz) });
  }
  return out;
}

/** Tubo ao longo de uma curva com raio variável (molhos, bacon). */
export function taperedTube(points, radiusAt, tubular = 160, radial = 10, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'catmullrom', 0.5);
  const frames = curve.computeFrenetFrames(tubular, closed);
  const pos = [];
  const uv = [];
  const P = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, P);
    N.copy(frames.normals[i]);
    B.copy(frames.binormals[i]);
    const r = radiusAt(t);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const s = Math.sin(a);
      const c = -Math.cos(a);
      pos.push(P.x + r * (c * N.x + s * B.x), P.y + r * (c * N.y + s * B.y), P.z + r * (c * N.z + s * B.z));
      uv.push(t, j / radial);
    }
  }
  const index = [];
  for (let i = 0; i < tubular; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = (i + 1) * (radial + 1) + j;
      const c = (i + 1) * (radial + 1) + j + 1;
      const d = i * (radial + 1) + j + 1;
      index.push(a, b, d, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}
