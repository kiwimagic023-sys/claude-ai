import { useEffect, useState, type RefObject } from 'react';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animações ligadas à rolagem: escreve em --p o progresso (0 a 1) da rolagem
 * dentro do elemento (que deve ser mais alto que a tela e ter um filho "sticky").
 * `onProgress` recebe o mesmo valor (ex.: para destacar o passo atual).
 * Retorna `false` quando a pessoa pediu "reduzir movimento" — aí não há animação.
 */
export const useScrollProgress = (ref: RefObject<HTMLElement | null>, onProgress?: (p: number) => void) => {
  const [enabled] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      onProgress?.(p);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
    // onProgress é estável o suficiente para cada uso; não reinscreve a cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled]);

  return enabled;
};
