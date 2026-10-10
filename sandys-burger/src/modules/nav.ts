// Menu fixo: fundo com desfoque ao rolar, link ativo conforme a seção e menu hambúrguer no celular.

interface Tracked {
  el: HTMLElement;
  nav: string;
}

export function initNav(): void {
  const nav = document.getElementById('nav')!;
  const toggle = nav.querySelector<HTMLButtonElement>('.nav__toggle')!;
  const mobileLinks = Array.from(nav.querySelectorAll<HTMLAnchorElement>('.nav__mobile a'));
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('.nav__links a'));
  const html = document.documentElement;

  // ---------- estado "rolado" ----------
  const onScroll = (): void => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  // ---------- link ativo ----------
  const sections: Tracked[] = [
    ['inicio', '#inicio'],
    ['sobre', '#sobre'],
    ['cardapio', '#cardapio'],
    ['cardapio', '#galeria'],
    ['unidades', '#unidades'],
    ['contato', '#contato'],
  ]
    .map(([navId, selector]) => ({ nav: navId, el: document.querySelector<HTMLElement>(selector)! }))
    .filter((s) => s.el);

  let active = '';
  const updateActive = (): void => {
    const line = window.innerHeight * 0.38;
    let current = sections[0].nav;
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top <= line) current = s.nav;
    }
    // chegou ao fim da página: o último item (contato)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contato';
    if (current === active) return;
    active = current;
    links.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === current));
  };

  let queued = false;
  const onScrollFrame = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      onScroll();
      updateActive();
    });
  };
  window.addEventListener('scroll', onScrollFrame, { passive: true });
  window.addEventListener('resize', onScrollFrame, { passive: true });
  onScroll();
  updateActive();

  // ---------- menu do celular ----------
  const setOpen = (open: boolean): void => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    html.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  mobileLinks.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
