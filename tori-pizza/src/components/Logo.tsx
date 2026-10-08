import { brandLogo, store } from '../config/site';

/** logo oficial (círculo vermelho). Usa a versão pequena até 96px. */
export function Logo({ size = 44 }: { size?: number }) {
  return <img className="logo" src={size <= 96 ? brandLogo.small : brandLogo.large} width={size} height={size} alt={store.name} decoding="async" />;
}
