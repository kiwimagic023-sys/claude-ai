import { navigate } from './router';

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

/**
 * Rola até uma seção da página inicial.
 * Em outra página (ex.: /cardapio), volta para a inicial e abre a seção.
 */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) {
    if (location.pathname !== '/') navigate(id === 'inicio' ? '/' : `/#${id}`);
    return;
  }
  el.scrollIntoView({ behavior: smooth(), block: 'start' });
  history.replaceState(null, '', id === 'inicio' ? location.pathname : `#${id}`);
};
