import { useEffect, useState } from 'react';
import { integrations } from '../config/site';
import { useCart } from '../context/CartContext';
import { useModal } from '../hooks/useModal';
import { formatPrice } from '../lib/format';
import { scrollToId } from '../lib/scroll';
import { buildOrderMessage, whatsappUrl, type OrderDetails } from '../lib/whatsapp';
import { IconChevron, IconClose, IconTrash, IconWhatsApp } from './Icons';
import { Media } from './Media';
import { QtyControl } from './ProductCard';

type Step = 'cart' | 'checkout';

export function Cart() {
  const cart = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [details, setDetails] = useState<OrderDetails>({ mode: 'retirada' });
  const [touched, setTouched] = useState(false);
  const ref = useModal<HTMLDivElement>(cart.isOpen, cart.close);

  useEffect(() => {
    if (!cart.isOpen) setStep('cart');
  }, [cart.isOpen]);
  useEffect(() => {
    if (cart.count === 0) setStep('cart');
  }, [cart.count]);

  const totalLabel = cart.hasUnpriced
    ? cart.total > 0 ? `${formatPrice(cart.total)} + a confirmar` : 'A confirmar'
    : formatPrice(cart.total);

  const nameMissing = !details.name?.trim();
  const addressMissing = details.mode === 'delivery' && !details.address?.trim();

  const sendWhatsApp = (withDetails: boolean) => {
    if (withDetails) {
      setTouched(true);
      if (nameMissing || addressMissing) return;
    }
    const msg = buildOrderMessage(cart.lines, cart.total, cart.hasUnpriced, withDetails ? details : {});
    window.open(whatsappUrl(msg), '_blank', 'noopener,noreferrer');
  };

  const set = (k: keyof OrderDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDetails((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div className={`drawer ${cart.isOpen ? 'is-open' : ''}`} aria-hidden={!cart.isOpen} inert={!cart.isOpen}>
      <div className="drawer__backdrop" onClick={cart.close} />
      <div className="drawer__panel" ref={ref} role="dialog" aria-modal="true" aria-labelledby="cart-title" tabIndex={-1}>
        <header className="drawer__head">
          {step === 'checkout' ? (
            <button className="icon-btn" onClick={() => setStep('cart')} aria-label="Voltar ao carrinho"><IconChevron /></button>
          ) : (
            <span className="drawer__emoji" aria-hidden="true">🛸</span>
          )}
          <h2 id="cart-title">{step === 'cart' ? 'Seu pedido' : 'Finalizar pedido'}</h2>
          <button className="icon-btn" onClick={cart.close} aria-label="Fechar carrinho"><IconClose /></button>
        </header>

        {cart.count === 0 ? (
          <div className="drawer__empty">
            <div className="drawer__empty-art" aria-hidden="true">🍩</div>
            <h3>Seu carrinho está em órbita… vazio!</h3>
            <p>Escolha seus sabores favoritos no cardápio.</p>
            <button className="btn btn--primary" onClick={() => { cart.close(); scrollToId('cardapio'); }}>Ver cardápio</button>
          </div>
        ) : step === 'cart' ? (
          <>
            <ul className="cart-list">
              {cart.lines.map(({ product, qty }) => (
                <li key={product.id} className={`cart-line ${cart.lastAdded === product.id ? 'cart-line--new' : ''}`}>
                  <div className="cart-line__img"><Media src={product.image} art={product.art} seed={product.id} alt="" /></div>
                  <div className="cart-line__info">
                    <h3>{product.name}</h3>
                    <span className="cart-line__unit">{formatPrice(product.price)}{product.price !== null && ' / un.'}</span>
                    <QtyControl id={product.id} name={product.name} />
                  </div>
                  <div className="cart-line__side">
                    <span className="cart-line__sub">{product.price === null ? 'A confirmar' : formatPrice(product.price * qty)}</span>
                    <button className="icon-btn icon-btn--danger" onClick={() => cart.remove(product.id)} aria-label={`Remover ${product.name}`}><IconTrash width={18} height={18} /></button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer__foot">
              <dl className="summary">
                <div><dt>Itens</dt><dd>{cart.count}</dd></div>
                <div><dt>Subtotal</dt><dd>{totalLabel}</dd></div>
                <div className="summary__total"><dt>Total</dt><dd>{totalLabel}</dd></div>
              </dl>
              {cart.hasUnpriced && <p className="note">Itens marcados como “Consulte” têm o valor confirmado pela loja no WhatsApp.</p>}
              <button className="btn btn--primary btn--lg btn--block" onClick={() => setStep('checkout')}>Finalizar pedido</button>
              <button className="btn btn--whatsapp btn--block" onClick={() => sendWhatsApp(false)}>
                <IconWhatsApp width={20} height={20} /> Pedir pelo WhatsApp
              </button>
              <button className="link-btn" onClick={cart.clear}>Esvaziar carrinho</button>
            </footer>
          </>
        ) : (
          <>
            <form className="checkout" onSubmit={(e) => { e.preventDefault(); sendWhatsApp(true); }} noValidate>
              <section className="checkout__summary" aria-label="Resumo do pedido">
                <h3>Resumo</h3>
                <ul>
                  {cart.lines.map(({ product, qty }) => (
                    <li key={product.id}><span>{qty}x {product.name}</span><span>{product.price === null ? 'a confirmar' : formatPrice(product.price * qty)}</span></li>
                  ))}
                </ul>
                <p className="checkout__total"><span>Total</span><strong>{totalLabel}</strong></p>
              </section>

              <fieldset className="segmented segmented--full">
                <legend className="field__label">Como você quer receber?</legend>
                {(['retirada', 'delivery'] as const).map((m) => (
                  <label key={m} className={details.mode === m ? 'is-active' : ''}>
                    <input type="radio" name="mode" value={m} checked={details.mode === m} onChange={() => setDetails((d) => ({ ...d, mode: m }))} />
                    {m === 'retirada' ? '🏬 Retirar na loja' : '🚀 Delivery'}
                  </label>
                ))}
              </fieldset>

              <label className="field">
                <span className="field__label">Seu nome *</span>
                <input value={details.name ?? ''} onChange={set('name')} autoComplete="name" aria-invalid={touched && nameMissing} />
                {touched && nameMissing && <span className="field__error">Informe seu nome.</span>}
              </label>
              {details.mode === 'delivery' && (
                <label className="field">
                  <span className="field__label">Endereço de entrega *</span>
                  <input value={details.address ?? ''} onChange={set('address')} autoComplete="street-address" placeholder="Rua, número, complemento, bairro" aria-invalid={touched && addressMissing} />
                  {touched && addressMissing && <span className="field__error">Informe o endereço para o delivery.</span>}
                </label>
              )}
              <label className="field">
                <span className="field__label">Observações</span>
                <textarea rows={2} value={details.notes ?? ''} onChange={set('notes')} placeholder="Ex.: horário de retirada, presente…" />
              </label>

              <div className="pay-box">
                <strong>💳 Pagamento</strong>
                {integrations.checkoutUrl ? (
                  <a className="btn btn--ghost btn--block" href={integrations.checkoutUrl} target="_blank" rel="noopener noreferrer">Pagar online</a>
                ) : (
                  <p>A forma de pagamento e a taxa de entrega são combinadas com a loja pelo WhatsApp.</p>
                )}
              </div>

              <button type="submit" className="btn btn--whatsapp btn--lg btn--block">
                <IconWhatsApp width={22} height={22} /> Enviar pedido pelo WhatsApp
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
