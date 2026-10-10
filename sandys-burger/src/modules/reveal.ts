// Entradas suaves (fade + subida) em todas as seções, e brilho que segue o cursor nos cards.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initReveals(reduceMotion: boolean): void {
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');

  if (reduceMotion) {
    els.forEach((el) => el.classList.add('is-in'));
  } else {
    ScrollTrigger.batch(els, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.09,
          overwrite: true,
          onComplete: () => {
            batch.forEach((el) => {
              el.classList.add('is-in');
              gsap.set(el, { clearProps: 'opacity,transform' });
            });
          },
        });
      },
    });
  }

  // brilho radial que acompanha o cursor dentro do card
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
    { passive: true },
  );
}
