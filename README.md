# Poison Donuts — site oficial

Site institucional da **Poison Donuts** (Barra Shopping, Barra da Tijuca, RJ): os melhores donuts da galáxia.
Ele apresenta a loja (sabores, como os donuts são feitos, eventos, avaliações e localização). Não é uma loja virtual:
não há carrinho, preços nem pagamento. O contato é por telefone, WhatsApp ou na própria loja.

Feito com **React + TypeScript + Vite** e CSS próprio, sem bibliotecas pesadas. As fontes (Unbounded e Plus Jakarta Sans)
são hospedadas no próprio site, sem chamadas ao Google Fonts.

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # gera a versão final em /dist
npm run preview  # testa a versão final localmente
```

Para publicar, envie a pasta `dist/` para qualquer hospedagem estática. O site tem páginas com endereço próprio,
e os arquivos que fazem esses endereços funcionarem já estão incluídos:

| Hospedagem | Arquivo |
|---|---|
| Netlify / Cloudflare Pages | `public/_redirects` |
| Vercel | `vercel.json` |
| Hostinger e outras com Apache | `public/.htaccess` |

## Páginas

| Endereço | Conteúdo |
|---|---|
| `/` | Página inicial com todas as seções (`/#cardapio`, `/#eventos`, `/#localizacao`…) |
| `/cardapio` | Cardápio completo com busca e categorias (bom para o link da bio do Instagram) |
| `/privacidade` | Política de privacidade (LGPD) |
| qualquer outro | Página 404 |

Clicar em um sabor abre os detalhes (foto grande, ingredientes e sugestões).

## Onde editar as informações

Tudo fica em **`src/config/site.ts`**:

| O que | Onde |
|---|---|
| Nome, slogan, telefone, endereço, avaliação | `store` |
| Instagram, Google Maps | `links` |
| Vídeo em tela cheia da abertura | `heroVideo` (arquivos em `public/videos/`) |
| Fotos (Sobre nós, galeria, Instagram) | `photos`, `aboutImages` |
| Horários (o indicador "Aberto/Fechado" usa estes dados) | `hours` |
| Produtos, descrições, ingredientes, selos | `products` |
| Donuts recortados (sem fundo) usados nas animações | `donutCutouts`, `showcase` |
| Categorias do cardápio | `categories` |
| Galeria e posts do Instagram | `gallery`, `instagramPosts` |
| Avaliações reais de clientes | `reviews` |
| Pagamento online, formulário de eventos, iFood/Rappi | `integrations` |

- **Selos:** `bestSeller: true` = "Favorito"; `isNew: true` = "Novidade".
- **Avaliações:** inclua apenas avaliações reais. Com a lista vazia, o site mostra a nota geral (4,7) e o link para o Google.

## Como colocar as imagens

1. Salve os arquivos em `public/images/` (ex.: `public/images/kinder-bueno.webp`).
2. No `src/config/site.ts`, adicione `image: '/images/kinder-bueno.webp'` ao produto, item da galeria ou post.

Formatos aceitos: `.webp`, `.jpg`, `.png`, `.avif`, `.gif` animado e vídeos curtos `.mp4`/`.webm`, que tocam sem som e em loop.
Enquanto um item não tiver `image`, o site mostra uma ilustração de donut gerada automaticamente.

### Vídeo da abertura

Para trocar o vídeo, gere as versões abaixo (o exemplo usa o `ffmpeg`) e atualize `heroVideo`:

```bash
ffmpeg -i video.mp4 -an -c:v libx264 -crf 27 -movflags +faststart -vf scale=1080:-2 public/videos/hero-1080.mp4
ffmpeg -i video.mp4 -an -c:v libx264 -crf 28 -movflags +faststart -vf scale=720:-2  public/videos/hero-720.mp4
ffmpeg -i video.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 36 -vf scale=1080:-2 public/videos/hero-1080.webm
ffmpeg -i video.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 38 -vf scale=720:-2  public/videos/hero-720.webm
ffmpeg -ss 1.6 -i video.mp4 -frames:v 1 -vf scale=720:-2 public/videos/hero-poster.jpg
```

## Contato e formulários

- Botões **Ligar** (menu, capa, barra do celular e localização) usam o telefone de `store.phoneE164`.
- O formulário de eventos envia a solicitação pelo WhatsApp. Para receber por e-mail ou sistema, informe um endpoint (ex.: Formspree) em `integrations.eventFormEndpoint`.

## Animações com a rolagem

- **Capa (depois da abertura):** vídeo em tela cheia que vira um cartão, com donuts voando e frases aparecendo.
- **Nossos donuts de verdade:** os donuts recortados se abrem em leque (no celular, em grade 2×2).
- **Abertura (primeira tela):** um donut com carinha é feito etapa por etapa enquanto a pessoa rola (massa, descanso, fritura, cobertura, recheio e decoração). Os olhos seguem o dedo/mouse e ele reage ao toque.

Para quem ativou "reduzir movimento" no aparelho, as animações ficam desligadas e o conteúdo aparece parado.

### Recortar novas fotos

Fotos de donuts sem fundo ficam em `public/images/donuts/` (WebP com transparência) e aparecem "flutuando" automaticamente.
O recorte pode ser feito com qualquer removedor de fundo (por exemplo, a ferramenta `rembg`).

Nunca coloque chaves secretas no código: tudo neste projeto é público no navegador.

## Estrutura

```
src/
  config/site.ts        ← configuração central
  components/           ← Navbar, Hero, Showcase, HowItsMade, Menu, ProductCard, Events, Gallery, Reviews, Location, Footer…
  context/              ← janela de detalhes do sabor
  hooks/                ← animações com a rolagem, modais, revelação ao rolar
  pages/                ← páginas: início, cardápio, privacidade, 404
  lib/                  ← WhatsApp, horários, formatação
  styles/global.css     ← design system (cores, animações, responsividade)
public/                 ← favicon, imagem de compartilhamento, robots, sitemap, imagens
```
