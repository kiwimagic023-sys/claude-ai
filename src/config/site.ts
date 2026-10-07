/**
 * ============================================================
 *  POISON DONUTS — CONFIGURAÇÃO CENTRAL DO SITE
 * ============================================================
 *  Para atualizar o site, edite os dados deste arquivo.
 *  Os componentes leem tudo daqui: loja, contato, horários,
 *  produtos, preços, imagens, galeria, avaliações e links.
 *
 *  IMAGENS: coloque as fotos em /public/images/ e informe o
 *  caminho no campo `image` (ex.: '/images/kinder-bueno.webp').
 *  Sem `image`, o site mostra uma ilustração de donut gerada
 *  a partir do campo `art`.
 *
 * ============================================================
 */

// ---------- Tipos ----------

export type Topping =
  | 'sprinkles'
  | 'wafer'
  | 'hazelnut'
  | 'cookie'
  | 'strawberry'
  | 'popcorn'
  | 'pretzel'
  | 'banana'
  | 'cream'
  | 'none';

/** vídeo com versões WebM/MP4 e imagem de capa */
export interface VideoSource {
  mp4: string;
  webm?: string;
  poster?: string;
}
/** caminho de uma imagem/vídeo, ou um vídeo com várias versões */
export type MediaSource = string | VideoSource;

export interface DonutArt {
  /** cor principal da cobertura */
  glaze: string;
  /** cor do fio decorativo (drizzle) por cima */
  drizzle?: string;
  topping: Topping;
  /** donut recheado, sem furo (ex.: Bavarian) */
  filled?: boolean;
  /** cor da massa */
  dough?: string;
}

export type CategoryId = 'donuts' | 'mini' | 'bebidas' | 'combos' | 'especiais';

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
  image?: string;
  art: DonutArt;
  bestSeller?: boolean;
  isNew?: boolean;
}

export interface DayHours {
  /** 0 = domingo ... 6 = sábado */
  day: number;
  label: string;
  /** 'HH:MM' — use null para fechado */
  open: string | null;
  close: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  tag: 'Donuts' | 'Mini donuts' | 'Especiais' | 'Vídeos' | 'Eventos' | 'Loja' | 'Embalagens' | 'Produtos' | 'Bastidores';
  image?: MediaSource;
  art?: DonutArt;
  /** proporção do card no mosaico */
  shape?: 'tall' | 'wide' | 'square';
}

export interface Review {
  author: string;
  /** nota em estrelas (opcional: só preencha se souber a nota exata) */
  rating?: number;
  text: string;
  /** ex.: 'Google', 'iFood' */
  source: string;
  date?: string;
}

export interface DeliveryPlatform {
  name: string;
  url: string;
  enabled: boolean;
}

// ---------- Loja ----------

export const store = {
  name: 'Poison Donuts',
  slogan: 'Os melhores Donuts da galáxia!',
  segment: 'Donut Shop · Confeitaria · Doces',
  phoneDisplay: '(21) 96565-6158',
  /** formato internacional, só números — usado no WhatsApp e no link tel: */
  phoneE164: '5521965656158',
  website: 'https://poisondonut.com.br',
  priceRange: 'R$20–40',
  rating: 4.7,
  ratingCount: 446,
  /** texto exibido junto da nota */
  ratingCountLabel: '446 avaliações no Google',
  services: ['Delivery', 'Retirada no local', 'Compra na loja', 'Eventos', 'Encomendas'],
  address: {
    street: 'Av. das Américas, 4666',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip: '22640-102',
    venue: 'Barra Shopping',
    lat: -22.9997,
    lng: -43.3652,
  },
};

export const links = {
  instagramHandle: '@poison_donuts',
  instagram: 'https://www.instagram.com/poison_donuts/',
  googleMaps:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Poison Donuts, Av. das Américas, 4666 - Barra da Tijuca, Rio de Janeiro - RJ, 22640-102'),
  googleReviews:
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Poison Donuts Barra Shopping'),
};

export const whatsappDefaultMessage = 'Olá, Poison Donuts! Gostaria de mais informações.';

/** HORÁRIOS — o indicador "Aberto/Fechado" do site usa estes dados. */
export const hours: DayHours[] = [
  { day: 1, label: 'Segunda', open: '12:00', close: '23:00' },
  { day: 2, label: 'Terça', open: '12:00', close: '23:00' },
  { day: 3, label: 'Quarta', open: '12:00', close: '23:00' },
  { day: 4, label: 'Quinta', open: '12:00', close: '23:00' },
  { day: 5, label: 'Sexta', open: '12:00', close: '23:00' },
  { day: 6, label: 'Sábado', open: '12:00', close: '23:00' },
  { day: 0, label: 'Domingo', open: '12:00', close: '22:00' },
];
export const timeZone = 'America/Sao_Paulo';

/**
 * INTEGRAÇÕES — estrutura pronta para o futuro.
 * Nunca coloque chaves secretas de API aqui: este arquivo vai para o navegador.
 */
export const integrations = {
  /**
   * Endpoint (seu backend, Formspree, etc.) que recebe o formulário de eventos via POST JSON.
   * `null` = a solicitação é enviada pelo WhatsApp.
   */
  eventFormEndpoint: null as string | null,
  /** Plataformas de delivery. Marque `enabled: true` e informe a URL para exibir o botão. */
  deliveryPlatforms: [
    { name: 'iFood', url: '', enabled: false },
    { name: 'Rappi', url: '', enabled: false },
  ] as DeliveryPlatform[],
};

// ---------- Vídeo da abertura ----------
/**
 * Vídeo em tela cheia no topo do site (sem som, em loop).
 * Cada versão tem WebM (mais leve no Chrome/Android) e MP4 (Safari/iPhone).
 * `mobile` = versão mais leve usada em telas pequenas; `poster` = imagem enquanto carrega.
 */
export const heroVideo = {
  desktop: { webm: '/videos/hero-morango-1080.webm', mp4: '/videos/hero-morango-1080.mp4' },
  mobile: { webm: '/videos/hero-morango-720.webm', mp4: '/videos/hero-morango-720.mp4' },
  poster: '/videos/hero-morango-poster.jpg',
};

// ---------- Logo ----------
/** logo oficial (mascote em círculo roxo). `small` é usado em tamanhos até 96px. */
export const brandLogo = {
  large: '/images/logo-poison-donuts.webp',
  small: '/images/logo-poison-donuts-96.webp',
};

// ---------- Fotos ----------
export const photos = {
  morangoComCreme: '/images/morango-com-creme.webp',
  morangoComCremeArte: '/images/morango-com-creme-arte.webp',
  especialDeQuarta: '/images/especial-de-quarta.webp',
  chocolateGranulado: '/images/chocolate-granulado.webp',
  edicaoFriends: '/images/edicao-friends.webp',
};

/** donuts recortados (sem fundo, mão ou texto) — usados no cardápio e nas animações */
export const donutCutouts = {
  morangoComCreme: '/images/donuts/morango-com-creme.webp',
  alemanha: '/images/donuts/alemanha.webp',
  chocolateGranulado: '/images/donuts/chocolate-granulado.webp',
  friends: '/images/donuts/friends.webp',
};

/**
 * "Nossos donuts de verdade": fotos que se abrem em leque com a rolagem.
 * `productId` liga a foto ao sabor do cardápio (abre os detalhes ao tocar).
 */
export const showcase: { image: string; title: string; text: string; productId?: string }[] = [
  { image: donutCutouts.alemanha, title: 'Donut Alemanha', text: 'O especial de quarta', productId: 'alemanha' },
  { image: donutCutouts.morangoComCreme, title: 'Morango com Creme', text: 'Crosta de morango e brigadeiro branco', productId: 'morango-com-creme' },
  { image: donutCutouts.chocolateGranulado, title: 'Chocolate com Granulado', text: 'O clássico que nunca falha', productId: 'chocolate-granulado' },
  { image: donutCutouts.friends, title: 'Edição Friends', text: 'Chocolate e doce de leite', productId: 'friends' },
]



/** fotos da seção "Sobre nós" */
export const aboutImages = [donutCutouts.morangoComCreme, donutCutouts.friends, donutCutouts.chocolateGranulado];

// ---------- Navegação ----------

export const navItems = [
  { id: 'inicio', label: 'Início' },
  { id: 'cardapio', label: 'Cardápio' },
  { id: 'sabores', label: 'Sabores' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'sobre', label: 'Sobre nós' },
  { id: 'localizacao', label: 'Localização' },
];

// ---------- Cardápio ----------

export const categories: Category[] = [
  { id: 'donuts', label: 'Donuts', emoji: '🍩' },
  { id: 'mini', label: 'Mini Donuts', emoji: '🪐' },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🥤',
    emptyMessage: 'As bebidas do dia você confere direto na loja ou perguntando pelo WhatsApp.',
  },
  {
    id: 'combos',
    label: 'Combos',
    emoji: '📦',
    emptyMessage: 'Caixas e kits para presentear ou dividir: confira as opções na loja ou pelo WhatsApp.',
  },
  { id: 'especiais', label: 'Edições Especiais', emoji: '✨' },
];

/**
 * PRODUTOS — descrições e ingredientes são textos de apresentação.
 * Revise com a equipe da loja. Os selos `bestSeller` (Favoritos) e
 * `isNew` (Novidades) podem ser ligados/desligados livremente.
 */
export const products: Product[] = [
  {
    id: 'morango-com-creme',
    name: 'Morango com Creme',
    category: 'donuts',
    description: 'Cremoso, fresquinho e irresistível: crosta de morango por fora, recheio de brigadeiro branco e morangos frescos por cima.',
    ingredients: ['Crosta de morango', 'Brigadeiro branco', 'Morango fresco'],
    image: donutCutouts.morangoComCreme,
    art: { glaze: '#fff1f4', drizzle: '#ff6f9a', topping: 'strawberry' },
    isNew: true,
  },
  {
    id: 'chocolate-granulado',
    name: 'Chocolate com Granulado',
    category: 'donuts',
    description: 'O clássico que nunca falha: cobertura de chocolate e muito granulado.',
    ingredients: ['Chocolate', 'Granulado'],
    image: donutCutouts.chocolateGranulado,
    art: { glaze: '#5a2e17', topping: 'sprinkles' },
  },
  {
    id: 'kinder-bueno',
    name: 'Kinder Bueno',
    category: 'donuts',
    description: 'Cobertura cremosa de chocolate, pedaços crocantes de Kinder Bueno e um toque de avelã.',
    ingredients: ['Chocolate', 'Kinder Bueno', 'Creme de avelã'],
    art: { glaze: '#6b3a1f', drizzle: '#f5e6d3', topping: 'wafer' },
    bestSeller: true,
  },
  {
    id: 'ferrero-rocher',
    name: 'Ferrero Rocher',
    category: 'donuts',
    description: 'Chocolate intenso, avelãs crocantes e um Ferrero Rocher coroando o topo.',
    ingredients: ['Chocolate', 'Ferrero Rocher', 'Avelã'],
    art: { glaze: '#4a2412', drizzle: '#d9a441', topping: 'hazelnut' },
    bestSeller: true,
  },
  {
    id: 'oreo',
    name: 'Donut de Oreo',
    category: 'donuts',
    description: 'Cobertura branca e muito biscoito Oreo triturado em cada mordida.',
    ingredients: ['Biscoito Oreo', 'Cobertura branca', 'Creme'],
    art: { glaze: '#f4f1ee', drizzle: '#1d1a1a', topping: 'cookie' },
    bestSeller: true,
  },
  {
    id: 'bavarian',
    name: 'Donut Bavarian',
    category: 'donuts',
    description: 'O clássico recheado: massa fofinha e muito creme estilo bavarian no centro.',
    ingredients: ['Creme bavarian', 'Massa fofinha', 'Açúcar'],
    art: { glaze: '#f7d9a8', topping: 'cream', filled: true },
  },
  {
    id: 'banoffee',
    name: 'Banoffee',
    category: 'donuts',
    description: 'Banana, doce de leite e chantilly: a sobremesa favorita em versão donut.',
    ingredients: ['Banana', 'Doce de leite', 'Chantilly'],
    art: { glaze: '#c98a3d', drizzle: '#fff4e0', topping: 'banana' },
  },
  {
    id: 'morango-chantininho',
    name: 'Morango com Chantininho',
    category: 'donuts',
    description: 'Cobertura de morango, chantininho aerado e morangos frescos por cima.',
    ingredients: ['Morango', 'Chantininho'],
    art: { glaze: '#ff5c9a', drizzle: '#ffffff', topping: 'strawberry' },
  },
  {
    id: 'chantilly-morango',
    name: 'Chantilly com Morango',
    category: 'donuts',
    description: 'Leve e fresquinho: chantilly generoso e morangos selecionados.',
    ingredients: ['Chantilly', 'Morango'],
    art: { glaze: '#fff6f8', drizzle: '#ff6fa8', topping: 'strawberry' },
  },
  {
    id: 'simpson',
    name: 'Simpson',
    category: 'especiais',
    description: 'O donut mais famoso da cultura pop: cobertura rosa e granulado colorido.',
    ingredients: ['Cobertura rosa', 'Granulado colorido'],
    art: { glaze: '#ff6fc0', topping: 'sprinkles' },
    bestSeller: true,
  },
  {
    id: 'popcorn',
    name: 'Popcorn',
    category: 'especiais',
    description: 'Doce, salgado e crocante: caramelo com pipoca por cima.',
    ingredients: ['Caramelo', 'Pipoca'],
    art: { glaze: '#e3a54a', drizzle: '#fff1c9', topping: 'popcorn' },
    isNew: true,
  },
  {
    id: 'pretzel',
    name: 'Pretzel',
    category: 'especiais',
    description: 'O equilíbrio perfeito entre chocolate e a crocância salgadinha do pretzel.',
    ingredients: ['Chocolate', 'Pretzel'],
    art: { glaze: '#3b1f12', drizzle: '#f3d27a', topping: 'pretzel' },
    isNew: true,
  },
  {
    id: 'alemanha',
    name: 'Donut Alemanha',
    category: 'especiais',
    description: 'O especial de quarta inspirado na Alemanha: cobertura crocante e um recheio dourado e cremoso no centro.',
    ingredients: ['Cobertura crocante', 'Recheio especial'],
    image: donutCutouts.alemanha,
    art: { glaze: '#f3e3c3', drizzle: '#e3a54a', topping: 'none' },
    isNew: true,
  },
  {
    id: 'friends',
    name: 'Edição Friends',
    category: 'especiais',
    description: 'Donut de chocolate recheado com doce de leite e finalizado com lascas de chocolate.',
    ingredients: ['Chocolate', 'Doce de leite', 'Lascas de chocolate'],
    image: donutCutouts.friends,
    art: { glaze: '#4a2412', drizzle: '#d9a441', topping: 'none' },
    isNew: true,
  },
  {
    id: 'mini-donuts',
    name: 'Mini Donuts',
    category: 'mini',
    description: 'Pequenos no tamanho, gigantes no sabor. Perfeitos para dividir (ou não).',
    ingredients: ['Sabores variados', 'Coberturas sortidas'],
    art: { glaze: '#8b5cf6', drizzle: '#7CFF8A', topping: 'sprinkles' },
    isNew: true,
  },
];

// ---------- Eventos ----------

export const eventTypes = [
  { emoji: '🎉', title: 'Festas', text: 'Mesas de donuts que viram o centro das atenções e das fotos.' },
  { emoji: '🏢', title: 'Eventos corporativos', text: 'Coffee breaks, ações de marca e presentes para equipes e clientes.' },
  { emoji: '🎂', title: 'Aniversários', text: 'Sabores para todas as idades e um parabéns muito mais gostoso.' },
  { emoji: '💜', title: 'Eventos especiais', text: 'Casamentos, chás e celebrações com a assinatura Poison.' },
];

// ---------- Galeria ----------
// Substitua `art` por `image: '/images/arquivo.webp'` quando tiver as fotos reais.

export const gallery: GalleryItem[] = [
  { id: 'g1', title: 'Morango com Creme', tag: 'Donuts', shape: 'tall', image: photos.morangoComCreme, art: { glaze: '#ff6f9a', topping: 'none' } },
  { id: 'g2', title: 'Donut Alemanha', tag: 'Especiais', shape: 'square', image: photos.especialDeQuarta, art: { glaze: '#ffd23f', topping: 'none' } },
  { id: 'g3', title: 'Morango com Creme em vídeo', tag: 'Vídeos', shape: 'tall', image: { ...heroVideo.mobile, poster: heroVideo.poster }, art: { glaze: '#ff7ac8', topping: 'none' } },
  { id: 'g4', title: 'Chocolate com granulado', tag: 'Donuts', shape: 'tall', image: photos.chocolateGranulado, art: { glaze: '#6b3a1f', topping: 'none' } },
  { id: 'g5', title: 'Edição Friends', tag: 'Especiais', shape: 'tall', image: photos.edicaoFriends, art: { glaze: '#c98a3d', topping: 'none' } },
  { id: 'g6', title: 'Cremoso, fresquinho e irresistível', tag: 'Donuts', shape: 'square', image: photos.morangoComCremeArte, art: { glaze: '#ff2fb3', topping: 'none' } },
];

// ---------- Instagram ----------
// `image` = foto do post; `url` = link do post (sem url, abre o perfil).

export const instagramPosts: { id: string; image?: string; url?: string; art: DonutArt; caption: string }[] = [
  { id: 'i1', caption: 'Morango com Creme', image: photos.morangoComCremeArte, art: { glaze: '#ff6f9a', topping: 'none' } },
  { id: 'i2', caption: 'Donut Alemanha', image: photos.especialDeQuarta, art: { glaze: '#ffd23f', topping: 'none' } },
  { id: 'i3', caption: 'Chocolate com granulado', image: photos.chocolateGranulado, art: { glaze: '#6b3a1f', topping: 'none' } },
  { id: 'i4', caption: 'Edição Friends', image: photos.edicaoFriends, art: { glaze: '#c98a3d', topping: 'none' } },
  { id: 'i5', caption: 'Morango com Creme', image: photos.morangoComCreme, art: { glaze: '#ff6f9a', topping: 'none' } },
  { id: 'i6', caption: 'Vídeo Morango com Creme', image: heroVideo.poster, art: { glaze: '#ff7ac8', topping: 'none' } },
];

// ---------- Avaliações ----------
/**
 * Insira aqui somente avaliações REAIS de clientes (copiadas do Google, iFood etc.).
 * Enquanto a lista estiver vazia, o site mostra a nota geral e um link para as avaliações.
 * Exemplo:
 *   { author: 'Nome do cliente', rating: 5, text: 'Texto da avaliação', source: 'Google', date: '2025' },
 */
export const reviews: Review[] = [
  {
    author: 'Marcelo Cassar',
    text: 'Sem dúvidas um dos melhores donuts do mundo. E comparando com aqueles americanos hein. A massa é absurdamente fresca e é tão levinha que até eu que não como sem ser recheado amei os não recheados também. Meu preferido foi o de kinder bueno, mas o de ferrero richet também era muito top. Nota mil pra loja. Merece todo sucesso.',
    source: 'Google',
    date: 'Local Guide',
  },
  {
    author: 'Bianca Menezes',
    text: 'Os melhores donuts são da Poison, super macios, uma variedade de sabores enormes e por falar em enormes, o tamanho também é surreal. O atendimento sempre muito atencioso…',
    source: 'Google',
    date: 'Local Guide',
  },
  {
    author: 'Alex Magno',
    text: 'Iniciando pelos donuts, constata-se que são verdadeiramente notáveis. A única ressalva reside na ampla variedade disponível, o que, por vezes, dificulta a seleção da opção mais desejável, claro que é apenas uma brincadeira…',
    source: 'Google',
    date: 'Local Guide',
  },
];
