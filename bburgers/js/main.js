/* =====================================================================
   THE BBURGERS – lógica do site
   Dados (textos, preços, imagens) ficam em js/data.js.
   Seções deste arquivo:
   1. Utilitários   2. Conteúdo dinâmico   3. Capa (animação com scroll)
   4. Interações gerais   5. Fundo de partículas
   ===================================================================== */
(function () {
  'use strict';

  const S = window.SITE, IMG = window.IMAGENS;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const animate = hasGsap && !reduceMotion;
  if (!animate) document.documentElement.classList.add('reduce');

  /* ---------- 1. UTILITÁRIOS ---------- */
  const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const waLink = msg => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  const WA_DEFAULT = 'Olá! Vim pelo site e quero fazer um pedido.';

  /** Troca o placeholder por uma imagem real quando houver caminho em IMAGENS. */
  function applyImage(ph, src, alt) {
    if (!src) return;
    const img = new Image();
    img.src = src; img.alt = alt || ''; img.loading = 'lazy'; img.decoding = 'async';
    ph.appendChild(img); ph.classList.add('has-img');
  }

  /* ---------- 2. CONTEÚDO DINÂMICO ---------- */
  $$('[data-wa]').forEach(a => { a.href = waLink(WA_DEFAULT); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-tel]').forEach(a => { a.href = 'tel:' + S.telefoneTel; });
  $$('.ph[data-img]').forEach(p => applyImage(p, IMG[p.dataset.img], p.dataset.label));
  $('#addr').textContent = S.endereco;
  $('#footAddr').textContent = S.endereco;
  $('#footTel').textContent = S.telefoneTexto;
  $('#footIg').textContent = S.instagramUser; $('#footIg').href = S.instagramUrl;
  $('#footSac').textContent = S.sac; $('#footSac').href = 'mailto:' + S.sac;
  $('#footSite').href = S.franquiaUrl;
  $('#igBtn').href = S.instagramUrl; $('#igBtn').textContent = 'Siga no Instagram ' + S.instagramUser;
  $('#mapBtn').href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('BarraShopping, Av. das Américas, 4666, Barra da Tijuca, Rio de Janeiro');

  // Cardápio com abas
  const tabsEl = $('#tabs'), gridEl = $('#menuGrid'), subEl = $('#tabSub');
  function renderCategory(cat) {
    subEl.textContent = cat.subtitulo || '';
    gridEl.innerHTML = '';
    cat.itens.forEach(it => {
      const card = document.createElement('article');
      card.className = 'glass card';
      card.innerHTML = `
        ${it.selo ? `<span class="badge">${it.selo}</span>` : ''}
        <div class="ph" data-label="FOTO: ${it.nome}"></div>
        <h3></h3><p></p>
        ${it.nota ? '<p class="nota"></p>' : ''}
        <div class="price">${brl(it.preco)}</div>
        <a class="btn btn-yellow" target="_blank" rel="noopener">Pedir no WhatsApp</a>`;
      $('h3', card).textContent = it.nome;
      $('p', card).textContent = it.desc;
      if (it.nota) $('.nota', card).textContent = it.nota;
      $('a', card).href = waLink(`Olá! Vim pelo site e quero pedir: ${it.nome} (${brl(it.preco)}).`);
      applyImage($('.ph', card), IMG.itens[it.id], it.nome);
      gridEl.appendChild(card);
    });
    if (animate) gsap.from($$('.card', gridEl), { opacity: 0, y: 30, scale: .96, duration: .5, stagger: .08, ease: 'power2.out', clearProps: 'all' });
  }
  window.MENU.forEach((cat, i) => {
    const b = document.createElement('button');
    b.className = 'tab' + (i === 0 ? ' active' : '');
    b.textContent = cat.titulo; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === 0);
    b.onclick = () => {
      $$('.tab', tabsEl).forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', false); });
      b.classList.add('active'); b.setAttribute('aria-selected', true);
      renderCategory(cat);
    };
    tabsEl.appendChild(b);
  });
  renderCategory(window.MENU[0]);

  // Mini-cards extras
  $('#extras').innerHTML = window.EXTRAS.map(e =>
    `<div class="glass extra reveal"><div class="ico"><svg><use href="#i-${e.icone}"/></svg></div><h3>${e.titulo}</h3><p>${e.texto}</p></div>`).join('');

  // Galeria
  const labels = ['burger', 'batata', 'combo', 'doguinho', 'burger', 'batata', 'cheddar', 'loja'];
  $('#gallery').innerHTML = labels.map((l, i) => `<div class="ph reveal" data-label="FOTO: ${l}"></div>`).join('');
  $$('#gallery .ph').forEach((p, i) => applyImage(p, IMG.galeria[i], 'Foto ' + (i + 1)));

  // Horários + "aberto agora"
  const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const fmtH = h => h + 'h';
  const nowSP = () => {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday'));
    return { dow, h: (+g('hour') % 24) + (+g('minute')) / 60 };
  };
  function renderHours() {
    const { dow, h } = nowSP();
    const order = [1, 2, 3, 4, 5, 6, 0];
    $('#hoursList').innerHTML = order.map(d =>
      `<li class="${d === dow ? 'today' : ''}"><span>${dias[d]}</span><span>${fmtH(S.horarios[d].abre)} às ${fmtH(S.horarios[d].fecha)}</span></li>`).join('');
    const t = S.horarios[dow], open = h >= t.abre && h < t.fecha;
    const st = $('#status');
    st.textContent = open ? 'ABERTO AGORA' : 'FECHADO';
    st.className = 'status ' + (open ? 'open' : 'closed');
  }
  renderHours(); setInterval(renderHours, 60000);

  /* ---------- 3. CAPA: HAMBÚRGUER QUE DESMONTA COM O SCROLL ---------- */
  const rig = $('#burgerRig');
  const N = window.CAMADAS.length;
  const LAYER_H = 13;                         // altura de cada camada (% do palco)
  const asmTop = i => 21 + i * 9.6;           // posição montado   (% do palco)
  const expTop = i => 2 + i * 13.6;           // posição explodido (% do palco)
  const toPct = top => top / LAYER_H * 100;   // converte para yPercent

  const layers = window.CAMADAS.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'layer'; el.dataset.layer = c.id; el.style.zIndex = 20 - i;
    el.innerHTML = `<div class="ph" data-label="${c.rotulo}"></div>
      <div class="tag ${i % 2 ? 'l' : 'r'}"><i></i><span>${c.texto}</span></div>`;
    applyImage($('.ph', el), IMG.camadas[c.id], c.rotulo);
    rig.appendChild(el);
    return el;
  });
  if (hasGsap) gsap.set(layers, { yPercent: i => toPct(asmTop(i)) });
  else layers.forEach((el, i) => { el.style.transform = `translateY(${toPct(asmTop(i))}%)`; });

  // Miniaturas (Linha Premium)
  const thumbsEl = $('#thumbs');
  window.THUMBS.forEach((nome, i) => {
    const b = document.createElement('button');
    b.className = 'thumb' + (i === 0 ? ' active' : '');
    b.innerHTML = `<div class="ph" data-label="FOTO: ${nome}"></div>${nome}`;
    b.onclick = () => { $$('.thumb', thumbsEl).forEach(t => t.classList.remove('active')); b.classList.add('active'); };
    thumbsEl.appendChild(b);
  });

  // Opção alternativa: sequência de frames em canvas
  const F = window.FRAMES, canvas = $('#frameCanvas');
  let frames = null, drawFrame = () => {};
  if (F.enabled) {
    rig.style.display = 'none'; canvas.hidden = false;
    const ctx = canvas.getContext('2d');
    frames = Array.from({ length: F.count }, (_, i) => {
      const im = new Image(); im.src = F.path + String(i + 1).padStart(3, '0') + F.ext; return im;
    });
    drawFrame = p => {
      const im = frames[Math.min(F.count - 1, Math.round(p * (F.count - 1)))];
      if (!im.complete) return;
      canvas.width = im.naturalWidth; canvas.height = im.naturalHeight;
      ctx.drawImage(im, 0, 0);
    };
    frames[0].onload = () => drawFrame(0);
  }

  if (animate) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Partículas (gergelim, molho, migalhas, bacon) – menos no celular
    const pBox = $('#particles'), kinds = ['sesame', 'sauce', 'crumb', 'bacon'];
    const pCount = isMobile ? 12 : 30;
    const parts = Array.from({ length: pCount }, (_, i) => {
      const p = document.createElement('span');
      p.className = 'p ' + kinds[i % kinds.length]; pBox.appendChild(p); return p;
    });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero', start: 'top top',
        end: isMobile ? '+=190%' : '+=260%',
        pin: true, scrub: 1, anticipatePin: 1,
        onUpdate: self => { if (F.enabled) drawFrame(self.progress); },
        onLeave: () => gsap.to('#scrollHint', { opacity: 0 })
      }
    });

    // Camadas: sobem/descem separando-se uma a uma, com leve rotação e profundidade
    layers.forEach((el, i) => {
      const mid = (N - 1) / 2, dir = i < mid ? -1 : 1;
      tl.to(el, {
        yPercent: toPct(expTop(i)),
        z: (mid - i) * 40,
        rotationX: -14 + i * 3,
        rotationY: dir * (6 + i * 2.5),
        rotationZ: (i % 2 ? 1 : -1) * (2 + i),
        duration: 1, ease: 'power1.inOut'
      }, i * 0.07);
      // Rótulo de cada etapa
      tl.fromTo($('.tag', el), { opacity: 0, x: (i % 2 ? 1 : -1) * 12 }, { opacity: 1, x: 0, duration: .25 }, .55 + i * .08);
    });
    // Sombra no chão reage à separação
    tl.to('#floorShadow', { scaleX: 1.35, opacity: .5, duration: 1 }, 0);
    tl.to('.halo', { scale: 1.2, duration: 1 }, 0);

    // Partículas voando em volta
    parts.forEach((p, i) => {
      const ang = (i / pCount) * Math.PI * 2 + Math.random(), dist = 120 + Math.random() * 190;
      const t0 = .1 + Math.random() * .55;
      tl.fromTo(p, { x: 0, y: 0, scale: .2, opacity: 0, rotation: 0 }, {
        x: Math.cos(ang) * dist * (isMobile ? .6 : 1.1), y: Math.sin(ang) * dist * .8 + (Math.random() - .3) * 90,
        scale: 1 + Math.random(), opacity: 1, rotation: Math.random() * 540 - 270, duration: .45
      }, t0).to(p, { opacity: 0, y: '+=50', duration: .3 }, t0 + .45);
    });
    tl.to({}, { duration: .25 });   // pequena pausa final com tudo explodido

    // Respiração suave quando parado
    gsap.to(rig, { scale: 1.025, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Inclinação 3D que acompanha o mouse
    if (window.matchMedia('(pointer:fine)').matches) {
      const rx = gsap.quickTo(rig, 'rotationX', { duration: .8, ease: 'power3.out' });
      const ry = gsap.quickTo(rig, 'rotationY', { duration: .8, ease: 'power3.out' });
      window.addEventListener('mousemove', e => {
        ry((e.clientX / innerWidth - .5) * 24);
        rx(-(e.clientY / innerHeight - .5) * 18);
      });
    } else if (window.DeviceOrientationEvent) {
      // No celular, um leve movimento com o giroscópio (quando permitido)
      const ry = gsap.quickTo(rig, 'rotationY', { duration: 1 });
      window.addEventListener('deviceorientation', e => { if (e.gamma != null) ry(Math.max(-15, Math.min(15, e.gamma / 3))); });
    }
  } else {
    // Movimento reduzido (ou sem GSAP): hambúrguer parado e montado
    $$('.tag').forEach(t => t.style.display = 'none');
    $('#scrollHint').style.display = 'none';
    if (F.enabled) drawFrame(0);
  }

  /* ---------- 4. INTERAÇÕES GERAIS ---------- */
  // Menu mobile
  const burger = $('#burger'), links = $('#links');
  const setMenu = open => { links.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.onclick = () => setMenu(!links.classList.contains('open'));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Barra de progresso
  const bar = $('#progress');
  const upd = () => { bar.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`; };
  addEventListener('scroll', upd, { passive: true }); upd();

  // Cursor personalizado
  const cur = $('#cursor');
  if (animate && matchMedia('(pointer:fine)').matches) {
    const mx = gsap.quickTo(cur, 'x', { duration: .15 }), my = gsap.quickTo(cur, 'y', { duration: .15 });
    addEventListener('mousemove', e => { mx(e.clientX); my(e.clientY); });
    document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button')));
  }

  if (animate) {
    // Entrada suave das seções
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%', once: true,
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'power3.out' })
    });
    // Contadores
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count, o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) }) });
    });
    addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    $$('[data-count]').forEach(el => el.textContent = el.dataset.count);
  }

  /* ---------- 5. FUNDO: GRADE SUTIL + PARTÍCULAS ---------- */
  const bg = $('#bg'), ctx = bg.getContext('2d');
  let W, H, dots = [];
  function sizeBg() {
    W = bg.width = innerWidth; H = bg.height = innerHeight;
    dots = Array.from({ length: isMobile ? 25 : 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .4, v: Math.random() * .25 + .05 }));
  }
  function paintBg() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(30,144,255,.06)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 56) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 56) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(80,170,255,.55)';
    dots.forEach(d => { ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill(); });
  }
  function loopBg() {
    dots.forEach(d => { d.y -= d.v; if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; } });
    paintBg(); requestAnimationFrame(loopBg);
  }
  sizeBg(); addEventListener('resize', () => { sizeBg(); if (reduceMotion) paintBg(); });
  reduceMotion ? paintBg() : loopBg();
})();
