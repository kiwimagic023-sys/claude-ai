# The BBurgers – Barra Shopping

Site estático (HTML + CSS + JS, GSAP/ScrollTrigger via CDN, sem build). Abra `index.html` ou rode `python3 -m http.server -d bburgers`.

- **Tudo editável em `js/data.js`:** telefone, endereço, horários, cardápio e preços, textos das camadas.
- **Trocar imagens:** preencha o caminho em `IMAGENS` (`js/data.js`). Camadas do hambúrguer = PNG sem fundo, mesma largura. Vazio = placeholder azul neon.
- **Clipes de vídeo:** `CLIPES.hero.src` (vídeo que avança com o scroll); `.mp4`/`.webm` em `IMAGENS` tocam em loop.
- **Frames em canvas:** `FRAMES.enabled = true` + imagens em `img/frames/frame_001.jpg…`.
- `prefers-reduced-motion`: hambúrguer parado e montado.
