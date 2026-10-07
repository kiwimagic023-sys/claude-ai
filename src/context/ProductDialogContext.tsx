import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../config/site';

interface Value {
  product: Product | null;
  show: (p: Product) => void;
  hide: () => void;
}

const Ctx = createContext<Value | null>(null);

export function ProductDialogProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  return <Ctx.Provider value={{ product, show: setProduct, hide: () => setProduct(null) }}>{children}</Ctx.Provider>;
}

export const useProductDialog = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProductDialog must be used inside ProductDialogProvider');
  return ctx;
};
