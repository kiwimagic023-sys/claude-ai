// Extras das fotos da galeria: caixa de batata com a marca, batatas fritas e piso escuro.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { rng, noise3, fbm3, smoothstep, clamp } from './util.js';

// contorno do "S'" (mesmo desenho do logo em public/brand/logo.svg)
const S_PATH =
  'M54.34 88Q46.81 88 43.48 84.25Q40.15 80.50 40.15 72.31L40.15 66.94L51.03 66.94L51.03 73.81Q51.03 75.72 51.61 76.80Q52.18 77.88 53.62 77.88Q55.12 77.88 55.70 77Q56.28 76.13 56.28 74.13Q56.28 71.59 55.78 69.89Q55.28 68.19 54.04 66.64Q52.81 65.09 50.62 63.03L45.68 58.34Q40.15 53.13 40.15 46.41Q40.15 39.38 43.42 35.69Q46.68 32 52.87 32Q60.43 32 63.61 36.03Q66.78 40.06 66.78 48.28L55.59 48.28L55.59 44.50Q55.59 43.38 54.95 42.75Q54.31 42.13 53.22 42.13Q51.90 42.13 51.29 42.86Q50.68 43.59 50.68 44.75Q50.68 45.91 51.31 47.25Q51.93 48.59 53.78 50.34L60.12 56.44Q62.03 58.25 63.62 60.27Q65.22 62.28 66.18 64.95Q67.15 67.63 67.15 71.47Q67.15 79.22 64.29 83.61Q61.43 88 54.34 88Z';
const A_PATH = 'M77.48 52.38L71.98 52.38L68.85 32.50L79.85 32.50Z';

function drawLogo(g, x, y, size) {
  g.save();
  g.translate(x, y);
  g.scale(size / 120, size / 120);
  g.lineJoin = 'round';
  g.beginPath();
  g.arc(60, 60, 53, 0, Math.PI * 2);
  g.strokeStyle = '#ff2e9a';
  g.lineWidth = 8.5;
  g.stroke();
  g.strokeStyle = '#ffffff';
  g.lineWidth = 4;
  g.stroke();
  for (const d of [S_PATH, A_PATH]) {
    const p = new Path2D(d);
    g.strokeStyle = '#ff2e9a';
    g.lineWidth = 3.4;
    g.stroke(p);
    g.fillStyle = '#ffffff';
    g.fill(p);
  }
  g.restore();
}

function boxTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 640);
  grad.addColorStop(0, '#2a1146');
  grad.addColorStop(1, '#130a1d');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 640);
  // grão de papel
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
    g.fillRect(Math.random() * 512, Math.random() * 640, 2, 2);
  }
  // faixa rosa no topo (a borda da caixa)
  const band = g.createLinearGradient(0, 0, 512, 0);
  band.addColorStop(0, '#7b2ff7');
  band.addColorStop(1, '#ff2e9a');
  g.fillStyle = band;
  g.fillRect(0, 0, 512, 64);
  drawLogo(g, 134, 150, 244);
  g.fillStyle = '#ffffff';
  g.textAlign = 'center';
  g.font = 'bold 66px "Liberation Sans Narrow", "DejaVu Sans Condensed", Arial, sans-serif';
  g.fillText("SANDY'S", 256, 490);
  g.fillStyle = '#ffb3de';
  g.font = 'bold 28px "Liberation Sans", "DejaVu Sans", Arial, sans-serif';
  g.fillText('B U R G E R', 256, 540);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.x = 4;
  t.anisotropy = 8;
  return t;
}

function fryTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const g = c.getContext('2d');
  const img = g.createImageData(128, 512);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 128; x++) {
      const n = fbm3(x * 0.06, y * 0.02, 3.3, 3);
      const crisp = smoothstep(0.1, 0.5, fbm3(x * 0.09 + 5, y * 0.05, 1.1, 3));
      const tip = smoothstep(0.82, 1, y / 512) * 0.5;
      const k = 1 + n * 0.25 - crisp * 0.18 - tip * 0.3;
      const o = (y * 128 + x) * 4;
      img.data[o] = clamp(246 * k, 0, 255);
      img.data[o + 1] = clamp(190 * k - crisp * 20, 0, 255);
      img.data[o + 2] = clamp(70 * k, 0, 255);
      img.data[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Caixa de batata preta com a marca (tronco de pirâmide). */
export function makeFryBox() {
  const pts = [new THREE.Vector2(0.001, 0), new THREE.Vector2(0.64, 0), new THREE.Vector2(0.92, 1.12), new THREE.Vector2(0.9, 1.16)];
  const geo = new THREE.LatheGeometry(pts, 4, Math.PI / 4);
  const mat = new THREE.MeshPhysicalMaterial({
    map: boxTexture(),
    roughness: 0.55,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return { obj: mesh, h: 1.16 };
}

/** Batatas fritas saindo da caixa. */
export function makeFries({ count = 54, seed = 77 } = {}) {
  const R = rng(seed);
  const geo = new RoundedBoxGeometry(0.075, 1, 0.075, 2, 0.022);
  const mat = new THREE.MeshPhysicalMaterial({ map: fryTexture(), roughness: 0.6, clearcoat: 0.25, clearcoatRoughness: 0.5 });
  const inst = new THREE.InstancedMesh(geo, mat, count);
  inst.castShadow = true;
  inst.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < count; i++) {
    const len = 1.05 + R() * 0.55;
    const r = Math.sqrt(R()) * 0.56;
    const a = R() * Math.PI * 2;
    const tilt = (R() - 0.5) * 0.4 + (r / 0.56) * 0.28;
    e.set(Math.sin(a) * tilt, R() * 6, -Math.cos(a) * tilt);
    q.setFromEuler(e);
    const top = 1.14 + 0.18 + R() * 0.5;
    m4.compose(new THREE.Vector3(Math.cos(a) * r, top - len / 2 + 0.02, Math.sin(a) * r), q, new THREE.Vector3(1 + R() * 0.25, len, 1 + R() * 0.25));
    inst.setMatrixAt(i, m4);
  }
  const obj = new THREE.Group();
  obj.add(inst);
  return { obj };
}

/** Piso invisível que só recebe a sombra (o fundo em degradê aparece por trás). */
export function makeFloor() {
  const geo = new THREE.CircleGeometry(16, 64);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.ShadowMaterial({ opacity: 0.62, color: 0x05020a });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  return mesh;
}

export { noise3 };
