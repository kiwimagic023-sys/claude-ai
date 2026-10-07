import { brandLogo } from '../config/site';

/** logo oficial (mascote) + nome da marca */
export function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <span className="logo">
      <img
        className="logo__mark"
        src={size <= 96 ? brandLogo.small : brandLogo.large}
        width={size}
        height={size}
        alt={showText ? '' : 'Poison Donuts'}
        decoding="async"
      />
      {showText && (
        <span className="logo__text">
          <span className="logo__poison">POISON</span>{' '}
          <span className="logo__donuts">DONUTS</span>
        </span>
      )}
    </span>
  );
}
