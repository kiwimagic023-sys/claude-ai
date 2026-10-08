# Toripizza — site oficial

Site vitrine da **Toripizza**, pizzaria em Toritama - PE (R. Limoeiro, 12, Lot. Deus é Fiel).
Mostra o cardápio, como pedir (delivery, retirada e no local), fotos, avaliações e localização.
Não é loja virtual: os pedidos são feitos pelo WhatsApp ou por telefone.

Feito com **React + TypeScript + Vite**, no mesmo formato do site da Poison Donuts (pasta raiz deste repositório).

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
fotos, galeria e avaliações. Os sabores foram identificados pelas fotos do Instagram: confirme nomes e ingredientes
com a pizzaria. Inclua apenas avaliações reais.

Fotos ficam em `public/images/`.

## Próximo passo

Animação de abertura que reage à rolagem, inserida antes da capa (`src/components/Hero.tsx`).
