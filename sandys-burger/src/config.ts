// Configuração central da Sandy's Burger: contato, links, frames do hero e cardápio.
// Para mudar preços, textos do cardápio ou o telefone, edite apenas este arquivo.

export const brand = {
  name: "Sandy's Burger",
  slogan: 'Old Fashioned Burger · Ultra Smash',
  whatsappE164: '5521993963901',
  whatsappDisplay: '(21) 99396-3901',
  instagramUrl: 'https://www.instagram.com/sandysburger/',
  linktreeUrl: 'https://linktr.ee/sandysburgerbr',
} as const;

/** Link do WhatsApp com mensagem pronta. */
export const whatsappLink = (message: string): string => `https://wa.me/${brand.whatsappE164}?text=${encodeURIComponent(message)}`;

/**
 * Sequência de frames do hero (WebP numerados f0001.webp, f0002.webp, ...).
 * Para trocar a animação, substitua os arquivos em public/frames e ajuste `count`/`width`/`height`.
 */
export const frames = {
  desktop: { dir: 'frames/d', count: 160, width: 800, height: 960 },
  mobile: { dir: 'frames/m', count: 90, width: 560, height: 672 },
  /** 'screen' faz o preto dos frames virar transparente (use com vídeo/IA em fundo preto). */
  blend: 'normal' as 'normal' | 'screen',
} as const;

export type Tier = 'double' | 'triple';

export interface MenuItem {
  id: string;
  tier: Tier;
  name: string;
  price: number;
  description: string;
  /** arquivo em public/img/menu */
  image: string;
  alt: string;
}

const DOUBLE = '2 ultra smashs (100g)';
const TRIPLE = '3 ultra smashs (150g)';

export const menu: MenuItem[] = [
  {
    id: 'double-cheese',
    tier: 'double',
    name: 'Double Cheese',
    price: 19.9,
    description: `${DOUBLE} e duas fatias de American Cheese.`,
    image: 'double-cheese.webp',
    alt: 'Double Cheese: dois ultra smashs com American Cheese derretido',
  },
  {
    id: 'double-classic',
    tier: 'double',
    name: 'Double Classic',
    price: 20.9,
    description: `${DOUBLE}, duas fatias de American Cheese, cebola picadinha, picles da casa e molhos autorais de ketchup e mostarda.`,
    image: 'double-classic.webp',
    alt: 'Double Classic com cebola picadinha, picles e molhos de ketchup e mostarda',
  },
  {
    id: 'double-bacon',
    tier: 'double',
    name: 'Double Bacon',
    price: 21.9,
    description: `${DOUBLE}, duas fatias de American Cheese, bacon defumado fatiado e ketchup autoral.`,
    image: 'double-bacon.webp',
    alt: 'Double Bacon com bacon defumado e ketchup autoral',
  },
  {
    id: 'double-salad',
    tier: 'double',
    name: 'Double Salad',
    price: 21.9,
    description: `${DOUBLE}, duas fatias de American Cheese, tomate, alface e maionese da casa.`,
    image: 'double-salad.webp',
    alt: 'Double Salad com tomate, alface e maionese da casa',
  },
  {
    id: 'triple-cheese',
    tier: 'triple',
    name: 'Triple Cheese',
    price: 27.9,
    description: `${TRIPLE} e três fatias de American Cheese.`,
    image: 'triple-cheese.webp',
    alt: 'Triple Cheese: três ultra smashs com American Cheese derretido',
  },
  {
    id: 'triple-classic',
    tier: 'triple',
    name: 'Triple Classic',
    price: 28.9,
    description: `${TRIPLE}, três fatias de American Cheese, cebola picadinha, picles da casa e molhos autorais de ketchup e mostarda.`,
    image: 'triple-classic.webp',
    alt: 'Triple Classic com cebola picadinha, picles e molhos de ketchup e mostarda',
  },
  {
    id: 'triple-bacon',
    tier: 'triple',
    name: 'Triple Bacon',
    price: 29.9,
    description: `${TRIPLE}, American Cheese, bacon defumado fatiado e ketchup autoral.`,
    image: 'triple-bacon.webp',
    alt: 'Triple Bacon com bacon defumado e ketchup autoral',
  },
  {
    id: 'triple-salad',
    tier: 'triple',
    name: 'Triple Salad',
    price: 29.9,
    description: `${TRIPLE}, três fatias de American Cheese, tomate, alface e maionese da casa.`,
    image: 'triple-salad.webp',
    alt: 'Triple Salad com tomate, alface e maionese da casa',
  },
];

export const tiers: Record<Tier, { label: string; detail: string }> = {
  double: { label: 'DOUBLE', detail: '2 ultra smashs de 100g' },
  triple: { label: 'TRIPLE', detail: '3 ultra smashs de 150g' },
};

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatPrice = (value: number): string => brl.format(value).replace(/ /g, ' ');
