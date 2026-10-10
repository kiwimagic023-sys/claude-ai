// Sequência de frames do hero: carregamento progressivo e escolha do conjunto (desktop/celular).
import { frames as cfg } from '../config';

export interface FrameSet {
  dir: string;
  count: number;
  width: number;
  height: number;
}

/** Celulares e economia de dados usam o conjunto menor (menos frames, menor resolução). */
export function pickFrameSet(): FrameSet {
  const small = window.matchMedia('(max-width: 767px)').matches;
  const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  return small || saver ? cfg.mobile : cfg.desktop;
}

const pad = (n: number): string => String(n).padStart(4, '0');

export class FrameSequence {
  readonly count: number;
  readonly width: number;
  readonly height: number;
  /** chamado a cada frame carregado */
  onFrame?: (index: number) => void;
  /** progresso de 0 a 1 */
  onProgress?: (ratio: number) => void;

  private readonly dir: string;
  private readonly images: (HTMLImageElement | undefined)[];
  private loaded = 0;
  private waiters: { ratio: number; resolve: () => void }[] = [];

  constructor(set: FrameSet) {
    this.count = set.count;
    this.width = set.width;
    this.height = set.height;
    this.dir = set.dir;
    this.images = new Array(set.count);
  }

  get ratio(): number {
    return this.loaded / this.count;
  }

  private url(index: number): string {
    return new URL(`${this.dir}/f${pad(index + 1)}.webp`, document.baseURI).href;
  }

  /** Ordem "grossa para fina": primeiro 1º e último, depois de 32 em 32, 16, 8... até todos. */
  private order(): number[] {
    const seen = new Set<number>();
    const out: number[] = [];
    const push = (i: number): void => {
      if (i >= 0 && i < this.count && !seen.has(i)) {
        seen.add(i);
        out.push(i);
      }
    };
    push(0);
    push(this.count - 1);
    for (let step = 32; step >= 1; step = Math.floor(step / 2)) {
      for (let i = 0; i < this.count; i += step) push(i);
    }
    return out;
  }

  /** Começa a baixar os frames (em paralelo, de forma limitada). */
  start(concurrency = 6): void {
    const queue = this.order();
    let next = 0;

    const pump = (): void => {
      while (next < queue.length && concurrency > 0) {
        const index = queue[next++];
        concurrency--;
        const img = new Image();
        img.decoding = 'async';
        const settle = (ok: boolean): void => {
          if (ok) this.images[index] = img;
          this.loaded++;
          concurrency++;
          this.onFrame?.(index);
          this.onProgress?.(this.ratio);
          this.waiters = this.waiters.filter((w) => {
            if (this.ratio >= w.ratio) {
              w.resolve();
              return false;
            }
            return true;
          });
          pump();
        };
        img.onload = () => settle(true);
        img.onerror = () => settle(false);
        img.src = this.url(index);
      }
    };
    pump();
  }

  /** Resolve quando pelo menos `ratio` dos frames tiverem carregado. */
  waitFor(ratio: number): Promise<void> {
    if (this.ratio >= ratio) return Promise.resolve();
    return new Promise((resolve) => this.waiters.push({ ratio, resolve }));
  }

  /** O frame exato já foi carregado? */
  has(index: number): boolean {
    return !!this.images[index];
  }

  /** Frame exato ou, se ainda não chegou, o mais próximo já carregado. */
  nearest(index: number): HTMLImageElement | undefined {
    const exact = this.images[index];
    if (exact) return exact;
    for (let d = 1; d < this.count; d++) {
      const a = this.images[index - d];
      if (a) return a;
      const b = this.images[index + d];
      if (b) return b;
    }
    return undefined;
  }
}
