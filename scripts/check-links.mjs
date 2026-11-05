import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(process.env.CHECK_DIST || 'dist');
const base = `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}`.replace(/\/$/, '');
const origin = process.env.SITE_URL || 'https://local.invalid';
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(resolve(dir, e.name)) : resolve(dir, e.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(f => f.endsWith('.html'));
const pages = new Map(await Promise.all(htmlFiles.map(async f => [f, await readFile(f, 'utf8')])));
const decode = s => s.replace(/&amp;/g, '&').replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, h, d) => String.fromCodePoint(parseInt(h || d, h ? 16 : 10)));
const errors = [];
let checked = 0;
for (const [file, html] of pages) {
  const path = relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
  const pageUrl = new URL(`${base}/${path}`, origin);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${path}: duplicate HTML/SVG id`);
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${path}: expected one h1`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${path}: missing description`);
  const refs = [...html.matchAll(/\b(?:href|src|poster|data-video)="([^"]+)"/g)].map(m => m[1]);
  for (const m of html.matchAll(/\bsrcset="([^"]+)"/g)) refs.push(...m[1].split(',').map(v => v.trim().split(/\s+/)[0]));
  for (const raw of refs) {
    if (/^(mailto:|tel:|data:)/.test(raw)) continue;
    const url = new URL(decode(raw), pageUrl);
    if (url.origin !== pageUrl.origin) continue;
    if (base && url.pathname !== base && !url.pathname.startsWith(`${base}/`)) {
      errors.push(`${path}: link escapes base: ${raw}`); continue;
    }
    let target = resolve(root, '.' + decodeURIComponent(url.pathname.slice(base.length)));
    if (target !== root && !target.startsWith(root + sep)) { errors.push(`${path}: unsafe path ${raw}`); continue; }
    try {
      if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
      await stat(target);
      checked++;
      if (url.hash && target.endsWith('.html')) {
        const body = pages.get(target) || await readFile(target, 'utf8');
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (![...body.matchAll(/\bid="([^"]+)"/g)].some(m => m[1] === fragment)) errors.push(`${path}: missing fragment ${raw}`);
      }
    } catch { errors.push(`${path}: missing ${raw}`); }
  }
}
const js = files.filter(f => f.endsWith('.js'));
const gzipBytes = (await Promise.all(js.map(async f => gzipSync(await readFile(f)).length))).reduce((a,b) => a+b, 0);
const inlineMax = Math.max(...[...pages.values()].map(html => gzipSync([...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n')).length));
console.log(`${htmlFiles.length} pages; ${checked} local references checked; conservative JS gzip estimate (all external + largest inline page): ${gzipBytes + inlineMax} bytes.`);
if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exitCode = 1; }
else console.log(`PASS: local pages, assets, fragments, metadata and unique IDs (base ${base || '/'}). External availability is checked separately.`);
