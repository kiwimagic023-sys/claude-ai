/**
 * Motor da animação de abertura: monta uma pizza realista camada por camada.
 * As texturas (massa, molho, queijo, recheios) são geradas por tools/render_textures.py
 * e ficam em /public/intro. Aqui elas são combinadas de acordo com o progresso (0 a 1).
 */

const SIZE = 1024; // espaço da pizza (px das texturas)
const C = SIZE / 2;

const files = {
  shadow: 'shadow', doughRaw: 'dough-raw', doughBaked: 'dough-baked', sauce: 'sauce', sauceBaked: 'sauce-baked',
  cheese: 'cheese-melted', shreds: 'shreds', calRaw: 'calabresa-raw', calBaked: 'calabresa-baked',
  onionRaw: 'onion-raw', onionBaked: 'onion-baked', olive: 'olive', oregano: 'oregano',
} as const;
type Key = keyof typeof files;
export type Textures = Record<Key, HTMLImageElement>;

export const loadTextures = () =>
  Promise.all(
    (Object.keys(files) as Key[]).map(
      (k) =>
        new Promise<[Key, HTMLImageElement]>((resolve, reject) => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => resolve([k, img]);
          img.onerror = reject;
          img.src = `/intro/${files[k]}.webp`;
        }),
    ),
  ).then((entries) => Object.fromEntries(entries) as Textures);

// ---------- etapas da linha do tempo ----------

export const stages = [
  { id: 'massa', label: 'Massa', from: 0.0, to: 0.11 },
  { id: 'molho', label: 'Molho', from: 0.11, to: 0.23 },
  { id: 'queijo', label: 'Queijo', from: 0.23, to: 0.37 },
  { id: 'recheio', label: 'Recheio', from: 0.37, to: 0.53 },
  { id: 'forno', label: 'Forno', from: 0.53, to: 0.7 },
  { id: 'oregano', label: 'Orégano', from: 0.7, to: 0.78 },
  { id: 'corte', label: 'Corte', from: 0.78, to: 0.87 },
  { id: 'fatia', label: 'Pronta', from: 0.87, to: 1.0 },
] as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const stageT = (p: number, i: number) => clamp((p - stages[i].from) / (stages[i].to - stages[i].from));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

// ---------- posições (sempre as mesmas: gerador com semente) ----------

const mulberry = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Piece { x: number; y: number; rot: number; v: number; t: number; s: number }

const scatter = (n: number, maxR: number, seed: number, minDist = 0, scale = [1, 1]) => {
  const rnd = mulberry(seed);
  const out: Piece[] = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 60) {
    const r = maxR * Math.sqrt(rnd());
    const a = rnd() * Math.PI * 2;
    const x = C + r * Math.cos(a);
    const y = C + r * Math.sin(a);
    if (minDist && out.some((o) => (o.x - x) ** 2 + (o.y - y) ** 2 < minDist * minDist)) continue;
    out.push({ x, y, rot: rnd() * Math.PI * 2, v: Math.floor(rnd() * 64), t: rnd(), s: scale[0] + rnd() * (scale[1] - scale[0]) });
  }
  return out.sort((a, b) => a.t - b.t).map((p, i, arr) => ({ ...p, t: i / arr.length }));
};

const layout = {
  shreds: scatter(1300, 410, 1),
  calabresa: scatter(24, 370, 2, 70, [0.95, 1.08]),
  onion: scatter(12, 360, 3, 40, [0.9, 1.15]),
  olive: scatter(14, 385, 4, 50, [0.85, 1.05]),
  oregano: scatter(520, 420, 5),
};

/** ângulos das linhas de corte (8 fatias) */
const CUTS = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((a) => a + 0.2);
/** fatia que sai da pizza: entre dois cortes, apontando para baixo/direita */
const SLICE_A0 = CUTS[1];
const SLICE_A1 = CUTS[2];

// ---------- renderizador ----------

export class PizzaRenderer {
  private tex: Textures;
  private pizza: HTMLCanvasElement;
  private pctx: CanvasRenderingContext2D;
  private mask: HTMLCanvasElement;
  private mctx: CanvasRenderingContext2D;

  constructor(tex: Textures) {
    this.tex = tex;
    this.pizza = document.createElement('canvas');
    this.pizza.width = this.pizza.height = SIZE;
    this.pctx = this.pizza.getContext('2d')!;
    this.mask = document.createElement('canvas');
    this.mask.width = this.mask.height = SIZE;
    this.mctx = this.mask.getContext('2d')!;
  }

  /** desenha um sprite de uma folha (atlas) com centro em x,y */
  private sprite(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cell: number, count: number, p: Piece, scale: number, alpha: number, lift = 0) {
    if (alpha <= 0.002) return;
    const cols = Math.ceil(Math.sqrt(count));
    const i = p.v % count;
    const sx = (i % cols) * cell;
    const sy = Math.floor(i / cols) * cell;
    ctx.globalAlpha = alpha;
    ctx.setTransform(scale, 0, 0, scale, p.x, p.y - lift);
    ctx.rotate(p.rot);
    ctx.drawImage(img, sx, sy, cell, cell, -cell / 2, -cell / 2, cell, cell);
  }

  /** queda de um ingrediente: some -> aparece maior e "cai" no lugar */
  private drop(t: number, start: number, span: number) {
    const u = clamp((t - start) / span);
    return { u, scale: 1 + (1 - easeOut(u)) * 0.9, lift: (1 - easeOut(u)) * 70, alpha: clamp(u * 2.5) };
  }

  /** monta a pizza inteira no canvas interno para o progresso p */
  private compose(p: number) {
    const { pctx: ctx, tex } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, SIZE, SIZE);

    const k0 = easeInOut(stageT(p, 0));
    const k1 = stageT(p, 1);
    const k2 = stageT(p, 2);
    const k3 = stageT(p, 3);
    const bake = easeInOut(clamp((stageT(p, 4) - 0.15) / 0.75));
    const k5 = stageT(p, 5);
    const k6 = stageT(p, 6);

    // massa sendo aberta: começa pequena e alta, termina larga
    ctx.save();
    const grow = 0.42 + 0.58 * k0;
    const puff = 1 + bake * 0.018;
    ctx.translate(C, C);
    ctx.scale(grow * puff, grow * puff);
    ctx.rotate((1 - k0) * -0.6);
    ctx.translate(-C, -C);

    ctx.globalAlpha = 0.85;
    ctx.drawImage(tex.shadow, 14, 22);
    ctx.globalAlpha = 1;
    ctx.drawImage(tex.doughRaw, 0, 0);
    if (bake > 0) {
      ctx.globalAlpha = bake;
      ctx.drawImage(tex.doughBaked, 0, 0);
      ctx.globalAlpha = 1;
    }

    // molho espalhado do centro para fora, em espiral
    if (k1 > 0) {
      const m = this.mctx;
      m.setTransform(1, 0, 0, 1, 0, 0);
      m.globalCompositeOperation = 'source-over';
      m.clearRect(0, 0, SIZE, SIZE);
      if (k1 < 1) {
        const e = easeOut(k1);
        m.beginPath();
        for (let i = 0; i <= 96; i++) {
          const a = (i / 96) * Math.PI * 2;
          const swirl = 1 - 0.22 * (((a / (Math.PI * 2)) + k1 * 2.2) % 1) * (1 - e);
          const r = 480 * e * swirl * (1 + 0.05 * Math.sin(a * 5 + k1 * 9) + 0.025 * Math.sin(a * 11));
          const x = C + Math.cos(a) * r;
          const y = C + Math.sin(a) * r;
          if (i === 0) m.moveTo(x, y);
          else m.lineTo(x, y);
        }
        m.fillStyle = '#000';
        m.fill();
        m.globalCompositeOperation = 'source-in';
      }
      m.drawImage(tex.sauce, 0, 0);
      if (bake > 0) {
        m.globalAlpha = bake;
        m.drawImage(tex.sauceBaked, 0, 0);
        m.globalAlpha = 1;
      }
      ctx.drawImage(this.mask, 0, 0);
    }
    ctx.restore();

    // daqui em diante tudo no mesmo espaço (com o leve "crescimento" do forno)
    const base = () => ctx.setTransform(puff, 0, 0, puff, C * (1 - puff), C * (1 - puff));

    // queijo ralado caindo; no forno ele derrete
    if (k2 > 0) {
      const raw = 1 - clamp(bake * 1.25);
      if (raw > 0) {
        for (const s of layout.shreds) {
          const d = this.drop(k2, s.t * 0.85, 0.15);
          if (d.u <= 0) break;
          this.sprite(ctx, tex.shreds, 48, 12, s, d.scale * 0.85, d.alpha * raw, d.lift * 0.6);
        }
      }
      if (bake > 0) {
        base();
        ctx.globalAlpha = clamp(bake * 1.15);
        ctx.drawImage(tex.cheese, 0, 0);
      }
    }

    // recheio: calabresa, cebola e azeitona
    if (k3 > 0) {
      const groups: [Piece[], number, number, HTMLImageElement, HTMLImageElement, number, number][] = [
        [layout.calabresa, 0, 0.5, tex.calRaw, tex.calBaked, 96, 6],
        [layout.onion, 0.35, 0.4, tex.onionRaw, tex.onionBaked, 112, 6],
        [layout.olive, 0.62, 0.38, tex.olive, tex.olive, 64, 6],
      ];
      for (const [pieces, start, span, rawImg, bakedImg, cell, count] of groups) {
        for (const pc of pieces) {
          const d = this.drop(k3, start + pc.t * span * 0.7, span * 0.3);
          if (d.u <= 0) break;
          const shrink = 1 - bake * 0.06;
          this.sprite(ctx, rawImg, cell, count, pc, d.scale * pc.s * shrink * puff, d.alpha * (1 - bake), d.lift);
          if (bake > 0) this.sprite(ctx, bakedImg, cell, count, pc, d.scale * pc.s * shrink * puff, d.alpha * bake, d.lift);
        }
      }
    }

    // orégano
    if (k5 > 0) {
      for (const o of layout.oregano) {
        const d = this.drop(k5, o.t * 0.8, 0.2);
        if (d.u <= 0) break;
        this.sprite(ctx, tex.oregano, 16, 16, o, d.scale * 0.9, d.alpha * 0.9, d.lift * 0.4);
      }
    }

    // cortes: a carretilha passa de ponta a ponta
    if (k6 > 0) {
      base();
      ctx.globalAlpha = 1;
      ctx.lineCap = 'round';
      CUTS.forEach((a, i) => {
        const t = clamp(k6 * CUTS.length - i);
        if (t <= 0) return;
        const r = 468;
        const x0 = C - Math.cos(a) * r;
        const y0 = C - Math.sin(a) * r;
        const x1 = x0 + Math.cos(a) * r * 2 * easeOut(t);
        const y1 = y0 + Math.sin(a) * r * 2 * easeOut(t);
        ctx.strokeStyle = 'rgba(70, 24, 10, 0.55)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 230, 190, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x0 + 2, y0 + 2);
        ctx.lineTo(x1 + 2, y1 + 2);
        ctx.stroke();
      });
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }

  private wedge(ctx: CanvasRenderingContext2D, ox = 0, oy = 0, fresh = true) {
    if (fresh) ctx.beginPath();
    ctx.moveTo(C + ox, C + oy);
    ctx.arc(C + ox, C + oy, 520, SLICE_A0, SLICE_A1);
    ctx.closePath();
  }

  /**
   * desenha no canvas de destino (quadrado), já com a fatia sendo puxada no final.
   * `spin` = rotação da pizza (radianos).
   */
  render(target: CanvasRenderingContext2D, p: number, spin: number) {
    this.compose(p);
    const w = target.canvas.width;
    const k = w / SIZE;
    const pull = easeInOut(clamp((stageT(p, 7) - 0.05) / 0.8));
    target.setTransform(1, 0, 0, 1, 0, 0);
    target.clearRect(0, 0, w, w);
    target.setTransform(k, 0, 0, k, 0, 0);
    target.translate(C, C);
    target.rotate(spin);
    target.translate(-C, -C);

    if (pull <= 0) {
      target.drawImage(this.pizza, 0, 0);
      return;
    }

    // pizza sem a fatia
    target.save();
    target.beginPath();
    target.rect(-SIZE, -SIZE, SIZE * 3, SIZE * 3);
    this.wedge(target, 0, 0, false);
    target.clip('evenodd');
    target.drawImage(this.pizza, 0, 0);
    target.restore();

    const mid = (SLICE_A0 + SLICE_A1) / 2;
    const dist = pull * 150;
    const ox = Math.cos(mid) * dist;
    const oy = Math.sin(mid) * dist;

    // fios de queijo esticando entre a fatia e a pizza
    const stretch = clamp(1 - Math.max(0, pull - 0.55) / 0.45);
    if (stretch > 0) {
      target.lineCap = 'round';
      for (const a of [SLICE_A0, SLICE_A1]) {
        for (let i = 0; i < 6; i++) {
          const r = 90 + i * 60 + (i % 2) * 18;
          const x0 = C + Math.cos(a) * r;
          const y0 = C + Math.sin(a) * r;
          const sag = (i % 3) * 6 + 10;
          const width = (7 - i * 0.6) * stretch * (1 - pull * 0.5);
          if (width <= 0.3) continue;
          const g = target.createLinearGradient(x0, y0, x0 + ox, y0 + oy);
          g.addColorStop(0, `rgba(250, 226, 160, ${0.95 * stretch})`);
          g.addColorStop(0.5, `rgba(255, 240, 200, ${0.85 * stretch})`);
          g.addColorStop(1, `rgba(244, 206, 120, ${0.95 * stretch})`);
          target.strokeStyle = g;
          target.lineWidth = width;
          target.beginPath();
          target.moveTo(x0, y0);
          target.quadraticCurveTo(x0 + ox / 2 + sag, y0 + oy / 2 + sag, x0 + ox, y0 + oy);
          target.stroke();
        }
      }
    }

    // a fatia, com sombra própria
    const sctx = this.mctx;
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.globalCompositeOperation = 'source-over';
    sctx.globalAlpha = 1;
    sctx.clearRect(0, 0, SIZE, SIZE);
    sctx.save();
    this.wedge(sctx);
    sctx.clip();
    sctx.drawImage(this.pizza, 0, 0);
    sctx.restore();
    target.save();
    target.shadowColor = 'rgba(0, 0, 0, 0.55)';
    target.shadowBlur = 36 * k;
    target.shadowOffsetX = 16 * k;
    target.shadowOffsetY = 24 * k;
    target.drawImage(this.mask, ox, oy);
    target.restore();
  }
}
