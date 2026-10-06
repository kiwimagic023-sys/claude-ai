import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { products, type Product } from '../config/site';

export interface CartLine {
  product: Product;
  qty: number;
}

type State = Record<string, number>;
type Action =
  | { type: 'add'; id: string }
  | { type: 'inc'; id: string }
  | { type: 'dec'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

const MAX_QTY = 99;
const STORAGE_KEY = 'poison-cart-v1';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add':
    case 'inc':
      return { ...state, [action.id]: Math.min((state[action.id] ?? 0) + 1, MAX_QTY) };
    case 'dec': {
      const qty = (state[action.id] ?? 0) - 1;
      if (qty > 0) return { ...state, [action.id]: qty };
      const { [action.id]: _removed, ...rest } = state;
      return rest;
    }
    case 'remove': {
      const { [action.id]: _removed, ...rest } = state;
      return rest;
    }
    case 'clear':
      return {};
  }
};

const loadInitial = (): State => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as State;
    // descarta itens que não existem mais no cardápio
    return Object.fromEntries(
      Object.entries(parsed).filter(([id, q]) => products.some((p) => p.id === id) && Number.isInteger(q) && q > 0),
    );
  } catch {
    return {};
  }
};

interface CartValue {
  lines: CartLine[];
  count: number;
  total: number;
  hasUnpriced: boolean;
  isOpen: boolean;
  bump: number;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  add: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível: o carrinho continua funcionando em memória */
    }
  }, [state]);

  const add = useCallback((id: string) => {
    dispatch({ type: 'add', id });
    setBump((b) => b + 1);
    setLastAdded(id);
  }, []);

  const value = useMemo<CartValue>(() => {
    const lines = products.filter((p) => state[p.id]).map((product) => ({ product, qty: state[product.id] }));
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((sum, l) => sum + (l.product.price ?? 0) * l.qty, 0),
      hasUnpriced: lines.some((l) => l.product.price === null),
      isOpen,
      bump,
      lastAdded,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      inc: (id) => dispatch({ type: 'inc', id }),
      dec: (id) => dispatch({ type: 'dec', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [state, isOpen, bump, lastAdded, add]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
