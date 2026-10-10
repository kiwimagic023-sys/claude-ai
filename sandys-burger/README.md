# Sandy's Burger — landing page

Landing page de uma página para a **Sandy's Burger** (Rio de Janeiro): escura, futurista, com neon rosa/roxo e um
hambúrguer que se desmonta camada por camada enquanto você rola a página.

Feita com **Vite + TypeScript + GSAP (ScrollTrigger)** e CSS próprio. Sem React e sem bibliotecas pesadas
(JavaScript final: ~52 kB comprimido). As fontes ficam no próprio site, sem chamadas ao Google Fonts.

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento (http://localhost:5173)
npm run build      # versão final em /dist (checa os tipos antes)
npm run preview    # testa a versão final localmente
```

## O que tem na página

| Seção | O que faz |
|---|---|
| Abertura | letreiro neon "S'" que pisca duas vezes e fica aceso, barra de progresso dos frames, tela que abre com linhas de luz (~2,5 s) |
| Menu | fixo, com desfoque ao rolar, link ativo conforme a seção; vira menu hambúrguer no celular |
| Hero | animação **frame a frame em `<canvas>`** sincronizada com o scroll (pinada por ~400vh, `scrub: 0.5`), textos em 4 etapas com glitch neon, inclinação 3D com mouse/toque, fumaça e faíscas que reagem ao cursor |
| Destaques | faixa com 4 ícones de linha |
| Por que Sandy's? | 4 cards que levantam e brilham no hover |
| Cardápio | abas DOUBLE / TRIPLE, botão **Pedir** abre o WhatsApp com "Olá! Quero pedir um [burger]", faixa do combo e bebida |
| Galeria | grade estilo Instagram com zoom suave |
| Unidades | Barra da Tijuca (destaque, com mapa) + Copacabana, Catete e Niterói |
| Rodapé | faixa em degradê com WhatsApp, horário e redes |

Também: botão flutuante de WhatsApp, entradas suaves em todas as seções, imagens WebP com carregamento lazy,
`prefers-reduced-motion` (sem pin e sem animações) e funcionamento básico sem JavaScript.

## Onde editar

| O que | Onde |
|---|---|
| Preços, nomes e descrições dos 8 burgers, telefone, links | `src/config.ts` |
| Textos do hero, destaques, "Por que Sandy's?", unidades, rodapé | `index.html` |
| Cores, fontes e espaçamentos | `src/styles/tokens.css` |
| Roteiro do hero (quando cada texto entra, duração do pin) | `src/modules/hero.ts` (`STEP_AT` e `end: '+=400%'`) |
| Combo (+ R$ 10,90) e bebida | `index.html` (seção Cardápio) |

Paleta: fundo `#0B0710`, roxo `#7B2FF7`, rosa neon `#FF2E9A`, rosa claro `#FFB3DE`.

## Imagens: o que é provisório

Os arquivos de imagem entregues **foram gerados por script** (renders 3D procedurais), porque o logo oficial e as
fotos reais da Sandy's não estavam disponíveis. Eles funcionam como substitutos e podem ser trocados sem mexer no código:

| Item | Arquivo(s) | Como trocar |
|---|---|---|
| Logo | `public/brand/logo.svg` e o `<symbol id="logo-s">` no topo do `index.html` | cole o SVG oficial (viewBox quadrado); depois rode `npm run brand` para refazer favicons e a imagem de compartilhamento |
| Fotos do cardápio | `public/img/menu/<id>.webp` (720×720; fundo transparente fica melhor) | mantenha os nomes ou ajuste `image` em `src/config.ts` |
| Galeria | `public/img/gallery/g1…g6.webp` (a `g1` é o quadrado grande) | troque os arquivos e os textos `alt` no `index.html` |
| Hero (frames) | `public/frames/d/f0001.webp…` (desktop) e `public/frames/m/…` (celular) | veja abaixo |
| Compartilhamento | `public/og-image.jpg` | `npm run brand` (ou envie uma imagem 1200×630) |

### Trocar a animação do hero por frames reais / de IA / de um vídeo

Os frames atuais são um render 3D estilizado, **não fotos reais**. Para um visual fotográfico (como nas
referências), gere um vídeo do hambúrguer se desmontando e voltando a montar (estúdio, 3D profissional ou
ferramenta de vídeo por IA, de preferência em fundo preto) e converta:

```bash
npm run frames:video -- meu-video.mp4                 # fundo normal
npm run frames:video -- meu-video.mp4 --key black     # fundo preto vira transparente
npm run frames:video -- meu-video.mp4 --desktop 180 --mobile 100
```

O comando (precisa de `ffmpeg`) cria `public/frames/d` (800×960) e `public/frames/m` (560×672) e mostra os
números a colocar em `src/config.ts` (`frames.desktop.count`, `frames.mobile.count`). Se o vídeo tiver fundo
preto e você não usar `--key black`, defina `blend: 'screen'` no mesmo arquivo: o preto some sobre o fundo do site.
Dica: 150 a 200 frames no desktop e 80 a 100 no celular; cada frame com ~30–45 kB.

### Regenerar os renders 3D

Os renders saem de uma cena Three.js em `tools/render/` (pães, carne smash, American Cheese derretendo, alface, tomate,
cebola roxa, molhos, bacon, picles, batata), desenhada em um Chromium sem tela. Precisa de `npm install` e de um
Chromium (`npx playwright install chromium`, ou `CHROMIUM_PATH=/caminho/do/chrome`).

```bash
npm run render -- hero --set d      # 160 frames desktop  -> public/frames/d   (~12 min)
npm run render -- hero --set m      # 90 frames celular   -> public/frames/m   (~6 min)
npm run render -- menu              # 8 burgers do cardápio -> public/img/menu
npm run render -- gallery           # 6 fotos da galeria    -> public/img/gallery
npm run render -- preview --out /tmp/previews --size 600x720 --ss 1 --t 0,0.5,1   # testes rápidos
```

O roteiro do hero (`poseHero` em `tools/render/lib/studio.js`) segue a ordem: 0% montado com luz rosa de um lado e
roxa do outro, 25% camadas se separando, 50% totalmente explodido, 75% se encaixando com o queijo escorrendo,
100% montado. Receitas do cardápio e da galeria: `tools/render/shots.mjs`.

## Publicar

Qualquer hospedagem estática serve (Vercel, Netlify, Cloudflare Pages, Hostinger…). Aponte a raiz do projeto para
`sandys-burger/`, comando de build `npm run build` e pasta de saída `dist`. O `vercel.json` já define cache longo
para `/assets`, `/frames`, `/img` e `/brand`.

Depois de publicar, troque `./og-image.jpg` por `https://SEU-DOMINIO/og-image.jpg` nas meta tags `og:image` e
`twitter:image` do `index.html` (redes sociais exigem endereço completo).

## Desempenho e acessibilidade

Lighthouse (build local, celular simulado em rede lenta): desempenho 96, acessibilidade 100, boas práticas 100,
SEO 100; LCP 2,0 s, CLS 0.

- Frames carregam em ordem "grossa → fina": a animação funciona mesmo com poucos frames e vai ficando mais suave.
- A abertura espera as fontes, o tempo mínimo (1,4 s) e 60% dos frames, com limite de 9 s em conexões lentas.
- Celular usa o conjunto menor de frames (e também quem ativou "economia de dados").
- O mapa de Unidades é um iframe do Google Maps (precisa de internet); o botão "Abrir no Google Maps" fica sempre visível.

## Estrutura

```
index.html                 conteúdo, ícones (sprite SVG) e SEO
src/config.ts              contato, links, cardápio, frames do hero
src/main.ts                inicialização
src/modules/               loader, hero, fx (partículas), frames, menu, nav, reveal
src/styles/                tokens, componentes, nav, loader, hero, seções
src/assets/fonts/          Anton, Inter e Kaushan Script (latin, OFL)
public/                    frames, imagens, logo, ícones, manifest
tools/render/              estúdio 3D (Three.js) que gera frames e fotos
tools/brand/               gera ícones e imagem de compartilhamento
tools/frames-from-video.mjs  converte vídeo em frames
```
