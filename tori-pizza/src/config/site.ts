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

export type CategoryId = 'salgadas' | 'doces' | 'bebidas';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  /** mensagem mostrada quando a categoria ainda não tem itens cadastrados */
  emptyMessage?: string;
}

export interface Product {
  id: string;
  /** número no cardápio da pizzaria */
  number: number;
  name: string;
  category: CategoryId;
  description: string;
  ingredients: string[];
  /** como a pizza é montada (texto curto mostrado no card) */
  howTo: string;
  /** preços [pequena, média, grande] */
  prices?: [number, number, number];
  /** foto onde o sabor aparece */
  image?: string;
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

export const whatsappDefaultMessage = 'Olá, Toripizza! Vi o site e gostaria de mais informações.';

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
  /** pizza inteira recortada (sem fundo) */
  cutoutCalabresaPortuguesa: '/images/cutout-calabresa-portuguesa.webp',
};

// ---------- Navegação ----------

export const navItems = [
  { id: 'inicio', label: 'Início' },
  { id: 'cardapio', label: 'Cardápio' },
  { id: 'atendimento', label: 'Atendimento' },
  { id: 'fotos', label: 'Fotos' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'localizacao', label: 'Localização' },
];

// ---------- Cardápio ----------

export const categories: Category[] = [
  { id: 'salgadas', label: 'Sabores salgados', emoji: '🍕' },
  { id: 'doces', label: 'Sabores doces', emoji: '🍫' },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🥤',
    emptyMessage: 'Refrigerantes e bebidas geladas: pergunte as opções pelo WhatsApp.',
  },
];

/**
 * SABORES — cardápio oficial da Toripizza (foto do cardápio no Google Maps).
 * `prices` = [pequena, média, grande] em reais. Os preços só aparecem no site
 * se `showPrices` for `true` (o site é uma vitrine, então começa desligado).
 * O texto "como é feita" é uma descrição de apresentação: revise com a pizzaria.
 */
export const showPrices = false;
export const sizes = ['Pequena', 'Média', 'Grande'];

export const products: Product[] = [
  {
    id: 'atum',
    number: 1,
    name: 'Atum',
    category: 'salgadas',
    description: 'Leve e saborosa, para quem gosta de peixe.',
    ingredients: ['Muçarela', 'Atum', 'Azeitonas', 'Orégano'],
    howTo: 'Atum desfiado e escorrido espalhado sobre a muçarela, com azeitonas. Vai ao forno e sai com orégano por cima.',
    prices: [18, 28, 35],
  },
  {
    id: 'bacon',
    number: 2,
    name: 'Bacon',
    category: 'salgadas',
    description: 'Bacon crocante sobre muita muçarela.',
    ingredients: ['Muçarela', 'Bacon', 'Azeitonas', 'Orégano'],
    howTo: 'O bacon é dourado antes, para ficar crocante, e vai sobre a muçarela com azeitonas. Finalizada com orégano.',
    prices: [20, 29, 36],
    image: photos.frangoBaconQueijos,
  },
  {
    id: 'calabresa',
    number: 3,
    name: 'Calabresa',
    category: 'salgadas',
    description: 'A clássica que nunca sai de moda.',
    ingredients: ['Muçarela', 'Calabresa', 'Orégano'],
    howTo: 'Calabresa fatiada em rodelas finas sobre a muçarela. Assada até a borda dourar e a calabresa soltar aquele sabor defumado.',
    prices: [20, 28, 36],
    image: photos.calabresaPortuguesa,
  },
  {
    id: 'siciliana',
    number: 4,
    name: 'Siciliana',
    category: 'salgadas',
    description: 'Com camarão: a pizza para ocasiões especiais.',
    ingredients: ['Muçarela', 'Camarão'],
    howTo: 'Camarão temperado e refogado antes, espalhado sobre a muçarela e levado ao forno bem quente.',
    prices: [22, 32, 42],
  },
  {
    id: 'frango-catupiry',
    number: 5,
    name: 'Frango c/ catupiry',
    category: 'salgadas',
    description: 'O frango desfiado com o catupiry derretendo.',
    ingredients: ['Muçarela', 'Frango', 'Catupiry', 'Orégano'],
    howTo: 'Frango cozido, desfiado e temperado, coberto com catupiry cremoso antes de ir ao forno.',
    prices: [22, 30, 38],
  },
  {
    id: 'frango-cheddar',
    number: 6,
    name: 'Frango cheddar',
    category: 'salgadas',
    description: 'Frango temperado e cheddar cremoso.',
    ingredients: ['Muçarela', 'Frango', 'Cheddar', 'Orégano'],
    howTo: 'Frango desfiado e temperado sobre a muçarela, com cheddar cremoso por cima. Sai do forno com orégano.',
    prices: [20, 30, 38],
  },
  {
    id: 'frango-cream-cheese',
    number: 7,
    name: 'Frango c/ cream cheese',
    category: 'salgadas',
    description: 'Frango desfiado com fios de cream cheese.',
    ingredients: ['Muçarela', 'Frango', 'Cream cheese', 'Orégano'],
    howTo: 'Frango desfiado sobre a muçarela e fios de cream cheese desenhados por cima. Orégano para finalizar.',
    prices: [24, 34, 44],
    image: photos.frangoBaconQueijos,
  },
  {
    id: 'frango',
    number: 8,
    name: 'Frango',
    category: 'salgadas',
    description: 'Frango com milho e ervilha.',
    ingredients: ['Muçarela', 'Frango', 'Milho', 'Ervilha', 'Orégano'],
    howTo: 'Frango desfiado e temperado, milho e ervilha sobre a muçarela. Vai ao forno até tudo gratinar.',
    prices: [20, 28, 36],
  },
  {
    id: 'italiana',
    number: 9,
    name: 'Italiana',
    category: 'salgadas',
    description: 'Calabresa e bacon na mesma pizza.',
    ingredients: ['Muçarela', 'Calabresa', 'Bacon', 'Tomate', 'Cebola', 'Azeitonas', 'Orégano'],
    howTo: 'Calabresa e bacon sobre a muçarela, com tomate e cebola em rodelas e azeitonas. Orégano por cima.',
    prices: [22, 32, 42],
  },
  {
    id: 'margarita',
    number: 10,
    name: 'Margarita',
    category: 'salgadas',
    description: 'Tomate, parmesão e muçarela: simples e perfeita.',
    ingredients: ['Muçarela', 'Parmesão', 'Tomate', 'Azeitonas', 'Orégano'],
    howTo: 'Rodelas de tomate sobre a muçarela, parmesão ralado e azeitonas. No forno o parmesão gratina por cima.',
    prices: [18, 28, 34],
  },
  {
    id: 'mista',
    number: 11,
    name: 'Mista',
    category: 'salgadas',
    description: 'Frango, presunto e calabresa juntos.',
    ingredients: ['Muçarela', 'Frango', 'Presunto', 'Calabresa', 'Milho', 'Ervilha', 'Orégano'],
    howTo: 'Um pouco de tudo: frango, presunto e calabresa sobre a muçarela, com milho e ervilha.',
    prices: [20, 30, 38],
  },
  {
    id: 'moda-da-casa',
    number: 12,
    name: 'Moda da casa',
    category: 'salgadas',
    description: 'A especial da Toripizza, com carne de sol e queijo coalho.',
    ingredients: ['Muçarela', 'Molho de tomate', 'Frango', 'Carne de sol', 'Queijo coalho', 'Cebola', 'Tomate', 'Orégano'],
    howTo: 'A especial da casa: frango e carne de sol desfiados, queijo coalho em cubos, cebola e tomate sobre a muçarela.',
    prices: [25, 35, 45],
    image: photos.carneDeSolChocolate,
  },
  {
    id: 'mucarela',
    number: 13,
    name: 'Muçarela',
    category: 'salgadas',
    description: 'Muito queijo, azeitona e orégano.',
    ingredients: ['Muçarela', 'Azeitonas', 'Orégano'],
    howTo: 'Bastante muçarela derretida, azeitonas e orégano. Simples do jeito certo.',
    prices: [18, 28, 34],
  },
  {
    id: 'peperone',
    number: 14,
    name: 'Peperone',
    category: 'salgadas',
    description: 'Salame italiano com pimentão e cebola.',
    ingredients: ['Muçarela', 'Salame italiano', 'Pimentão', 'Azeitonas', 'Cebola', 'Orégano'],
    howTo: 'Fatias de salame italiano sobre a muçarela, com pimentão, cebola e azeitonas. Assada até o salame ficar crocante nas bordas.',
    prices: [24, 34, 44],
  },
  {
    id: 'portuguesa',
    number: 15,
    name: 'Portuguesa',
    category: 'salgadas',
    description: 'A mais completa do cardápio.',
    ingredients: ['Muçarela', 'Presunto', 'Ervilha', 'Cebola', 'Ovos', 'Azeitonas', 'Milho', 'Tomate', 'Orégano'],
    howTo: 'Presunto, ovo cozido, cebola, tomate, milho, ervilha e azeitonas sobre a muçarela. Orégano para finalizar.',
    prices: [20, 32, 40],
    image: photos.calabresaPortuguesa,
  },
  {
    id: 'presunto',
    number: 16,
    name: 'Presunto',
    category: 'salgadas',
    description: 'Presunto e muçarela, para todas as idades.',
    ingredients: ['Muçarela', 'Presunto', 'Azeitonas', 'Orégano'],
    howTo: 'Presunto fatiado sobre a muçarela, com azeitonas e orégano.',
    prices: [18, 28, 34],
  },
  {
    id: '4-queijos',
    number: 17,
    name: '4 queijos',
    category: 'salgadas',
    description: 'Quatro queijos derretendo juntos.',
    ingredients: ['Muçarela', 'Catupiry', 'Cheddar', 'Parmesão', 'Azeitonas', 'Orégano'],
    howTo: 'Muçarela de base, catupiry e cheddar cremosos e parmesão ralado por cima, tudo derretendo junto no forno.',
    prices: [20, 29, 35],
    image: photos.frangoBaconQueijos,
  },
  {
    id: 'cartola',
    number: 1,
    name: 'Cartola',
    category: 'doces',
    description: 'A sobremesa nordestina em forma de pizza.',
    ingredients: ['Muçarela', 'Banana', 'Canela', 'Açúcar'],
    howTo: 'Banana fatiada sobre a muçarela, polvilhada com açúcar e canela. No forno, o açúcar carameliza.',
    prices: [20, 28, 34],
  },
  {
    id: 'chocolate',
    number: 2,
    name: 'Chocolate',
    category: 'doces',
    description: 'Chocolate cremoso de ponta a ponta.',
    ingredients: ['Muçarela', 'Chocolate'],
    howTo: 'A massa vai ao forno com uma camada de muçarela e recebe chocolate cremoso ainda quente.',
    prices: [20, 28, 36],
    image: photos.meioAMeioChocolate,
  },
  {
    id: 'romeu-e-julieta',
    number: 3,
    name: 'Romeu e Julieta',
    category: 'doces',
    description: 'Queijo coalho e goiabada: a dupla perfeita.',
    ingredients: ['Muçarela', 'Queijo coalho', 'Goiabada'],
    howTo: 'Muçarela e queijo coalho derretidos com fatias de goiabada por cima, que amolecem no calor do forno.',
    prices: [18, 28, 34],
    image: photos.chocolateRomeuJulieta,
  },
];

// ---------- Destaques ----------

export const features = [
  { emoji: '🔥', title: 'Saindo do forno', text: 'Massa assada na hora, com borda dourada e muito queijo.' },
  { emoji: '🍕', title: 'Vários sabores', text: 'Meio a meio ou dividida em mais sabores na mesma pizza, salgados e doces.' },
  { emoji: '🛵', title: 'Delivery', text: 'Entrega sem contato em Toritama.' },
  { emoji: '🏠', title: 'No local ou retirada', text: 'Coma na pizzaria ou retire na porta.' },
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
