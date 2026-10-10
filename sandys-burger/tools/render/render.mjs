// Renderiza os frames do hero e as imagens do cardápio/galeria em um Chromium sem tela (WebGL via SwiftShader).
//
// Uso (a partir de sandys-burger/):
//   node tools/render/render.mjs preview --out /tmp/previews --size 600x720 --t 0,0.25,0.5,0.75,1
//   node tools/render/render.mjs hero --set d      # frames de desktop  -> public/frames/d
//   node tools/render/render.mjs hero --set m      # frames de celular  -> public/frames/m
//   node tools/render/render.mjs menu              # 8 burgers do cardápio -> public/img/menu
//   node tools/render/render.mjs gallery           # fotos da galeria     -> public/img/gallery
//
// Requer: npm install (three + playwright) e um Chromium (PLAYWRIGHT_BROWSERS_PATH ou CHROMIUM_PATH).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { MENU_SHOTS, GALLERY_SHOTS } from './shots.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../..');
const three = path.join(projectRoot, 'node_modules/three');

const args = process.argv.slice(2);
const cmd = args[0] ?? 'preview';
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};

const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json' };

function serve() {
  return new Promise((resolve) => {
    const server = http
      .createServer((req, res) => {
        const u = decodeURIComponent(req.url.split('?')[0]);
        const file = u.startsWith('/three/') ? path.join(three, u.slice(7)) : path.join(here, u === '/' ? 'index.html' : u);
        fs.readFile(file, (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end('not found');
            return;
          }
          res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
          res.end(data);
        });
      })
      .listen(0, () => resolve(server));
  });
}

async function open({ width, height, ss }) {
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'],
  });
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && console.log(`[page:${m.type()}]`, m.text()));
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${port}/`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 60000 });
  const t0 = Date.now();
  await page.evaluate(({ width, height, ss }) => {
    window.studio = new window.Studio({ width, height, ss });
  }, { width, height, ss });
  console.log(`estúdio pronto em ${((Date.now() - t0) / 1000).toFixed(1)}s (${width}x${height} @${ss}x)`);
  return { page, close: async () => { await browser.close(); server.close(); } };
}

const save = (file, b64) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(b64, 'base64'));
};

const pad = (n) => String(n).padStart(4, '0');

async function main() {
  const [w, h] = opt('size', '900x1080').split('x').map(Number);
  const ss = Number(opt('ss', '1.5'));
  const bloom = Number(opt('bloom', '0'));

  if (cmd === 'preview') {
    const out = opt('out', path.join(projectRoot, '.render-previews'));
    const ts = opt('t', '0,0.25,0.5,0.75,1').split(',').map(Number);
    const { page, close } = await open({ width: w, height: h, ss });
    await page.evaluate(() => window.studio.setHero());
    for (const t of ts) {
      const t0 = Date.now();
      const b64 = await page.evaluate(async ({ t, bloom }) => {
        window.studio.poseHero(t);
        window.studio.render();
        return window.studio.encode({ type: 'image/png', bloom });
      }, { t, bloom });
      save(path.join(out, `hero-${String(Math.round(t * 100)).padStart(3, '0')}.png`), b64);
      console.log(`t=${t} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
    await close();
  } else if (cmd === 'hero') {
    const set = opt('set', 'd');
    const count = Number(opt('count', set === 'd' ? '160' : '90'));
    const dims = args.includes('--size') ? opt('size', '900x1080').split('x').map(Number) : set === 'd' ? [800, 960] : [560, 672];
    const out = opt('out', path.join(projectRoot, 'public/frames', set));
    const from = Number(opt('from', '0'));
    const to = Number(opt('to', String(count - 1)));
    const q = Number(opt('q', set === 'd' ? '0.78' : '0.74'));
    fs.mkdirSync(out, { recursive: true });
    const { page, close } = await open({ width: dims[0], height: dims[1], ss: Number(opt('ss', set === 'd' ? '1.6' : '1.8')) });
    await page.evaluate(() => window.studio.setHero());
    let bytes = 0;
    const t0 = Date.now();
    for (let i = from; i <= to; i++) {
      const t = i / (count - 1);
      const b64 = await page.evaluate(async ({ t, q, bloom }) => {
        window.studio.poseHero(t);
        window.studio.render();
        return window.studio.encode({ quality: q, bloom });
      }, { t, q, bloom });
      save(path.join(out, `f${pad(i + 1)}.webp`), b64);
      bytes += Buffer.byteLength(b64, 'base64');
      if (i % 10 === 0 || i === to) {
        const done = i - from + 1;
        const eta = ((Date.now() - t0) / done) * (to - i) / 1000;
        console.log(`frame ${i + 1}/${count}  ${(bytes / 1024 / done).toFixed(0)}KB/frame  ETA ${eta.toFixed(0)}s`);
      }
    }
    console.log(`total ${(bytes / 1048576).toFixed(2)}MB`);
    await close();
  } else if (cmd === 'menu' || cmd === 'gallery') {
    const shots = cmd === 'menu' ? MENU_SHOTS : GALLERY_SHOTS;
    const only = opt('only', null);
    const out = path.join(projectRoot, 'public/img', cmd);
    for (const shot of shots) {
      if (only && !only.split(',').includes(shot.id)) continue;
      const size = shot.size ?? [720, 720];
      const session = await open({ width: size[0], height: size[1], ss: Number(opt('ss', '2')) });
      const t0 = Date.now();
      const b64 = await session.page.evaluate(async ({ shot, bloom }) => {
        const s = window.studio;
        s.setScene(shot);
        s.render();
        return s.encode({ quality: shot.quality ?? 0.82, bloom: shot.bloom ?? bloom });
      }, { shot, bloom });
      save(path.join(out, `${shot.id}.webp`), b64);
      console.log(`${shot.id}.webp  ${(Buffer.byteLength(b64, 'base64') / 1024).toFixed(0)}KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      await session.close();
    }
  } else {
    console.error(`comando desconhecido: ${cmd}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
