// Roteiro de fotos renderizadas: 8 burgers do cardápio e a galeria.
// Cada item é lido pelo estúdio (Studio.setScene) dentro do navegador.

const BASE = { size: [720, 720], az: 24, el: 24, fit: 1, lift: 0.34 };

const burger = (id, patties, extras, extra = {}) => ({ ...BASE, id, kind: 'burger', patties, extras, ...extra });

export const MENU_SHOTS = [
  burger('double-cheese', 2, []),
  burger('double-classic', 2, ['dicedOnion', 'pickles', 'ketchup', 'mustard']),
  burger('double-bacon', 2, ['bacon', 'ketchup']),
  burger('double-salad', 2, ['lettuce', 'tomato', 'mayo']),
  burger('triple-cheese', 3, []),
  burger('triple-classic', 3, ['dicedOnion', 'pickles', 'ketchup', 'mustard']),
  burger('triple-bacon', 3, ['bacon', 'ketchup']),
  burger('triple-salad', 3, ['lettuce', 'tomato', 'mayo']),
];

const BG = {
  x: 0.5,
  y: 0.58,
  stops: [
    [0, '#5a1f86'],
    [0.45, '#25103d'],
    [1, '#0b0710'],
  ],
};
const BG_PINK = {
  x: 0.5,
  y: 0.6,
  stops: [
    [0, '#7a1f5e'],
    [0.5, '#2a0f3a'],
    [1, '#0b0710'],
  ],
};

const gallery = (id, shot) => ({ size: [900, 900], floor: true, bg: BG, bloom: 0.22, quality: 0.8, ...shot, id });

export const GALLERY_SHOTS = [
  // g1: destaque grande, Double Cheese fechado em ângulo baixo
  gallery('g1', { kind: 'burger', patties: 2, extras: ['lettuce', 'tomato', 'mayo'], lift: 0.0, az: 28, el: 11, fit: 0.86, ty: 0.62, bg: BG_PINK, size: [1000, 1000] }),
  // g2: Triple Bacon aberto, visto de cima
  gallery('g2', { kind: 'burger', patties: 3, extras: ['bacon', 'ketchup'], lift: 0.5, az: 205, el: 36, fit: 0.92, ty: 0.7, size: [800, 800] }),
  // g3: queijo escorrendo (Double Cheese fechado, ângulo baixo)
  gallery('g3', { kind: 'burger', patties: 2, extras: [], lift: 0.0, az: 18, el: 12, fit: 0.84, ty: 0.46, bg: BG_PINK, size: [800, 800] }),
  // g4: Double Classic aberto de lado
  gallery('g4', { kind: 'burger', patties: 2, extras: ['dicedOnion', 'pickles', 'ketchup', 'mustard'], lift: 0.55, az: 300, el: 18, fit: 0.9, ty: 0.7, size: [800, 800] }),
  // g5: Triple Salad
  gallery('g5', { kind: 'burger', patties: 3, extras: ['lettuce', 'tomato', 'mayo'], lift: 0.45, az: 150, el: 26, fit: 0.9, ty: 0.75, bg: BG_PINK, size: [800, 800] }),
  // g6: combo (burger + batata na caixa Sandy's)
  gallery('g6', { kind: 'combo', patties: 2, extras: ['dicedOnion', 'pickles', 'ketchup'], lift: 0.0, az: 12, el: 20, fit: 1.62, ty: 0.62, size: [800, 800] }),
];
