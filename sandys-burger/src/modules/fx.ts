// Fumaça, partículas e faíscas roxas/rosas desenhadas num canvas 2D. Reagem ao mouse/toque e ao scroll.
import gsap from 'gsap';

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVy: number;
  r: number;
  depth: number;
  tw: number;
  hue: number;
}

interface Smoke {
  x: number;
  y: number;
  size: number;
  rot: number;
  vr: number;
  phase: number;
  speed: number;
  alpha: number;
  sprite: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
}

export interface FxOptions {
  canvas: HTMLCanvasElement;
  /** quantidade de partículas de poeira (padrão 70) */
  dust?: number;
  /** quantidade de blocos de fumaça (0 desliga) */
  smoke?: number;
  /** resolução interna em relação ao tamanho da tela (padrão 1) */
  scale?: number;
  /** fixa a cor das partículas (ex.: só rosa na abertura) */
  onlyPink?: boolean;
  /** ignora o scroll (abertura) */
  noScroll?: boolean;
}

const PINK = [255, 46, 154];
const PURPLE = [123, 47, 247];
const SOFT = [255, 179, 222];

const rand = (a: number, b: number): number => a + Math.random() * (b - a);

function makeSmokeSprite(color: number[]): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  for (let i = 0; i < 10; i++) {
    const x = 128 + rand(-62, 62);
    const y = 128 + rand(-62, 62);
    const r = rand(38, 84);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},0.5)`);
    grad.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

export class ParticleField {
  /** 0..1: intensidade de faíscas perto do hambúrguer (sobe com a explosão) */
  burn = 0;
  /** posição (px da tela) de onde saem as faíscas */
  anchor = { x: 0, y: 0 };

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly opts: Required<Omit<FxOptions, 'canvas'>>;
  private dust: Dust[] = [];
  private smoke: Smoke[] = [];
  private sparks: Spark[] = [];
  private sprites: HTMLCanvasElement[] = [];
  private w = 0;
  private h = 0;
  private pointer = { x: -9999, y: -9999, vx: 0, vy: 0, moved: 0 };
  private slow = 0;
  private running = false;
  private last = 0;
  private readonly onResize = (): void => this.resize();
  private readonly onMove = (x: number, y: number): void => {
    const p = this.pointer;
    if (p.x > -9000) {
      p.vx = x - p.x;
      p.vy = y - p.y;
      p.moved = Math.min(1, Math.hypot(p.vx, p.vy) / 60);
    }
    p.x = x;
    p.y = y;
  };
  private readonly onPointerMove = (e: PointerEvent): void => this.onMove(e.clientX, e.clientY);
  private readonly onTouchMove = (e: TouchEvent): void => {
    const t = e.touches[0];
    if (t) this.onMove(t.clientX, t.clientY);
  };
  private readonly onLeave = (): void => {
    this.pointer.x = this.pointer.y = -9999;
  };
  private readonly tick = (): void => this.frame();

  constructor(options: FxOptions) {
    this.canvas = options.canvas;
    this.ctx = options.canvas.getContext('2d', { alpha: true })!;
    this.opts = {
      dust: options.dust ?? 70,
      smoke: options.smoke ?? 8,
      scale: options.scale ?? 1,
      onlyPink: options.onlyPink ?? false,
      noScroll: options.noScroll ?? false,
    };
    this.sprites = [makeSmokeSprite(PINK), makeSmokeSprite(PURPLE)];
    this.resize();
    this.seed();
  }

  private resize(): void {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.round(this.w * this.opts.scale);
    this.canvas.height = Math.round(this.h * this.opts.scale);
  }

  private seed(): void {
    this.dust = Array.from({ length: this.opts.dust }, () => this.makeDust(true));
    this.smoke = Array.from({ length: this.opts.smoke }, (_, i) => ({
      x: rand(0, 1),
      y: rand(0.1, 1),
      size: rand(380, 760),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.0006, 0.0006),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.00008, 0.00022),
      alpha: rand(0.07, 0.14),
      sprite: i % 2,
    }));
  }

  private makeDust(anywhere: boolean): Dust {
    const baseVy = -rand(0.08, 0.34);
    return {
      x: rand(0, this.w),
      y: anywhere ? rand(0, this.h) : this.h + 10,
      vx: rand(-0.06, 0.06),
      vy: baseVy,
      baseVy,
      r: rand(0.6, 2.3),
      depth: rand(0.05, 0.5),
      tw: rand(0, Math.PI * 2),
      hue: this.opts.onlyPink ? 0 : Math.floor(rand(0, 3)),
    };
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onLeave, { passive: true });
    document.addEventListener('mouseleave', this.onLeave);
    gsap.ticker.add(this.tick);
  }

  stop(): void {
    this.running = false;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onLeave);
    document.removeEventListener('mouseleave', this.onLeave);
    gsap.ticker.remove(this.tick);
  }

  /** Explosão de faíscas num ponto (ex.: clique ou troca de etapa). */
  burst(x: number, y: number, n = 24): void {
    for (let i = 0; i < n; i++) this.spawnSpark(x, y, 1.6);
  }

  private spawnSpark(x: number, y: number, power = 1): void {
    if (this.sparks.length > 160) return;
    const a = rand(0, Math.PI * 2);
    const s = rand(0.6, 3.2) * power;
    this.sparks.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - rand(0.4, 1.6),
      life: 0,
      max: rand(0.7, 1.6),
      size: rand(0.8, 2.2),
      hue: Math.floor(rand(0, 3)),
    });
  }

  private frame(): void {
    if (document.hidden) return;
    const now = performance.now();
    const dtMs = Math.min(64, now - this.last);
    this.last = now;
    const dt = dtMs / 16.667;

    // quando o aparelho engasga, reduz o efeito automaticamente
    if (dtMs > 30) this.slow++;
    else this.slow = Math.max(0, this.slow - 1);
    if (this.slow > 90 && this.dust.length > 22) {
      this.dust.length = Math.floor(this.dust.length * 0.6);
      this.smoke.length = Math.min(this.smoke.length, 3);
      this.slow = 0;
    }

    const { ctx, w, h } = this;
    const k = this.opts.scale;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    const sy = this.opts.noScroll ? 0 : window.scrollY;
    const ptr = this.pointer;
    ptr.moved *= 0.92;

    // fumaça
    for (const s of this.smoke) {
      s.phase += s.speed * dtMs;
      s.rot += s.vr * dtMs;
      const px = (s.x + Math.sin(s.phase) * 0.06) * w;
      const span = h + 400;
      const base = (s.y + Math.cos(s.phase * 0.8) * 0.05) * h - sy * 0.06;
      const py = ((base % span) + span) % span - 200;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(s.rot);
      ctx.globalAlpha = s.alpha * (0.85 + 0.15 * Math.sin(s.phase * 3));
      ctx.drawImage(this.sprites[s.sprite], -s.size / 2, -s.size / 2, s.size, s.size);
      ctx.restore();
    }

    // poeira
    const R = 150;
    for (const p of this.dust) {
      const dx = p.x - ptr.x;
      const dy = p.y - ptr.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R && d2 > 1) {
        const d = Math.sqrt(d2);
        const f = (1 - d / R) ** 2 * (0.9 + ptr.moved * 2.2);
        p.vx += (dx / d) * f * dt;
        p.vy += (dy / d) * f * dt;
      }
      p.vx *= 0.97;
      p.vy += (p.baseVy - p.vy) * 0.03;
      p.x += p.vx * dt * 1.4;
      p.y += p.vy * dt * 1.4;
      if (p.y < -10) Object.assign(p, this.makeDust(false));
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      p.tw += 0.03 * dt;
      const yy = (((p.y - sy * p.depth) % (h + 20)) + h + 20) % (h + 20);
      const col = p.hue === 0 ? PINK : p.hue === 1 ? PURPLE : SOFT;
      const a = 0.35 + 0.35 * Math.sin(p.tw);
      ctx.globalAlpha = Math.max(0.05, a);
      ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
      ctx.beginPath();
      ctx.arc(p.x, yy, p.r, 0, Math.PI * 2);
      ctx.fill();
      if (p.r > 1.6) {
        ctx.globalAlpha *= 0.18;
        ctx.beginPath();
        ctx.arc(p.x, yy, p.r * 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // faíscas: saem do hambúrguer quando ele se desmonta e do cursor quando o mouse corre
    if (this.burn > 0.02 && this.anchor.x > 0 && Math.random() < this.burn * 0.65 * dt) {
      this.spawnSpark(this.anchor.x + rand(-170, 170), this.anchor.y + rand(-210, 210), 0.9);
    }
    if (ptr.moved > 0.25 && ptr.x > -9000 && Math.random() < ptr.moved * 0.7 * dt) {
      this.spawnSpark(ptr.x, ptr.y, 0.7);
    }

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life += dtMs / 1000;
      if (s.life >= s.max) {
        this.sparks.splice(i, 1);
        continue;
      }
      s.vy -= 0.012 * dt;
      s.vx *= 0.99;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const a = 1 - s.life / s.max;
      const col = s.hue === 0 ? PINK : s.hue === 1 ? PURPLE : [255, 255, 255];
      ctx.globalAlpha = a;
      ctx.strokeStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
      ctx.lineWidth = s.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 3.2, s.y - s.vy * 3.2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
