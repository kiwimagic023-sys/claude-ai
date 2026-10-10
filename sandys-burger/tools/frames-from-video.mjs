// Converte um vídeo do hambúrguer numa sequência de frames WebP (desktop e celular) para o hero.
//
// Uso:
//   node tools/frames-from-video.mjs meu-video.mp4
//   node tools/frames-from-video.mjs meu-video.mp4 --key black      # remove fundo preto (vira transparente)
//   node tools/frames-from-video.mjs meu-video.mp4 --desktop 180 --mobile 100 --out /tmp/teste
//
// Opções:
//   --desktop N   frames de desktop (padrão 160, 800x960)
//   --mobile N    frames de celular (padrão 90, 560x672)
//   --key black   transforma o preto do vídeo em transparência (use se o fundo for preto puro)
//   --fit cover   preenche o quadro cortando as bordas (padrão: contain, com margem transparente)
//   --q N         qualidade WebP de 0 a 100 (padrão 78)
//   --out DIR     pasta de saída (padrão: public/frames)
//
// Depois ajuste `frames` em src/config.ts (count/width/height). Se mantiver o fundo preto sem --key,
// use `blend: 'screen'` para o preto sumir sobre o fundo do site.
// Requer ffmpeg (com libwebp) e ffprobe no PATH.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--') && !/^\d+$/.test(a) && !['black'].includes(a) && fs.existsSync(a));
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};

if (!input) {
  console.error('Uso: node tools/frames-from-video.mjs <video> [--desktop 160] [--mobile 90] [--key black] [--fit cover] [--out pasta]');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(opt('out', path.join(root, 'public/frames')));
const quality = opt('q', '78');
const key = opt('key', 'none');
const fit = opt('fit', 'contain');

const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', input], { encoding: 'utf8' });
const duration = parseFloat(probe.stdout);
if (!duration) {
  console.error('Não consegui ler a duração do vídeo (ffprobe instalado?).');
  process.exit(1);
}

function extract(dir, count, w, h) {
  const target = path.join(out, dir);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  const scale =
    fit === 'cover'
      ? `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`
      : `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:color=black@0`;
  const keying = key === 'black' ? ',format=rgba,colorkey=0x000000:0.14:0.12,format=yuva420p' : ',format=yuv420p';
  const vf = `fps=${count / duration},${scale}${keying}`;
  const run = spawnSync(
    'ffmpeg',
    ['-y', '-v', 'error', '-i', input, '-vf', vf, '-frames:v', String(count), '-c:v', 'libwebp', '-quality', quality, '-compression_level', '6', '-start_number', '1', path.join(target, 'f%04d.webp')],
    { stdio: 'inherit' },
  );
  if (run.status !== 0) process.exit(run.status ?? 1);
  const files = fs.readdirSync(target).filter((f) => f.endsWith('.webp'));
  const bytes = files.reduce((n, f) => n + fs.statSync(path.join(target, f)).size, 0);
  console.log(`✓ ${dir}: ${files.length} frames, ${(bytes / 1048576).toFixed(2)} MB`);
  return files.length;
}

const d = extract('d', Number(opt('desktop', '160')), 800, 960);
const m = extract('m', Number(opt('mobile', '90')), 560, 672);
console.log(`\nAjuste em src/config.ts: desktop.count = ${d}, mobile.count = ${m}${key === 'black' ? '' : " (e blend: 'screen' se o fundo for preto)"}.`);
