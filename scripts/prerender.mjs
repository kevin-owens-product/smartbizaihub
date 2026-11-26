// Vite supplies the asset tags. Each URL gets its own crawlable HTML and metadata.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, jsonLd, resourcePages, resourceJsonLd } from '../dist-ssr/entry-server.js';

const dist = new URL('../dist/', import.meta.url);
const origin = 'https://smartbizaihub.com';
const index = new URL('index.html', dist);
const template = await readFile(index, 'utf8');
const root = '<div id="root"></div>';
if (!template.includes(root)) throw new Error('dist/index.html has no empty #root to fill.');

const toScripts = (blocks) => blocks.map(block =>
  '<script type="application/ld+json">' + JSON.stringify(block).replace(/</g, '\\u003c') + '</script>'
).join('\n');
const ld = toScripts(jsonLd);
await writeFile(index, template.replace('</head>', () => ld + '\n</head>')
  .replace(root, () => '<div id="root">' + render() + '</div>'));

function escapeMarkup(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

for (const page of resourcePages) {
  const title = escapeMarkup(page.title + ' | Smart Biz AI Hub');
  const description = escapeMarkup(page.description);
  const url = origin + page.path;
  const html = template
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + title + '</title>')
    .replace(/((?:name|property)="(?:twitter:title|og:title)" content=")[^"]*/g, (_, prefix) => prefix + title)
    .replace(/((?:name|property)="(?:description|twitter:description|og:description)" content=")[^"]*/g, (_, prefix) => prefix + description)
    .replace(/(rel="canonical" href="|property="og:url" content=")[^"]*/g, (_, prefix) => prefix + url)
    .replace('</head>', () => toScripts(resourceJsonLd(page.path)) + '\n</head>')
    .replace(root, () => '<div id="root">' + render(page.path) + '</div>');
  const output = fileURLToPath(new URL(page.path.slice(1) + '.html', dist));
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

const sitemapPath = new URL('sitemap.xml', dist);
const today = (process.env.BUILD_DATE ?? new Date().toISOString()).slice(0, 10);
const sitemap = (await readFile(sitemapPath, 'utf8'))
  .replace('</loc>', '</loc>\n    <lastmod>' + today + '</lastmod>')
  .replace('</urlset>', resourcePages.map(page => '  <url><loc>' + origin + page.path + '</loc></url>').join('\n') + '\n</urlset>');
await writeFile(sitemapPath, sitemap);
await rm(new URL('../dist-ssr', import.meta.url), { recursive: true, force: true });
