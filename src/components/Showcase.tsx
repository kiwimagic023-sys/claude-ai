import { useRef } from 'react';
import { products, showcase } from '../config/site';
import { useProductDialog } from '../context/ProductDialogContext';
import { useScrollProgress } from '../hooks/useScrollProgress';

/** inclinação 3D seguindo o mouse (só em telas com mouse) */
const tilt = (e: React.PointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -14}deg`);
  el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`);
};
const untilt = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
};

/** fotos reais que começam empilhadas e se abrem em leque conforme a rolagem */
export function Showcase() {
  const section = useRef<HTMLElement>(null);
  const animated = useScrollProgress(section);
  const dialog = useProductDialog();
  const mid = (showcase.length - 1) / 2;

  return (
    <section ref={section} id="nossos-donuts" className={`showcase ${animated ? 'showcase--animated' : ''}`} aria-labelledby="showcase-title">
      <div className="showcase__sticky">
        <header className="section-head showcase__head">
          <p className="eyebrow">Feitos na Poison</p>
          <h2 id="showcase-title" className="section-title">Nossos donuts <span className="text-gradient">de verdade</span></h2>
          <p className="section-lead showcase__hint">Role a página e veja eles se abrindo. Toque em uma foto para conhecer o sabor.</p>
        </header>
        <ul className="showcase__fan">
          {showcase.map((item, i) => {
            const k = i - mid;
            const product = products.find((p) => p.id === item.productId);
            return (
              <li key={item.image} className="showcase__card" style={{ ['--k' as string]: k, ['--ak' as string]: Math.abs(k), zIndex: 10 - Math.abs(k) }}>
                {product ? (
                  <button className="showcase__inner" onPointerMove={tilt} onPointerLeave={untilt} onClick={() => dialog.show(product)} aria-label={`${item.title}: ver detalhes`}>
                    <img src={item.image} alt="" loading="lazy" decoding="async" />
                    <span className="showcase__caption"><strong>{item.title}</strong><small>{item.text}</small></span>
                  </button>
                ) : (
                  <div className="showcase__inner" onPointerMove={tilt} onPointerLeave={untilt}>
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                    <span className="showcase__caption" aria-hidden="true"><strong>{item.title}</strong><small>{item.text}</small></span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
