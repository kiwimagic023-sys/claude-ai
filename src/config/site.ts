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
 *  PREÇOS: `price: null` mostra "Consulte". Para mostrar um
 *  preço, informe o valor em reais (ex.: price: 24.9).
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
  /** preço em R$. `null` = "Consulte" */
  price: number | null;
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
  tag: 'Donuts' | 'Mini donuts' | 'Eventos' | 'Loja' | 'Embalagens' | 'Produtos' | 'Bastidores';
  image?: string;
  art?: DonutArt;
  /** proporção do card no mosaico */
  shape?: 'tall' | 'wide' | 'square';
}

export interface Review {
  author: string;
  rating: number;
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
  ratingCount: 400,
  /** texto exibido: "Mais de 400 avaliações" */
  ratingCountLabel: 'Mais de 400 avaliações',
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

export const whatsappDefaultMessage = 'Olá, Poison Donuts! Gostaria de fazer um pedido.';

/**
 * HORÁRIOS — confirme com a loja e ajuste aqui.
 * O fechamento às 23h veio das informações da marca; a abertura
 * às 10h é um valor inicial que deve ser conferido.
 */
export const hours: DayHours[] = [
  { day: 1, label: 'Segunda', open: '10:00', close: '23:00' },
  { day: 2, label: 'Terça', open: '10:00', close: '23:00' },
  { day: 3, label: 'Quarta', open: '10:00', close: '23:00' },
  { day: 4, label: 'Quinta', open: '10:00', close: '23:00' },
  { day: 5, label: 'Sexta', open: '10:00', close: '23:00' },
  { day: 6, label: 'Sábado', open: '10:00', close: '23:00' },
  { day: 0, label: 'Domingo', open: '10:00', close: '23:00' },
];
export const timeZone = 'America/Sao_Paulo';

/**
 * INTEGRAÇÕES — estrutura pronta para o futuro.
 * Nunca coloque chaves secretas de API aqui: este arquivo vai para o navegador.
 */
export const integrations = {
  /** URL de checkout/pagamento online. `null` = pedido finalizado pelo WhatsApp. */
  checkoutUrl: null as string | null,
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
    emptyMessage: 'Nossas bebidas estão chegando ao site. Consulte as opções do dia pelo WhatsApp ou na loja.',
  },
  {
    id: 'combos',
    label: 'Combos',
    emoji: '📦',
    emptyMessage: 'Monte seu combo com a gente! Fale pelo WhatsApp e consulte caixas e kits disponíveis.',
  },
  { id: 'especiais', label: 'Edições Especiais', emoji: '✨' },
];

/**
 * PRODUTOS — descrições e ingredientes são textos de apresentação.
 * Revise com a equipe da loja. Os selos `bestSeller` (Mais pedidos) e
 * `isNew` (Novidades) podem ser ligados/desligados livremente.
 */
export const products: Product[] = [
  {
    id: 'kinder-bueno',
    name: 'Kinder Bueno',
    category: 'donuts',
    description: 'Cobertura cremosa de chocolate, pedaços crocantes de Kinder Bueno e um toque de avelã.',
    ingredients: ['Chocolate', 'Kinder Bueno', 'Creme de avelã'],
    price: null,
    art: { glaze: '#6b3a1f', drizzle: '#f5e6d3', topping: 'wafer' },
    bestSeller: true,
  },
  {
    id: 'ferrero-rocher',
    name: 'Ferrero Rocher',
    category: 'donuts',
    description: 'Chocolate intenso, avelãs crocantes e um Ferrero Rocher coroando o topo.',
    ingredients: ['Chocolate', 'Ferrero Rocher', 'Avelã'],
    price: null,
    art: { glaze: '#4a2412', drizzle: '#d9a441', topping: 'hazelnut' },
    bestSeller: true,
  },
  {
    id: 'oreo',
    name: 'Donut de Oreo',
    category: 'donuts',
    description: 'Cobertura branca e muito biscoito Oreo triturado em cada mordida.',
    ingredients: ['Biscoito Oreo', 'Cobertura branca', 'Creme'],
    price: null,
    art: { glaze: '#f4f1ee', drizzle: '#1d1a1a', topping: 'cookie' },
    bestSeller: true,
  },
  {
    id: 'bavarian',
    name: 'Donut Bavarian',
    category: 'donuts',
    description: 'O clássico recheado: massa fofinha e muito creme estilo bavarian no centro.',
    ingredients: ['Creme bavarian', 'Massa fofinha', 'Açúcar'],
    price: null,
    art: { glaze: '#f7d9a8', topping: 'cream', filled: true },
  },
  {
    id: 'banoffee',
    name: 'Banoffee',
    category: 'donuts',
    description: 'Banana, doce de leite e chantilly: a sobremesa favorita em versão donut.',
    ingredients: ['Banana', 'Doce de leite', 'Chantilly'],
    price: null,
    art: { glaze: '#c98a3d', drizzle: '#fff4e0', topping: 'banana' },
  },
  {
    id: 'morango-chantininho',
    name: 'Morango com Chantininho',
    category: 'donuts',
    description: 'Cobertura de morango, chantininho aerado e morangos frescos por cima.',
    ingredients: ['Morango', 'Chantininho'],
    price: null,
    art: { glaze: '#ff5c9a', drizzle: '#ffffff', topping: 'strawberry' },
  },
  {
    id: 'chantilly-morango',
    name: 'Chantilly com Morango',
    category: 'donuts',
    description: 'Leve e fresquinho: chantilly generoso e morangos selecionados.',
    ingredients: ['Chantilly', 'Morango'],
    price: null,
    art: { glaze: '#fff6f8', drizzle: '#ff6fa8', topping: 'strawberry' },
  },
  {
    id: 'simpson',
    name: 'Simpson',
    category: 'especiais',
    description: 'O donut mais famoso da cultura pop: cobertura rosa e granulado colorido.',
    ingredients: ['Cobertura rosa', 'Granulado colorido'],
    price: null,
    art: { glaze: '#ff6fc0', topping: 'sprinkles' },
    bestSeller: true,
  },
  {
    id: 'popcorn',
    name: 'Popcorn',
    category: 'especiais',
    description: 'Doce, salgado e crocante: caramelo com pipoca por cima.',
    ingredients: ['Caramelo', 'Pipoca'],
    price: null,
    art: { glaze: '#e3a54a', drizzle: '#fff1c9', topping: 'popcorn' },
    isNew: true,
  },
  {
    id: 'pretzel',
    name: 'Pretzel',
    category: 'especiais',
    description: 'O equilíbrio perfeito entre chocolate e a crocância salgadinha do pretzel.',
    ingredients: ['Chocolate', 'Pretzel'],
    price: null,
    art: { glaze: '#3b1f12', drizzle: '#f3d27a', topping: 'pretzel' },
    isNew: true,
  },
  {
    id: 'mini-donuts',
    name: 'Mini Donuts',
    category: 'mini',
    description: 'Pequenos no tamanho, gigantes no sabor. Perfeitos para dividir (ou não).',
    ingredients: ['Sabores variados', 'Coberturas sortidas'],
    price: null,
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
  { id: 'g1', title: 'Kinder Bueno', tag: 'Donuts', shape: 'tall', art: products[0].art },
  { id: 'g2', title: 'Mini donuts', tag: 'Mini donuts', shape: 'square', art: products[10].art },
  { id: 'g3', title: 'Mesa de evento', tag: 'Eventos', shape: 'wide', art: { glaze: '#ff2fb3', topping: 'sprinkles' } },
  { id: 'g4', title: 'Simpson', tag: 'Produtos', shape: 'square', art: products[7].art },
  { id: 'g5', title: 'Nossa loja', tag: 'Loja', shape: 'tall', art: { glaze: '#7b2ff7', drizzle: '#39e991', topping: 'none' } },
  { id: 'g6', title: 'Caixa Poison', tag: 'Embalagens', shape: 'square', art: products[2].art },
  { id: 'g7', title: 'Ferrero Rocher', tag: 'Donuts', shape: 'square', art: products[1].art },
  { id: 'g8', title: 'Bastidores', tag: 'Bastidores', shape: 'wide', art: products[3].art },
  { id: 'g9', title: 'Morango com Chantininho', tag: 'Donuts', shape: 'tall', art: products[5].art },
];

// ---------- Instagram ----------
// Para mostrar posts reais, informe `image` (foto do post) e `url` (link do post).

export const instagramPosts: { id: string; image?: string; url?: string; art: DonutArt; caption: string }[] = [
  { id: 'i1', caption: 'Kinder Bueno', art: products[0].art },
  { id: 'i2', caption: 'Simpson', art: products[7].art },
  { id: 'i3', caption: 'Oreo', art: products[2].art },
  { id: 'i4', caption: 'Popcorn', art: products[8].art },
  { id: 'i5', caption: 'Morango', art: products[5].art },
  { id: 'i6', caption: 'Mini donuts', art: products[10].art },
];

// ---------- Avaliações ----------
/**
 * Insira aqui somente avaliações REAIS de clientes (copiadas do Google, iFood etc.).
 * Enquanto a lista estiver vazia, o site mostra a nota geral e um link para as avaliações.
 * Exemplo:
 *   { author: 'Nome do cliente', rating: 5, text: 'Texto da avaliação', source: 'Google', date: '2025' },
 */
export const reviews: Review[] = [];
