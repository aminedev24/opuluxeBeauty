#!/usr/bin/env node
// Builds one shareable page per product at p/<ref>/index.html (+ share.png preview image),
// reading the product list straight from index.html. Re-run after editing PRODUCTS:
//   node tools/build-product-pages.mjs
// Set SITE_URL if the site moves (link previews need absolute URLs).
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = (process.env.SITE_URL || 'https://aminedev24.github.io/opuluxeBeauty/').replace(/\/?$/, '/');

const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
// Product data lives in index.html between "const STORE_NAME=" and "const REVIEWS=".
const from = html.indexOf('const STORE_NAME='), to = html.indexOf('const REVIEWS=');
if (from < 0 || to < from) throw new Error('Could not find the product data in index.html');
const { IMG, CATS, PRODUCTS, STORE_NAME } = new Function(html.slice(from, to) + '\nreturn {IMG,CATS,PRODUCTS,STORE_NAME};')();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = n => new Intl.NumberFormat('fr-FR').format(n).replace(/\s/g, ' ') + ' DA';
const chromium = ['chromium', 'chromium-browser', 'google-chrome'].find(bin => {
  try { execFileSync('which', [bin], { stdio: 'ignore' }); return true; } catch { return false; }
});
if (!chromium) console.warn('! No chromium found: pages are built without share.png preview images.');

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@400;600&display=swap';

function shareCard(p, cat) {
  const off = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
  return `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTS}" rel="stylesheet"><style>
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;display:flex;background:#FBF7F4;font-family:Jost,sans-serif;color:#2B1F1D}
.img{width:630px;height:630px;flex:none}.img img{width:100%;height:100%;display:block}
.txt{flex:1;padding:70px 64px;display:flex;flex-direction:column;justify-content:center;gap:18px;border-left:1px solid #E8D8D1}
.brand{font:600 34px Cormorant Garamond,serif;color:#9A5A50;letter-spacing:.04em}
.cat{font-size:15px;letter-spacing:.24em;text-transform:uppercase;color:#9A5A50;font-weight:600}
h1{font:500 58px/1.02 Cormorant Garamond,serif;margin:0}
.price{font-size:36px;font-weight:600}.was{font-size:22px;color:#735F5B;text-decoration:line-through;margin-left:12px;font-weight:400}
.off{display:inline-block;background:#9A5A50;color:#fff;font-size:16px;font-weight:600;padding:5px 12px;border-radius:99px;margin-left:12px;vertical-align:middle}
.cta{margin-top:10px;align-self:flex-start;background:#9A5A50;color:#fff;font-size:18px;font-weight:600;padding:14px 26px;border-radius:99px}
</style></head><body><div class="img"><img src="${p.img}"></div><div class="txt">
<div class="brand">${esc(STORE_NAME)}</div><div class="cat">${esc(cat.fr)}</div><h1>${esc(p.fr[0])}</h1>
<div class="price">${money(p.price)}${p.was ? `<span class="was">${money(p.was)}</span><span class="off">−${off}%</span>` : ''}</div>
<div class="cta">Commander sur WhatsApp</div></div></body></html>`;
}

function page(p, cat, slug, hasImage) {
  const url = `${SITE_URL}p/${slug}/`;
  const target = `../../#p/${slug}`;
  const title = `${p.fr[0]} — ${STORE_NAME}`;
  const desc = `${p.fr[1]} ${money(p.price)} · ${p.ar[0]}`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="${esc(STORE_NAME)}">
<meta property="og:title" content="${esc(`${p.fr[0]} · ${money(p.price)}`)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="fr_FR">
<meta property="og:locale:alternate" content="ar_DZ">
${hasImage ? `<meta property="og:image" content="${url}share.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.fr[0])}">
<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<meta property="product:price:amount" content="${p.price}">
<meta property="product:price:currency" content="DZD">
<meta name="theme-color" content="#9a5a50">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)})</script>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FBF7F4;color:#2B1F1D;font-family:system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box}img{width:100%;max-width:520px;border-radius:14px}h1{font-family:Georgia,serif;font-weight:500}a{display:inline-block;background:#9A5A50;color:#fff;padding:12px 22px;border-radius:99px;text-decoration:none;font-weight:600}</style>
</head>
<body><main>${hasImage ? `<img src="share.png" alt="${esc(p.fr[0])}">` : ''}<h1>${esc(p.fr[0])}</h1><p>${esc(cat.fr)} · ${money(p.price)}</p><a href="${target}">Voir le produit</a></main></body>
</html>
`;
}

rmSync(join(ROOT, 'p'), { recursive: true, force: true });
for (const p of PRODUCTS) {
  const slug = p.ref.toLowerCase();
  const cat = CATS.find(c => c.key === p.cat);
  const dir = join(ROOT, 'p', slug);
  mkdirSync(dir, { recursive: true });
  let hasImage = false;
  if (chromium) {
    const card = join(tmpdir(), `opb-card-${slug}.html`);
    writeFileSync(card, shareCard(p, cat));
    try {
      execFileSync(chromium, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
        '--window-size=1200,630', '--virtual-time-budget=5000', `--screenshot=${join(dir, 'share.png')}`,
        pathToFileURL(card).href], { stdio: 'ignore' });
      hasImage = existsSync(join(dir, 'share.png'));
    } catch (e) { console.warn(`! share.png failed for ${slug}: ${e.message}`); }
    rmSync(card, { force: true });
  }
  writeFileSync(join(dir, 'index.html'), page(p, cat, slug, hasImage));
  console.log(`p/${slug}/  ${p.fr[0]}${hasImage ? '' : ' (no image)'}`);
}
