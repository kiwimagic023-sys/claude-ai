// Estúdio 3D: luzes neon, ambiente, câmera, montagem das receitas e coreografia do hero.
import * as THREE from 'three';
import { clamp, lerp, smoothstep, deg } from './util.js';
import {
  createKit,
  makeTopBun,
  makeBottomBun,
  makePatty,
  makeCheese,
  makeLettuce,
  makeTomato,
  makeOnionRings,
  makeSauceSpiral,
  makeSquiggle,
  makeBacon,
  makePickles,
  makeDicedOnion,
  makeDroplets,
  makeShards,
} from './models.js';
import { makeFries, makeFryBox, makeFloor } from './extras.js';

function buildEnvironment(renderer) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), new THREE.MeshBasicMaterial({ color: 0x0a0510, side: THREE.BackSide })));
  const panel = (w, h, color, k, pos) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide, toneMapped: false }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(8, 16, '#ff2e9a', 3.4, [-17, 3, 3]); // rosa à esquerda
  panel(8, 16, '#7b2ff7', 3.2, [17, 3, 1]); // roxo à direita
  panel(16, 9, '#fff0dc', 2.7, [0, 18, 6]); // softbox quente no topo
  panel(20, 2.2, '#ffffff', 2.6, [0, 6, 20]); // tira frontal
  panel(16, 6, '#ffe6cf', 1.6, [0, 4, -18]); // fundo quente (reflexo suave)
  panel(5, 14, '#ff2e9a', 2.4, [-9, 3, -16]); // faixa rosa atrás à esquerda
  panel(5, 14, '#7b2ff7', 2.2, [9, 3, -16]); // faixa roxa atrás à direita
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.025).texture;
  pmrem.dispose();
  return tex;
}

const HERO_LAYERS = [
  // id, y da base montada, espessura, deslocamento explodido (dy, dx, dz), giros finais (rx, ry, rz em graus), atraso
  { id: 'bunBottom', yb: 0.0, h: 0.3, dy: -1.15, dx: 0.0, dz: 0.0, rx: 5, ry: -22, rz: -3, d: 0.0 },
  { id: 'sauce', yb: 0.285, h: 0.12, dy: -0.72, dx: -0.12, dz: 0.0, rx: -4, ry: 40, rz: 3, d: 0.14 },
  { id: 'pattyA', yb: 0.325, h: 0.075, dy: -0.3, dx: 0.1, dz: 0.0, rx: 4, ry: -28, rz: 4, d: 0.22 },
  { id: 'cheeseA', yb: 0.41, h: 0.03, dy: 0.1, dx: -0.14, dz: 0.0, rx: -3, ry: 30, rz: -5, d: 0.3 },
  { id: 'pattyB', yb: 0.445, h: 0.075, dy: 0.5, dx: 0.12, dz: 0.0, rx: 5, ry: -38, rz: 5, d: 0.3 },
  { id: 'cheeseB', yb: 0.53, h: 0.03, dy: 0.92, dx: -0.16, dz: 0.0, rx: -4, ry: 44, rz: -6, d: 0.3 },
  { id: 'lettuce', yb: 0.56, h: 0.11, dy: 1.4, dx: 0.2, dz: 0.0, rx: -7, ry: 52, rz: 6, d: 0.2 },
  { id: 'tomato', yb: 0.65, h: 0.12, dy: 1.88, dx: -0.22, dz: 0.0, rx: 8, ry: -55, rz: 8, d: 0.12 },
  { id: 'onion', yb: 0.76, h: 0.06, dy: 2.36, dx: 0.2, dz: 0.0, rx: -4, ry: 60, rz: -3, d: 0.06 },
  { id: 'bunTop', yb: 0.8, h: 0.57, dy: 2.95, dx: 0.0, dz: -0.1, rx: -12, ry: -40, rz: 6, d: 0.0 },
];

export class Studio {
  constructor({ width = 900, height = 1080, ss = 1.5, shadowSize = 2048 } = {}) {
    this.W = width;
    this.H = height;
    this.ss = ss;
    const canvas = document.createElement('canvas');
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1);
    r.setSize(Math.round(width * ss), Math.round(height * ss), false);
    r.setClearColor(0x000000, 0);
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    this.renderer = r;

    this.scene = new THREE.Scene();
    this.scene.environment = buildEnvironment(r);
    this.scene.environmentIntensity = 0.7;

    this.camera = new THREE.PerspectiveCamera(22, width / height, 0.1, 100);

    // luzes
    this.key = new THREE.DirectionalLight('#fff1de', 3.5);
    this.key.position.set(2.6, 7, 4.8);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(shadowSize, shadowSize);
    const sc = this.key.shadow.camera;
    sc.left = -4;
    sc.right = 4;
    sc.top = 5;
    sc.bottom = -5;
    sc.near = 1;
    sc.far = 22;
    this.key.shadow.bias = -0.0004;
    this.key.shadow.normalBias = 0.02;
    this.key.shadow.radius = 5;
    this.scene.add(this.key);

    this.pink = new THREE.PointLight('#ff2e9a', 40, 0, 2);
    this.pink.position.set(-4.2, 2.2, -2.4);
    this.scene.add(this.pink);
    this.purple = new THREE.PointLight('#7b2ff7', 38, 0, 2);
    this.purple.position.set(4.2, 1.8, -2.6);
    this.scene.add(this.purple);
    this.pinkFill = new THREE.PointLight('#ff2e9a', 5, 0, 2);
    this.pinkFill.position.set(-3, -0.4, 4.5);
    this.scene.add(this.pinkFill);

    this.bounce = new THREE.HemisphereLight('#000000', '#8a5a3a', 0.9);
    this.scene.add(this.bounce);

    this.kit = createKit();
    this.world = new THREE.Group();
    this.scene.add(this.world);
    this.current = null;
  }

  clear() {
    if (!this.current) return;
    this.world.remove(this.current.root);
    if (this.current.extra) this.world.remove(this.current.extra);
    this.current.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    this.current = null;
  }

  // -------------------------------------------------------------------------------------------
  /** Hambúrguer do hero: camadas separadas que se abrem e se encaixam. */
  setHero() {
    this.clear();
    const k = this.kit;
    const root = new THREE.Group();
    const parts = {
      bunBottom: makeBottomBun(k),
      sauce: makeSauceSpiral(k, { radius: 0.72, turns: 3.0, tube: 0.066, rise: 0.16 }),
      pattyA: makePatty(k, { seed: 7 }),
      cheeseA: makeCheese(k, { seed: 9 }),
      pattyB: makePatty(k, { seed: 12 }),
      cheeseB: makeCheese(k, { seed: 15 }),
      lettuce: makeLettuce(k),
      tomato: makeTomato(k),
      onion: makeOnionRings(k),
      bunTop: makeTopBun(k),
    };
    const layers = HERO_LAYERS.map((L, i) => {
      const part = parts[L.id];
      const holder = new THREE.Group();
      part.obj.position.y = -L.h / 2;
      if (L.id === 'cheeseA') part.obj.rotation.y = Math.PI / 4 + 0.1;
      if (L.id === 'cheeseB') part.obj.rotation.y = Math.PI / 4 - 0.14;
      holder.add(part.obj);
      root.add(holder);
      return { ...L, part, holder, ph: i * 1.7, yc: L.yb + L.h / 2 };
    });
    const droplets = makeDroplets(k);
    root.add(droplets.obj);
    const shards = makeShards(k);
    root.add(shards.obj);
    this.world.add(root);
    this.current = { kind: 'hero', root, layers, droplets, shards, byId: parts };
  }

  /** t em [0, 1]: roteiro do scroll. */
  poseHero(t) {
    const S = this.current;
    const time = t * 3.2;
    const e0 = smoothstep(0.04, 0.34, t) * (1 - smoothstep(0.6, 0.9, t));
    // derretimento e gotas do queijo
    const m = lerp(0.42, 1, smoothstep(0.08, 0.4, t)) * lerp(1, 0.72, smoothstep(0.82, 1, t));
    const drip = lerp(0.14, 0.95, smoothstep(0.1, 0.5, t)) * lerp(1, 0.82, smoothstep(0.8, 1, t)) * lerp(1, 1.05, smoothstep(0.55, 0.75, t));

    for (const L of S.layers) {
      const e = smoothstep(L.d, L.d + 0.62, e0);
      const sw = Math.sin(time * 2.1 + L.ph);
      const sw2 = Math.cos(time * 1.7 + L.ph * 1.3);
      L.holder.position.set(L.dx * e + 0.05 * sw2 * e, L.yc + L.dy * e + 0.05 * sw * e, L.dz * e);
      L.holder.rotation.set(deg(L.rx) * e + deg(4) * sw2 * e, deg(L.ry) * e + deg(10) * sw * e, deg(L.rz) * e + deg(3) * sw * e);
    }
    S.byId.cheeseA.update({ m, drip, time });
    S.byId.cheeseB.update({ m: m * 0.95, drip: drip * 0.92, time: time + 1 });
    S.byId.bunTop.update({ lift: e0, time, drip: smoothstep(0.1, 0.5, t) * (1 - smoothstep(0.62, 0.86, t)) });
    S.droplets.update({ e: e0, time, yc: 0.7 + 1.05 * e0 });
    S.shards.update({ e: e0, time, yc: 0.7 + 1.05 * e0 });

    // câmera: enquadra a pilha real (cresce junto com a explosão)
    let top = -Infinity;
    let bottom = Infinity;
    for (const L of S.layers) {
      const y = L.holder.position.y;
      const e = smoothstep(L.d, L.d + 0.62, e0);
      top = Math.max(top, y + L.h / 2 + 0.06 + (L.id === 'bunTop' ? 0.28 * e : 0.12 * e));
      bottom = Math.min(bottom, y - L.h / 2 - 0.05 - 0.1 * e);
    }
    const el = lerp(deg(11), deg(19), e0);
    const projected = (top - bottom) * Math.cos(el) + 2.3 * Math.sin(el);
    const vh = Math.max(3.7, projected * 1.1 + 0.25);
    const dist = vh / 2 / Math.tan(deg(this.camera.fov / 2));
    const ty = (top + bottom) / 2 + 0.04;
    this.world.rotation.set(0, lerp(deg(-26), deg(18), t), deg(-9) * e0);
    this.camera.position.set(0, ty + Math.sin(el) * dist, Math.cos(el) * dist);
    this.camera.lookAt(0, ty, 0);
    const pulse = 1 + 0.5 * smoothstep(0.88, 1, t);
    this.pink.intensity = 40 * pulse;
    this.purple.intensity = 38 * pulse;
    return { e0 };
  }

  // -------------------------------------------------------------------------------------------
  /**
   * Hambúrguer montado para o cardápio e a galeria.
   * recipe: { patties, extras: [...], lift }
   */
  setRecipe({ patties = 2, extras = [], lift = 0.3 } = {}) {
    this.clear();
    const k = this.kit;
    const root = new THREE.Group();
    const stack = []; // { part, yb, h }
    let y = 0;
    const put = (part, opts = {}) => {
      const yb = y + (opts.dy ?? 0);
      stack.push({ part, yb, h: part.h, rot: opts.rot ?? 0, x: opts.x ?? 0, z: opts.z ?? 0 });
      y = yb + (opts.h ?? part.h) + (opts.gap ?? 0);
      return stack[stack.length - 1];
    };
    const bun = makeBottomBun(k);
    put(bun, { dy: 0, h: 0.285 });
    if (extras.includes('sauce')) put(makeSauceSpiral(k, { radius: 0.7 }), { dy: -0.01, h: 0.04 });
    const cheeses = [];
    for (let i = 0; i < patties; i++) {
      put(makePatty(k, { seed: 7 + i * 5 }), { dy: i === 0 ? 0.03 : 0.0, h: 0.072 });
      const c = makeCheese(k, { seed: 9 + i * 6 });
      cheeses.push(c);
      put(c, { dy: 0.003, h: 0.03, rot: Math.PI / 4 + (i % 2 ? -0.14 : 0.1) });
    }
    if (extras.includes('bacon')) put(makeBacon(k), { dy: 0.0, h: 0.07 });
    if (extras.includes('lettuce')) put(makeLettuce(k), { dy: 0.0, h: 0.09, rot: 0.5 });
    if (extras.includes('tomato')) put(makeTomato(k, { slices: 2 }), { dy: -0.01, h: 0.115 });
    if (extras.includes('dicedOnion')) put(makeDicedOnion(k), { dy: -0.005, h: 0.06 });
    if (extras.includes('pickles')) put(makePickles(k), { dy: 0.0, h: 0.04 });
    if (extras.includes('mayo')) put(makeSauceSpiral(k, { mat: 'mayo', radius: 0.62, turns: 2.6, tube: 0.05 }), { dy: -0.005, h: 0.07 });
    if (extras.includes('ketchup')) put(makeSquiggle(k, { mat: 'ketchup', angle: 0.3, length: 1.55, amp: 0.2 }), { dy: -0.01, h: 0.05 });
    if (extras.includes('mustard')) put(makeSquiggle(k, { mat: 'mustard', angle: -0.5, length: 1.5, amp: 0.2, seed: 33 }), { dy: -0.025, h: 0.05 });
    const top = makeTopBun(k, { seed: 4 });
    const topEntry = put(top, { dy: 0.0, h: 0.5 });
    root.add(...stack.map((s) => {
      const g = new THREE.Group();
      g.add(s.part.obj);
      g.position.set(s.x, s.yb, s.z);
      g.rotation.y = s.rot;
      s.part.obj.userData.holder = g;
      return g;
    }));
    // pão de cima levemente erguido e inclinado (mostra os ingredientes)
    const g = top.obj.userData.holder;
    g.position.y += lift;
    g.position.x += lift * 0.3;
    g.rotation.z = -lift * 0.35;
    g.rotation.x = -lift * 0.2;
    const total = y + lift;
    cheeses.forEach((c, i) => c.update({ m: 0.85, drip: 0.75 - i * 0.05, time: i }));
    top.update({ lift: 0, time: 0 });
    this.world.add(root);
    this.current = { kind: 'recipe', root, total, topEntry };
    return total;
  }

  /** Câmera para a cena montada. */
  frameRecipe({ az = 22, el = 22, fit = 1, ty = null, roll = 0 } = {}) {
    const S = this.current;
    const h = S.total;
    this.world.rotation.set(0, deg(az), deg(roll));
    const dist = (Math.max(h * 1.1 + 1.2, 2.5) * fit) / 2 / Math.tan(deg(this.camera.fov / 2)) * 1.05;
    const t = ty ?? h * 0.46;
    this.camera.position.set(0, t + Math.sin(deg(el)) * dist, Math.cos(deg(el)) * dist);
    this.camera.lookAt(0, t, 0);
  }

  // -------------------------------------------------------------------------------------------
  /** Monta uma cena a partir de um item de shots.mjs. */
  setScene(shot) {
    this.scene.remove(...this.scene.children.filter((o) => o.userData.floor));
    this.bg = shot.bg ?? null;
    const addFloor = () => {
      const f = makeFloor();
      f.userData.floor = true;
      this.scene.add(f);
    };
    if (shot.kind === 'burger') {
      this.setRecipe({ patties: shot.patties, extras: shot.extras, lift: shot.lift });
      if (shot.floor) addFloor();
      this.frameRecipe({ az: shot.az, el: shot.el, fit: shot.fit, roll: shot.roll ?? 0, ty: shot.ty ?? null });
    } else if (shot.kind === 'combo') {
      this.setRecipe({ patties: shot.patties, extras: shot.extras, lift: shot.lift });
      const total = this.current.total;
      const burger = this.current.root;
      burger.scale.setScalar(0.9);
      burger.position.set(0.78, 0, 0.6);
      const box = makeFryBox();
      const fries = makeFries({});
      const group = new THREE.Group();
      group.add(box.obj, fries.obj);
      group.position.set(-1.0, 0, -0.45);
      group.rotation.y = 0.5;
      this.current.root.parent.add(group);
      this.current.extra = group;
      if (shot.floor) addFloor();
      this.current.total = total;
      this.frameRecipe({ az: shot.az, el: shot.el, fit: shot.fit, ty: shot.ty ?? total * 0.5 });
    }
  }

  // -------------------------------------------------------------------------------------------
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /** Reduz a imagem renderizada ao tamanho final e devolve base64 (sem prefixo). */
  async encode({ type = 'image/webp', quality = 0.8, width = this.W, height = this.H, bloom = 0 } = {}) {
    const out = document.createElement('canvas');
    out.width = width;
    out.height = height;
    const ctx = out.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (this.bg) {
      const bg = this.bg;
      const g = ctx.createRadialGradient(width * (bg.x ?? 0.5), height * (bg.y ?? 0.62), 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
      bg.stops.forEach(([p, c]) => g.addColorStop(p, c));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(this.renderer.domElement, 0, 0, width, height);
    if (bloom > 0) {
      const glow = document.createElement('canvas');
      glow.width = width;
      glow.height = height;
      const g = glow.getContext('2d');
      g.filter = `blur(${Math.round(width * 0.012)}px) brightness(1.25) saturate(1.25)`;
      g.drawImage(out, 0, 0);
      g.filter = 'none';
      if (!this.bg) {
        g.globalCompositeOperation = 'destination-in';
        g.drawImage(out, 0, 0);
      }
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = bloom;
      ctx.drawImage(glow, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    const blob = await new Promise((res) => out.toBlob(res, type, quality));
    const buf = new Uint8Array(await blob.arrayBuffer());
    let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return btoa(bin);
  }
}
