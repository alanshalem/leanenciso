/**
 * Prepara un reel para el sitio.
 *
 *   npm run reel -- <video.mp4> <slug> "<título>" "<formato>"
 *
 * - Recomprime a 720x1280, H.264 + AAC: un original de 30-60 MB queda en ~10 MB.
 * - Saca el poster del segundo 1.
 * - Crea src/content/reels/<slug>.md con la duración real.
 *
 * No pisa nada: si el slug ya existe, corta sin tocar archivos.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const [input, slug, title, formato] = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!input || !slug || !title || !formato) {
  fail('Uso: npm run reel -- <video.mp4> <slug> "<título>" "<formato>"');
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  fail('El slug solo puede tener minúsculas, números y guiones.');
}

const source = resolve(input);
if (!existsSync(source)) fail(`No existe: ${source}`);

const ROOT = process.cwd();
const video = join(ROOT, 'public', 'videos', 'reels', `${slug}.mp4`);
const poster = join(ROOT, 'public', 'posters', 'reels', `${slug}.jpg`);
const md = join(ROOT, 'src', 'content', 'reels', `${slug}.md`);

for (const path of [video, poster, md]) {
  if (existsSync(path)) fail(`Ya existe: ${path}`);
}
for (const path of [video, poster, md]) mkdirSync(dirname(path), { recursive: true });

const run = (bin, args) =>
  execFileSync(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

console.log('Recomprimiendo (puede tardar un par de minutos)...');
run('ffmpeg', [
  '-nostdin', '-hide_banner', '-loglevel', 'error', '-y',
  '-i', source,
  '-map', '0:v:0', '-map', '0:a:0?',
  '-vf', 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30',
  '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-preset', 'slow',
  '-crf', '26', '-maxrate', '2000k', '-bufsize', '4000k', '-g', '60', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
  '-movflags', '+faststart',
  video,
]);

run('ffmpeg', [
  '-nostdin', '-hide_banner', '-loglevel', 'error', '-y',
  '-ss', '1', '-i', video, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '4',
  poster,
]);

const seconds = Math.round(
  Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video])),
);
const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
const order = readdirSync(dirname(md)).filter((name) => name.endsWith('.md')).length + 1;

// JSON.stringify da un string YAML válido aunque el título tenga comillas.
writeFileSync(
  md,
  `---
title: ${JSON.stringify(title)}
formato: ${JSON.stringify(formato)}
video: /videos/reels/${slug}.mp4
poster: /posters/reels/${slug}.jpg
duration: "${duration}"
featured: false
order: ${order}
---
`,
);

console.log(`Listo: ${slug} (${duration}).`);
console.log(`Para que aparezca en el home, poné featured: true en src/content/reels/${slug}.md`);
