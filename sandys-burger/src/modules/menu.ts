// Cardápio: abas DOUBLE / TRIPLE, cards renderizados a partir de config.ts e botão "Pedir" no WhatsApp.
import gsap from 'gsap';
import { formatPrice, menu, tiers, whatsappLink, type MenuItem, type Tier } from '../config';

const imageUrl = (file: string): string => new URL(`img/menu/${file}`, document.baseURI).href;

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

function cardHtml(item: MenuItem): string {
  const price = formatPrice(item.price).replace('R$ ', '');
  const order = whatsappLink(`Olá! Quero pedir um ${item.name}`);
  return `
    <article class="card item" data-item="${item.id}">
      <div class="item__media">
        <span class="item__tag">${tiers[item.tier].label} · ${tiers[item.tier].detail.replace(' ultra smashs de ', '×')}</span>
        <img src="${imageUrl(item.image)}" alt="${escapeHtml(item.alt)}" width="720" height="720" loading="lazy" decoding="async" />
      </div>
      <div class="item__body">
        <h3 class="item__name">${escapeHtml(item.name)}</h3>
        <p class="item__desc">${escapeHtml(item.description)}</p>
        <div class="item__foot">
          <p class="item__price"><small>R$</small>${price}</p>
          <a class="btn btn--pink" href="${order}" target="_blank" rel="noopener" aria-label="Pedir ${escapeHtml(item.name)} pelo WhatsApp">
            <svg class="icon icon--fill" aria-hidden="true"><use href="#i-wa" /></svg> Pedir
          </a>
        </div>
      </div>
    </article>`;
}

export function initMenu(reduceMotion: boolean): void {
  const grid = document.getElementById('panel-menu')!;
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.tabs__tab'));
  const pill = document.querySelector<HTMLElement>('.tabs__pill')!;
  let tier: Tier = 'double';

  const movePill = (): void => {
    const active = tabs.find((t) => t.dataset.tier === tier)!;
    pill.style.setProperty('--x', `${active.offsetLeft - 6}px`);
    pill.style.setProperty('--w', `${active.offsetWidth}px`);
  };

  const render = (): HTMLElement[] => {
    grid.innerHTML = menu
      .filter((i) => i.tier === tier)
      .map(cardHtml)
      .join('');
    return Array.from(grid.querySelectorAll<HTMLElement>('.item'));
  };

  const select = (next: Tier, focus = false): void => {
    if (next === tier) return;
    tier = next;
    tabs.forEach((t) => {
      const on = t.dataset.tier === tier;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    grid.setAttribute('aria-labelledby', `tab-${tier}`);
    movePill();

    const old = Array.from(grid.querySelectorAll<HTMLElement>('.item'));
    const swap = (): void => {
      const cards = render();
      if (!reduceMotion) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 34, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'opacity,transform' },
        );
      }
    };
    if (reduceMotion || old.length === 0) swap();
    else gsap.to(old, { opacity: 0, y: -14, duration: 0.22, stagger: 0.03, ease: 'power2.in', onComplete: swap });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab.dataset.tier as Tier));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      const target = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + dir + tabs.length) % tabs.length;
      select(tabs[target].dataset.tier as Tier, true);
    });
  });

  render();
  movePill();
  window.addEventListener('resize', movePill, { passive: true });
  document.fonts?.ready.then(movePill);

  // já deixa as imagens da outra aba no cache para a troca ser instantânea
  const warm = (): void => {
    menu.filter((i) => i.tier !== tier).forEach((i) => (new Image().src = imageUrl(i.image)));
  };
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(warm, { timeout: 6000 });
  else window.setTimeout(warm, 3000);
}
