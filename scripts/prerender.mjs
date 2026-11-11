// Writes the server-rendered page and its JSON-LD into dist/index.html, and
// stamps sitemap.xml with today's build date. Runs after both vite builds.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { render, jsonLd } from '../dist-ssr/entry-server.js';

const indexPath = new URL('../dist/index.html', import.meta.url);
let html = await readFile(indexPath, 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root to fill.');

const ld = jsonLd
  .map((block) => `    <script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`)
  .join('\n');
html = html
  .replace('</head>', `${ld}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
await writeFile(indexPath, html);

const today = (process.env.BUILD_DATE ?? new Date().toISOString()).slice(0, 10);
const sitemapPath = new URL('../dist/sitemap.xml', import.meta.url);
const sitemap = (await readFile(sitemapPath, 'utf8')).replace(
  /<loc>https:\/\/smartbizaihub\.com\/<\/loc>(\s*<lastmod>[^<]*<\/lastmod>)?/,
  `<loc>https://smartbizaihub.com/</loc>\n    <lastmod>${today}</lastmod>`,
);
await writeFile(sitemapPath, sitemap);
await rm(new URL('../dist-ssr', import.meta.url), { recursive: true, force: true });
console.log('Prerendered dist/index.html with', jsonLd.length, 'JSON-LD blocks; sitemap lastmod', today);
