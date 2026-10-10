// Gera os ícones do site (favicon, apple-touch, PWA) e a imagem de compartilhamento (og-image.jpg)
// a partir de public/brand/logo.svg e do primeiro frame do hero. Rode: npm run brand
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pub = (p) => path.join(root, 'public', p);
const fonts = (f) => pathToFileURL(path.join(root, 'src/assets/fonts', f)).href;
const logo = fs.readFileSync(pub('brand/logo.svg'), 'utf8');

const fontCss = `
@font-face{font-family:'Anton';src:url('${fonts('anton-latin-400-normal.woff2')}') format('woff2')}
@font-face{font-family:'Inter';font-weight:100 900;src:url('${fonts('inter-latin-wght-normal.woff2')}') format('woff2')}
@font-face{font-family:'Kaushan Script';src:url('${fonts('kaushan-script-latin-400-normal.woff2')}') format('woff2')}`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sandys-brand-'));
let counter = 0;
async function show(page, html) {
  const file = path.join(tmp, `page-${counter++}.html`);
  fs.writeFileSync(file, `<!doctype html><meta charset="utf-8">${html}`);
  await page.goto(pathToFileURL(file).href);
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();

async function icon(file, size, { bg = '#0b0710', pad = 0.12, rounded = 0 } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const inner = Math.round(size * (1 - pad * 2));
  await show(page, `<style>html,body{margin:0;background:transparent}
    .i{width:${size}px;height:${size}px;display:grid;place-items:center;background:${bg};border-radius:${rounded}px}
    .i svg{width:${inner}px;height:${inner}px;filter:drop-shadow(0 0 ${size * 0.03}px rgba(255,46,154,.8))}</style>
    <div class="i">${logo}</div>`);
  await page.screenshot({ path: pub(file), omitBackground: true });
  console.log('✓', file);
}

await icon('favicon-48.png', 48, { bg: 'transparent', pad: 0.02 });
await icon('apple-touch-icon.png', 180, { pad: 0.14 });
await icon('icon-192.png', 192, { pad: 0.14 });
await icon('icon-512.png', 512, { pad: 0.14 });

// ---------- imagem de compartilhamento 1200x630 ----------
await page.setViewportSize({ width: 1200, height: 630 });
const frame = pathToFileURL(pub('frames/d/f0001.webp')).href;
await show(page, `<style>${fontCss}
  *{box-sizing:border-box}
  html,body{margin:0}
  body{width:1200px;height:630px;position:relative;overflow:hidden;background:#0b0710;font-family:Inter,sans-serif;color:#fff}
  .g1{position:absolute;right:-180px;top:-120px;width:820px;height:820px;border-radius:50%;background:radial-gradient(circle,rgba(255,46,154,.55),transparent 62%);filter:blur(30px)}
  .g2{position:absolute;left:-260px;bottom:-320px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(123,47,247,.6),transparent 62%);filter:blur(30px)}
  .ring{position:absolute;right:70px;top:34px;width:560px;height:560px;border-radius:50%;border:2px solid rgba(255,46,154,.55);box-shadow:0 0 40px rgba(255,46,154,.35),inset 0 0 40px rgba(123,47,247,.25)}
  .burger{position:absolute;right:-6px;top:20px;height:600px}
  .brand{position:absolute;left:64px;top:52px;display:flex;align-items:center;gap:16px}
  .brand svg{width:64px;height:64px;filter:drop-shadow(0 0 10px rgba(255,46,154,.8))}
  .brand b{font:400 40px/0.9 Anton;letter-spacing:.05em}.brand small{display:block;font:700 12px Inter;letter-spacing:.46em;color:#ffb3de;margin-top:6px}
  h1{position:absolute;left:64px;top:158px;margin:0;font:400 118px/0.96 Anton;text-transform:uppercase}
  h1 span{display:block}
  h1 .g{background:linear-gradient(95deg,#a55bff,#ff2e9a 62%,#ff5fb1);-webkit-background-clip:text;background-clip:text;color:transparent}
  .tag{position:absolute;left:64px;bottom:50px;font:700 15px Inter;letter-spacing:.24em;text-transform:uppercase;color:#ffb3de;display:flex;align-items:center;gap:14px}
  .tag:before{content:'';width:34px;height:3px;background:linear-gradient(90deg,#7b2ff7,#ff2e9a)}
  .at{position:absolute;right:64px;bottom:44px;font:400 30px 'Kaushan Script';color:#ff2e9a;text-shadow:0 0 18px rgba(255,46,154,.6)}
</style>
<div class="g1"></div><div class="g2"></div><div class="ring"></div>
<img class="burger" src="${frame}" />
<div class="brand">${logo}<div><b>SANDY'S</b><small>BURGER</small></div></div>
<h1><span>Smash.</span><span>Na chapa.</span><span class="g">Do jeito certo.</span></h1>
<div class="tag">Old Fashioned Burger · Ultra Smash</div>
<div class="at">@sandysburger</div>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => document.querySelector('.burger').complete);
await page.screenshot({ path: pub('og-image.jpg'), type: 'jpeg', quality: 88 });
console.log('✓ og-image.jpg');

await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

fs.writeFileSync(
  pub('site.webmanifest'),
  JSON.stringify(
    {
      name: "Sandy's Burger",
      short_name: "Sandy's",
      description: 'Old Fashioned Burger · Ultra Smash. Rio de Janeiro.',
      lang: 'pt-BR',
      start_url: './',
      display: 'standalone',
      background_color: '#0b0710',
      theme_color: '#0b0710',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log('✓ site.webmanifest');
