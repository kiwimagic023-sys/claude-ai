import { useEffect, useRef } from 'react';

/** fundo de estrelas em canvas: leve, pausa fora da tela e respeita "reduzir movimento" */
export function Starfield({ density = 0.00018 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = ['255,255,255', '255,122,200', '167,123,255', '124,255,138', '120,190,255'];
    let stars: { x: number; y: number; r: number; s: number; t: number; c: string }[] = [];
    let w = 0, h = 0, raf = 0, visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.round(w * h * density), 260);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        s: Math.random() * 0.25 + 0.04,
        t: Math.random() * Math.PI * 2,
        c: colors[Math.random() < 0.75 ? 0 : 1 + Math.floor(Math.random() * 4)],
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        if (!reduced) {
          st.y -= st.s;
          if (st.y < -2) { st.y = h + 2; st.x = Math.random() * w; }
        }
        const a = 0.35 + 0.65 * Math.abs(Math.sin(st.t + time * 0.0012 * (st.s * 6)));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${st.c},${reduced ? 0.8 : a})`;
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (visible && !reduced) raf = requestAnimationFrame(loop);
    };
    const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };

    resize();
    start();
    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(0); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => { visible = !document.hidden; if (visible) start(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [density]);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
