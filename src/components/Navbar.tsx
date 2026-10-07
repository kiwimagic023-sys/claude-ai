import { useEffect, useState } from 'react';
import { navItems, store } from '../config/site';
import { scrollToId } from '../lib/scroll';
import { IconClose, IconMenu, IconPhone, IconPin } from './Icons';
import { Logo } from './Logo';

export function Navbar({ path }: { path: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(path === '/' ? 'inicio' : path.slice(1));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActive(path === '/' ? 'inicio' : path.slice(1));
    if (path !== '/') return;
    const sections = navItems.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''} ${menuOpen ? 'nav--open' : ''}`}>
      <div className="nav__inner container">
        <a href="/" className="nav__brand" onClick={go('inicio')} aria-label="Poison Donuts, página inicial">
          <Logo size={38} />
        </a>

        <nav className="nav__links" aria-label="Principal">
          {navItems.map((n) => (
            <a key={n.id} href={n.id === 'inicio' ? '/' : `/#${n.id}`} onClick={go(n.id)} className={active === n.id ? 'is-active' : ''} aria-current={active === n.id ? 'true' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a className="icon-btn nav__call" href={`tel:+${store.phoneE164}`} aria-label={`Ligar para a loja: ${store.phoneDisplay}`}><IconPhone width={20} height={20} /></a>
          <button className="btn btn--primary btn--sm nav__cta" onClick={() => scrollToId('localizacao')}><IconPin width={18} height={18} /> Como chegar</button>
          <button className="icon-btn nav__burger" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
        <nav aria-label="Menu móvel">
          {navItems.map((n, i) => (
            <a key={n.id} href={n.id === 'inicio' ? '/' : `/#${n.id}`} onClick={go(n.id)} style={{ animationDelay: `${i * 40}ms` }} className={active === n.id ? 'is-active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__ctas">
          <a className="btn btn--ghost btn--lg btn--block" href={`tel:+${store.phoneE164}`}><IconPhone /> Ligar {store.phoneDisplay}</a>
          <button className="btn btn--primary btn--lg btn--block" onClick={() => { setMenuOpen(false); scrollToId('localizacao'); }}><IconPin /> Como chegar</button>
        </div>
      </div>
    </header>
  );
}
