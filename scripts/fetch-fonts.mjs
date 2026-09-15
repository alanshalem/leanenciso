/**
 * Descarga las variables .woff2 de Fontshare a public/fonts/.
 * Fontshare ITF-FFL: libre para uso personal y comercial.
 *
 *   node scripts/fetch-fonts.mjs
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'fonts');

/** family = slug de Fontshare, out = nombre de archivo destino */
const FAMILIES = [
  { family: 'clash-display', out: 'ClashDisplay-Variable.woff2' },
  { family: 'satoshi', out: 'Satoshi-Variable.woff2' },
];

const UA = 'Mozilla/5.0 (compatible; portfolio-build)';

/** Devuelve la primera url .woff2 de estilo normal del CSS de Fontshare. */
function pickWoff2(css) {
  const blocks = css.split('@font-face').slice(1);
  for (const block of blocks) {
    if (/font-style:\s*italic/i.test(block)) continue;
    const match = block.match(/url\(['"]?(\/\/[^'")]+\.woff2)['"]?\)/i);
    if (match) return 'https:' + match[1];
  }
  return null;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

await mkdir(OUT, { recursive: true });

for (const { family, out } of FAMILIES) {
  const dest = join(OUT, out);
  if (await exists(dest)) {
    console.log(`  ok   ${out} (ya existe)`);
    continue;
  }

  // `@1` pide la variable font (un solo archivo, todos los pesos).
  const api = `https://api.fontshare.com/v2/css?f[]=${family}@1&display=swap`;
  const css = await fetch(api, { headers: { 'User-Agent': UA } }).then((r) => r.text());

  const url = pickWoff2(css);
  if (!url) throw new Error(`No se encontro woff2 variable para ${family}`);

  const buf = Buffer.from(await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => r.arrayBuffer()));
  await writeFile(dest, buf);
  console.log(`  get  ${out}  ${(buf.length / 1024).toFixed(0)} KB`);
}

console.log('Fuentes listas en public/fonts/');
