/**
 * ============================================================
 *  TORIPIZZA — CONFIGURAÇÃO CENTRAL DO SITE
 * ============================================================
 *  Para atualizar o site, edite os dados deste arquivo.
 *  Os componentes leem tudo daqui: pizzaria, contato, horários,
 *  cardápio, fotos, avaliações e links.
 *
 *  IMAGENS: coloque as fotos em /public/images/ e informe o
 *  caminho no campo `image` (ex.: '/images/pizza-calabresa.webp').
 * ============================================================
 */

// ---------- Tipos ----------

export type CategoryId = 'salgadas' | 'doces' | 'pasteis' | 'bebidas';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  /** mensagem mostrada quando a categoria ainda não tem itens cadastrados */
  emptyMessage?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  ingredients: string[];
  /** foto onde o sabor aparece */
  image?: string;
  bestSeller?: boolean;
}

export interface DayHours {
  /** 0 = domingo ... 6 = sábado */
  day: number;
  label: string;
  /** 'HH:MM' — use null para fechado */
  open: string | null;
  close: string | null;
}

export interface Review {
  author: string;
  /** nota em estrelas (só preencha se souber a nota exata) */
  rating?: number;
  text: string;
  source: string;
  date?: string;
}

// ---------- Pizzaria ----------

export const store = {
  name: 'Toripizza',
  slogan: 'Pizza quentinha, do forno para a sua mesa.',
  segment: 'Pizzaria',
  phoneDisplay: '(81) 99406-4737',
  /** formato internacional, só números — usado no WhatsApp e no link tel: */
  phoneE164: '5581994064737',
  website: 'https://toripizza.com.br',
  rating: 4.6,
  ratingCountLabel: '11 avaliações no Google',
  services: ['Delivery', 'Retirada na porta', 'Comer no local'],
  address: {
    street: 'R. Limoeiro, 12',
    neighborhood: 'Lot. Deus é Fiel',
    city: 'Toritama',
    state: 'PE',
    zip: '55125-000',
    plusCode: 'XWXG+HF Toritama, Pernambuco',
  },
};

export const links = {
  instagramHandle: '@toripizza_',
  instagram: 'https://www.instagram.com/toripizza_/',
  googleMaps:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Tori pizza, R. Limoeiro, 12, Toritama - PE, 55125-000'),
  googleReviews: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Tori pizza Toritama'),
};

export const whatsappDefaultMessage = 'Olá, Toripizza! Quero fazer um pedido.';

/** HORÁRIOS — o indicador "Aberto/Fechado" do site usa estes dados. Fechado às terças. */
export const hours: DayHours[] = [
  { day: 1, label: 'Segunda', open: '18:00', close: '23:30' },
  { day: 2, label: 'Terça', open: null, close: null },
  { day: 3, label: 'Quarta', open: '18:00', close: '23:30' },
  { day: 4, label: 'Quinta', open: '18:00', close: '23:30' },
  { day: 5, label: 'Sexta', open: '18:00', close: '23:30' },
  { day: 6, label: 'Sábado', open: '18:00', close: '23:30' },
  { day: 0, label: 'Domingo', open: '18:00', close: '23:30' },
];
export const timeZone = 'America/Recife';

// ---------- Logo e fotos ----------

export const brandLogo = {
  large: '/images/logo-toripizza.webp',
  small: '/images/logo-toripizza-96.webp',
};

export const photos = {
  calabresaPortuguesa: '/images/pizza-calabresa-portuguesa.webp',
  frangoBaconQueijos: '/images/pizza-frango-bacon-quatro-queijos.webp',
  chocolateRomeuJulieta: '/images/pizza-chocolate-romeu-e-julieta.webp',
  carneDeSolChocolate: '/images/pizza-carne-de-sol-chocolate.webp',
  meioAMeioChocolate: '/images/pizza-meio-a-meio-chocolate.webp',
};

// ---------- Navegação ----------

export const navItems = [
  { id: 'inicio', label: 'Início' },
  { id: 'cardapio', label: 'Cardápio' },
  { id: 'como-pedir', label: 'Como pedir' },
  { id: 'fotos', label: 'Fotos' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'localizacao', label: 'Localização' },
];

// ---------- Cardápio ----------

export const categories: Category[] = [
  { id: 'salgadas', label: 'Pizzas salgadas', emoji: '🍕' },
  { id: 'doces', label: 'Pizzas doces', emoji: '🍫' },
  {
    id: 'pasteis',
    label: 'Pastéis',
    emoji: '🥟',
    emptyMessage: 'Também tem pastel! Os sabores do dia você confere pelo WhatsApp.',
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🥤',
    emptyMessage: 'Refrigerantes e bebidas geladas: pergunte as opções pelo WhatsApp.',
  },
];

/**
 * SABORES — identificados pelas fotos do Instagram.
 * Revise nomes e ingredientes com a pizzaria antes de publicar.
 */
export const products: Product[] = [
  {
    id: 'calabresa',
    name: 'Calabresa',
    category: 'salgadas',
    description: 'A clássica: calabresa fatiada, muito queijo, cebola e orégano.',
    ingredients: ['Mussarela', 'Calabresa', 'Cebola', 'Orégano'],
    image: photos.calabresaPortuguesa,
    bestSeller: true,
  },
  {
    id: 'portuguesa',
    name: 'Portuguesa',
    category: 'salgadas',
    description: 'Presunto, ovo, cebola, tomate, milho e ervilha sobre bastante queijo.',
    ingredients: ['Mussarela', 'Presunto', 'Ovo', 'Tomate', 'Cebola', 'Milho', 'Ervilha'],
    image: photos.calabresaPortuguesa,
  },
  {
    id: 'carne-de-sol',
    name: 'Carne de sol com cream cheese',
    category: 'salgadas',
    description: 'Carne desfiada bem temperada e fios generosos de cream cheese.',
    ingredients: ['Mussarela', 'Carne de sol desfiada', 'Cream cheese', 'Orégano'],
    image: photos.carneDeSolChocolate,
    bestSeller: true,
  },
  {
    id: 'frango',
    name: 'Frango com cream cheese',
    category: 'salgadas',
    description: 'Frango desfiado e temperado com fios de cream cheese por cima.',
    ingredients: ['Mussarela', 'Frango desfiado', 'Cream cheese', 'Orégano'],
    image: photos.frangoBaconQueijos,
  },
  {
    id: 'quatro-queijos',
    name: 'Quatro queijos',
    category: 'salgadas',
    description: 'Para quem ama queijo: mussarela, gorgonzola e outros queijos derretidos.',
    ingredients: ['Mussarela', 'Gorgonzola', 'Queijos especiais', 'Orégano'],
    image: photos.frangoBaconQueijos,
  },
  {
    id: 'bacon',
    name: 'Bacon com cheddar',
    category: 'salgadas',
    description: 'Bacon crocante e cheddar cremoso.',
    ingredients: ['Mussarela', 'Bacon', 'Cheddar'],
    image: photos.frangoBaconQueijos,
  },
  {
    id: 'chocolate-confetes',
    name: 'Chocolate com confetes',
    category: 'doces',
    description: 'Chocolate cremoso coberto de confetes coloridos.',
    ingredients: ['Chocolate', 'Confetes'],
    image: photos.chocolateRomeuJulieta,
    bestSeller: true,
  },
  {
    id: 'romeu-e-julieta',
    name: 'Romeu e Julieta',
    category: 'doces',
    description: 'A dupla perfeita: queijo derretido e goiabada.',
    ingredients: ['Queijo', 'Goiabada'],
    image: photos.chocolateRomeuJulieta,
  },
  {
    id: 'chocolate-creme',
    name: 'Chocolate com creme',
    category: 'doces',
    description: 'Chocolate cremoso com fios de creme branco por cima.',
    ingredients: ['Chocolate', 'Creme branco'],
    image: photos.meioAMeioChocolate,
  },
];

// ---------- Destaques ----------

export const features = [
  { emoji: '🔥', title: 'Saindo do forno', text: 'Massa assada na hora, com borda dourada e muito queijo.' },
  { emoji: '🍕', title: 'Vários sabores', text: 'Meio a meio ou dividida em mais sabores na mesma pizza, salgados e doces.' },
  { emoji: '🛵', title: 'Delivery', text: 'Entrega sem contato em Toritama. Peça pelo WhatsApp.' },
  { emoji: '🏠', title: 'No local ou retirada', text: 'Coma na pizzaria ou retire o pedido na porta.' },
];

// ---------- Galeria ----------

export const gallery: { image: string; title: string; shape?: 'tall' | 'wide' }[] = [
  { image: photos.meioAMeioChocolate, title: 'Carne de sol, calabresa e chocolate', shape: 'tall' },
  { image: photos.calabresaPortuguesa, title: 'Calabresa e portuguesa' },
  { image: photos.chocolateRomeuJulieta, title: 'Chocolate com confetes e Romeu e Julieta', shape: 'tall' },
  { image: photos.frangoBaconQueijos, title: 'Frango, bacon e quatro queijos' },
  { image: photos.carneDeSolChocolate, title: 'Carne de sol, queijos e chocolate', shape: 'tall' },
];

// ---------- Avaliações ----------
/** Somente avaliações REAIS, copiadas do Google. */
export const reviews: Review[] = [
  { author: 'Ledison Luiz Silva', text: 'Uma das melhores pizzas da cidade.', source: 'Google', date: 'Local Guide' },
];
