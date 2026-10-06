import { useEffect, useState } from 'react';
import { products } from '../config/site';
import { useCart } from '../context/CartContext';

/** aviso rápido ao adicionar um item */
export function Toast() {
  const { bump, lastAdded, open, isOpen } = useCart();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!bump) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [bump]);
  const name = products.find((p) => p.id === lastAdded)?.name;
  return (
    <div className={`toast ${visible && !isOpen ? 'is-visible' : ''}`} role="status" aria-live="polite">
      {name && visible && (
        <>
          <span>🍩 <strong>{name}</strong> adicionado!</span>
          <button className="toast__btn" onClick={() => { setVisible(false); open(); }}>Ver pedido</button>
        </>
      )}
    </div>
  );
}
