/* =====================================================================
   THE BBURGERS – BARRA SHOPPING  |  ARQUIVO DE DADOS (edite aqui!)
   ---------------------------------------------------------------------
   • SITE      → telefone, endereço, links, horários
   • MENU      → itens e preços do cardápio (edite nome/preço/descrição)
   • IMAGENS   → caminhos das fotos. Deixe "" para mostrar o placeholder.
   • FRAMES    → opção de sequência de imagens (canvas) para a capa
   ===================================================================== */

window.SITE = {
  nome: "The BBurgers – Barra Shopping",
  whatsapp: "5521979104529",
  telefoneTel: "+5521979104529",
  telefoneTexto: "(21) 97910-4529",
  instagramUser: "@thebburgersbarrashoppingrj",
  instagramUrl: "https://instagram.com/thebburgersbarrashoppingrj",
  franquiaUrl: "https://lp.thebburgersbrasil.com.br/rj",
  sac: "sac@thebburgers.com.br",
  endereco: "Praça de Alimentação do Aquário – BarraShopping, Av. das Américas, 4666 – Barra da Tijuca, Rio de Janeiro – RJ, CEP 22640-902",
  // Horários por dia da semana (0 = domingo ... 6 = sábado). Formato 24h.
  horarios: {
    0: { abre: 12, fecha: 22 },
    1: { abre: 10, fecha: 22 },
    2: { abre: 10, fecha: 22 },
    3: { abre: 10, fecha: 22 },
    4: { abre: 10, fecha: 22 },
    5: { abre: 10, fecha: 23 },
    6: { abre: 10, fecha: 23 }
  }
};

/* ---------------------------------------------------------------------
   IMAGENS – troque "" pelo caminho da foto (ex.: "img/chedao.png").
   Enquanto estiver "" o site mostra o placeholder azul neon.
   --------------------------------------------------------------------- */
window.IMAGENS = {
  logo: "",
  // Camadas do hambúrguer (PNG sem fundo, todas com a MESMA largura)
  camadas: {
    "pao-cima":  "img/camada-pao-cima.png",
    "bacon":     "img/camada-bacon.png",
    "tomate":    "img/camada-tomate.png",
    "carne":     "img/camada-carne.png",
    "alface":    "img/camada-alface.png",
    "pao-baixo": "img/camada-pao-baixo.png"
    // Quer o queijo cheddar como camada separada? Adicione "queijo": "img/..." aqui
    // e uma linha igual em CAMADAS (abaixo), na posição certa.
  },

  sobre: "",
  // Fotos dos itens do cardápio pela "id" do item
  itens: {
    // "chedao": "img/chedao.png",
  },
  galeria: ["img/burger-neon.jpg", "img/burger-classico.jpg", "", "", "", "", "", ""]
};

/* ---------------------------------------------------------------------
   CLIPES (vídeo realista) – deixe "" para usar o hambúrguer em camadas.
   • hero: vídeo MP4/WebM da montagem/desmontagem do burger. Ele avança
     e volta conforme o scroll. Dica: exporte com muitos keyframes
     (ffmpeg -g 1) para o scrub ficar liso.
   • Galeria e cardápio também aceitam .mp4/.webm nos caminhos de IMAGENS:
     tocam mudos, em loop, só quando aparecem na tela.
   --------------------------------------------------------------------- */
window.CLIPES = {
  hero: { src: "", poster: "" }   // ex.: { src: "video/burger-explode.mp4", poster: "img/burger.jpg" }
};

/* ---------------------------------------------------------------------
   OPÇÃO ALTERNATIVA: sequência de frames em canvas (mais realista).
   1) Exporte os frames: img/frames/frame_001.jpg ... frame_120.jpg
   2) Troque enabled para true e ajuste count / path.
   --------------------------------------------------------------------- */
window.FRAMES = {
  enabled: false,
  path: "img/frames/frame_",   // + número com 3 dígitos + extensão
  ext: ".jpg",
  count: 120
};

/* ---------------------------------------------------------------------
   CARDÁPIO – cada categoria tem uma lista de itens.
   Campos: id, nome, preco (número), desc, selo (opcional), nota (opcional)
   --------------------------------------------------------------------- */
window.MENU = [
  {
    id: "premium",
    titulo: "Linha Premium",
    itens: [
      { id: "bbq", nome: "BBQ", preco: 34.99,
        desc: "Pão, molho do chef, blend bovino de 150g, bacon em tiras, queijo cheddar, cebola caramelizada, molho barbecue e salada verde." },
      { id: "carlinhos-maia", nome: "Burguer do Carlinhos Maia", preco: 35.99, selo: "👑 CAMPEÃO DE VENDAS",
        desc: "Pão, molho do chef, blend bovino de 150g, queijo cheddar, bacon em tiras, cebola roxa grelhada e maionese de alho." },
      { id: "chedao", nome: "Chedão", preco: 39.99,
        desc: "Pão, molho do chef, blend bovino de 150g, queijo cheddar cremoso e crispy de bacon.",
        nota: "*Monte você mesmo (o cheddar e o crispy de bacon vêm separados)." },
      { id: "vulcao", nome: "Vulcão", preco: 39.99,
        desc: "Pão, molho do chef, blend bovino de 150g, bacon em tiras, queijo cheddar, cebola caramelizada, molho barbecue, salada verde e batata frita com bacon e cheddar.",
        nota: "*Monte você mesmo (o cheddar e a farofa vêm separados)." }
    ]
  },
  {
    id: "batatas",
    titulo: "Batatas da Casa",
    subtitulo: "220g + recheio",
    itens: [
      { id: "batata-cheddar", nome: "Batata com cheddar e farofa de bacon", preco: 16.99, selo: "CAMPEÃ",
        desc: "Porção de 220g com cheddar e farofa de bacon." },
      { id: "batata-alho", nome: "Batata com maionese de alho e farofa de bacon", preco: 14.99,
        desc: "Porção de 220g com maionese de alho e farofa de bacon." },
      { id: "batata-mista", nome: "Batata mista", preco: 15.99,
        desc: "Porção de 220g com cheddar, maionese de alho e farofa de bacon." },
      { id: "batata-nutella", nome: "Batata com Nutella", preco: 15.99,
        desc: "Porção de 220g com Nutella." }
    ]
  },
  {
    id: "doguinho",
    titulo: "Doguinho",
    itens: [
      { id: "doguinho", nome: "Doguinho", preco: 16.99,
        desc: "Pão brioche, uma salsicha, queijo mussarela, maionese de alho, molho barbecue e farofa de bacon." }
    ]
  }
];

/* Mini-cards informativos abaixo do cardápio */
window.EXTRAS = [
  { icone: "chef",  titulo: "Dica do Chef", texto: "Você pode substituir o pão de qualquer hambúrguer por salada." },
  { icone: "bird",  titulo: "Blend de Frango", texto: "Você pode trocar o blend bovino por frango em qualquer burger." },
  { icone: "bread", titulo: "Nosso Pão Especial", texto: "Pão brioche artesanal, macio e feito no dia." },
  { icone: "box",   titulo: "Nossas Embalagens", texto: "Feitas para o seu burger chegar perfeito." }
];

/* Textos das etapas da animação (ordem: de cima para baixo) */
/* ar = altura / largura da imagem da camada (usado para empilhar na proporção certa) */
window.CAMADAS = [
  { id: "pao-cima",  ar: 0.38, rotulo: "CAMADA: pão de cima",  texto: "Pão brioche macio" },
  { id: "bacon",     ar: 0.35, rotulo: "CAMADA: bacon",        texto: "Bacon crocante" },
  { id: "tomate",    ar: 0.30, rotulo: "CAMADA: tomate",       texto: "Tomate fresco" },
  { id: "carne",     ar: 0.30, rotulo: "CAMADA: carne",        texto: "Blend bovino 150g" },
  { id: "alface",    ar: 0.52, rotulo: "CAMADA: alface",       texto: "Alface crocante" },
  { id: "pao-baixo", ar: 0.34, rotulo: "CAMADA: pão de baixo", texto: "Base artesanal do dia" }
];

/* Miniaturas da capa (Linha Premium) */
window.THUMBS = ["BBQ", "Carlinhos Maia", "Chedão", "Vulcão"];
