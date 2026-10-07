import { useSyncExternalStore } from 'react';

/** roteador mínimo baseado no History API (sem bibliotecas) */
const EVENT = 'poison:navigate';

const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener(EVENT, cb);
  };
};

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

export const usePath = () => useSyncExternalStore(subscribe, () => normalize(location.pathname));

/** navega para `to` (ex.: '/cardapio' ou '/#eventos') sem recarregar a página */
export const navigate = (to: string) => {
  const url = new URL(to, location.origin);
  if (url.pathname === location.pathname && url.hash === location.hash) return;
  history.pushState(null, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event(EVENT));
  if (!url.hash) window.scrollTo({ top: 0, behavior: 'instant' });
};

/** trata cliques em links internos (mantém ctrl/cmd+clique para abrir em nova aba) */
export const linkHandler = (to: string, after?: () => void) => (e: React.MouseEvent) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  navigate(to);
  after?.();
};
