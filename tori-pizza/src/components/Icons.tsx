import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p });

export const IconHome = (p: P) => (<svg {...base(p)}><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>);
export const IconPin = (p: P) => (<svg {...base(p)}><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.6" /></svg>);
export const IconPhone = (p: P) => (<svg {...base(p)}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>);
export const IconClock = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const IconClose = (p: P) => (<svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconMenu = (p: P) => (<svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const IconArrow = (p: P) => (<svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconStar = (p: P) => (<svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" /></svg>);
export const IconInstagram = (p: P) => (<svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>);
export const IconWhatsApp = (p: P) => (
  <svg width={24} height={24} viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.5L3 29l6.7-1.7c1.9 1 4 1.6 6.3 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.7c-2 0-4-.5-5.7-1.6l-.4-.2-4 1 1.1-3.9-.3-.4A10.6 10.6 0 0 1 5.4 16C5.4 10.1 10.1 5.4 16 5.4S26.6 10.1 26.6 16 21.9 26.7 16 26.7zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
  </svg>
);
export const IconPizza = (p: P) => (<svg {...base(p)}><path d="M12 21 3.5 6.5a14 14 0 0 1 17 0z" /><path d="M5.2 9.4a11 11 0 0 1 13.6 0" /><circle cx="10" cy="11.5" r="1.1" /><circle cx="14" cy="13" r="1.1" /><circle cx="12" cy="16.5" r="1" /></svg>);
export const IconBike = (p: P) => (<svg {...base(p)}><circle cx="5.5" cy="17" r="3" /><circle cx="18.5" cy="17" r="3" /><path d="M8.5 17h6l2-5h-5l-2.5 5M14 7h2.5l2 10M4 10h5" /></svg>);
export const IconStore = (p: P) => (<svg {...base(p)}><path d="M4 9h16l-1.5-5h-13z" /><path d="M5 9v11h14V9" /><path d="M10 20v-5h4v5" /></svg>);
export const IconTable = (p: P) => (<svg {...base(p)}><path d="M3 9h18M5 9v11M19 9v11M8 9V6h8v3" /></svg>);
