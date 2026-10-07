export function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo__mark">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff2fb3" />
            <stop offset="1" stopColor="#7b2ff7" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="30" r="26" fill="#f3b46a" />
        <path d="M32 7a23 23 0 0 1 22.8 20c-.6 3-2.6 3.4-3.6 1.2-.8-1.8-2.6-1.6-3 .6-.6 3.6-2.4 4.6-3.6 2.2-1-2-3-1.6-3.2.6-.4 4-2.6 5-3.8 2.4-1-2.2-3.2-2-3.6.4-.6 3.6-2.8 4-3.8 1.2-.8-2.2-3-2-3.4.2-.6 3-2.6 3.2-3.4.6-.8-2.4-2.8-2-3.4.2-.6 2-2.2 2.4-2.8.2A23 23 0 0 1 32 7z" fill="url(#logo-g)" />
        <circle cx="32" cy="30" r="7.5" fill="#140a2e" />
        <path d="M44 36c0 4 1.4 7 3.6 7s3.6-3 3.6-7c0-2.6-3.6-5-3.6-5s-3.6 2.4-3.6 5z" fill="#39e991" />
        <g fill="#fff">
          <rect x="19" y="15" width="5" height="2" rx="1" transform="rotate(-30 21 16)" />
          <rect x="38" y="13" width="5" height="2" rx="1" transform="rotate(25 40 14)" fill="#ffd23f" />
          <rect x="44" y="22" width="5" height="2" rx="1" transform="rotate(70 46 23)" fill="#39e991" />
          <rect x="15" y="25" width="5" height="2" rx="1" transform="rotate(80 17 26)" fill="#3aa0ff" />
        </g>
      </svg>
      {showText && (
        <span className="logo__text">
          <span className="logo__poison">POISON</span>{' '}
          <span className="logo__donuts">DONUTS</span>
        </span>
      )}
    </span>
  );
}
