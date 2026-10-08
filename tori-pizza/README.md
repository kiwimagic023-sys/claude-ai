# Toripizza — site oficial

Site vitrine da **Toripizza**, pizzaria em Toritama - PE (R. Limoeiro, 12, Lot. Deus é Fiel).
Mostra o cardápio, como pedir (delivery, retirada e no local), fotos, avaliações e localização.
Não é loja virtual: não há carrinho, preços nem pagamento. O contato é pelo WhatsApp, por telefone ou na própria pizzaria.

Feito com **React + TypeScript + Vite**, no mesmo formato do site da Poison Donuts (pasta raiz deste repositório).
Visual futurista em vermelho e vermelho claro, com fontes Space Grotesk e JetBrains Mono hospedadas no próprio site.

## Como rodar

```bash
cd tori-pizza
npm install
npm run dev      # http://localhost:5173
npm run build    # gera /dist
```

Na Vercel, crie um projeto apontando para este repositório com **Root Directory = `tori-pizza`**.

## Onde editar

Tudo fica em **`src/config/site.ts`**: telefone, endereço, horários (fechado às terças), sabores do cardápio,
fotos, galeria e avaliações. Inclua apenas avaliações reais.

O cardápio segue o cardápio oficial da pizzaria (17 sabores salgados e 3 doces, nos tamanhos pequena, média e grande).
Os preços estão guardados em `prices`, mas ficam escondidos porque o site é uma vitrine: para mostrar, mude
`showPrices` para `true`. O texto "Como é feita" de cada sabor é de apresentação; revise com a pizzaria.
A descrição da Siciliana (camarão) estava parcialmente coberta na foto do cardápio: confirme os ingredientes.

Fotos ficam em `public/images/`.

## Animações

- **Abertura (`src/components/PizzaIntro.tsx`):** conforme a pessoa rola, uma pizza de calabresa é montada etapa por etapa:
  massa, molho, queijo, recheio, forno, orégano, corte e a fatia saindo com o queijo esticando. Ao redor ficam um painel (HUD) com a etapa,
  a temperatura do forno e o progresso, além das frases de cada etapa. A rolagem é suavizada (sem travar), a pizza inclina seguindo o mouse
  ou o dedo, o vapor desvia do cursor e um toque na pizza solta farinha ou vapor.
- **Pizza de verdade (`src/components/Showcase.tsx`):** foto real recortada que gira com a rolagem, com uma linha de "scanner" e etiquetas dos ingredientes.
- **Cards:** inclinam e brilham seguindo o mouse e aparecem com desfoque ao entrar na tela.

Quem ativou "reduzir movimento" no aparelho vê a pizza pronta, sem animação.

### Texturas da pizza

As texturas (massa crua e assada, molho, queijo, calabresa, cebola, azeitona, orégano e a mesa de madeira) são geradas por código,
com ruído e iluminação, em `public/intro/`. Para gerar de novo (precisa de Python com numpy e Pillow):

```bash
python3 tools/render_textures.py
```

O motor que combina as camadas fica em `src/lib/pizzaRenderer.ts`; as etapas e os tempos estão em `stages`.
