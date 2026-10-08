const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

/** rola até uma seção da página */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: smooth(), block: 'start' });
  history.replaceState(null, '', id === 'inicio' ? location.pathname : `#${id}`);
};
