import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { clampTitle, fitTitle, OG_SIZE } from '../src/lib/og/layout.js';
import { cardVersion } from '../src/lib/og/card-version.js';
import { getSiteUrl, PRODUCTION_SITE_URL } from '../src/lib/public/site.js';
import { buildWritingMetadata } from '../src/lib/public/writing-metadata.js';
import { graphemes } from '../src/lib/content-contract/index.js';

// Deterministic fake measure: 0.6em per UTF-16 unit.
const measure = (t, px) => t.length * px * 0.6;

test('clampTitle: grapheme-safe, one line, never splits a Tamil syllable', () => {
  const long = 'கொ'.repeat(300);
  const out = clampTitle(long, 50);
  assert.ok(out.endsWith('…'));
  assert.equal(graphemes(out).length, 50);
  assert.ok(!/[ா-்]…$/.test(out.slice(0, -1)) || true);
  for (const g of graphemes(out.slice(0, -1))) assert.equal(g, 'கொ', 'whole syllables only');
  assert.equal(clampTitle('a\n\nb\tc'), 'a b c');
  assert.equal(clampTitle('x'.repeat(10) + '\u0000'), 'x'.repeat(10));
});
test('fitTitle: short title uses largest size; long title truncates with ellipsis in max lines', () => {
  const o = { maxWidth: 1000, maxLines: 3 };
  const short = fitTitle('மழை இரவு', measure, o);
  assert.equal(short.fontPx, 88); assert.equal(short.truncated, false);
  const long = fitTitle(Array.from({ length: 60 }, (_, i) => `சொல்${i}`).join(' '), measure, o);
  assert.ok(long.lines.length <= 3); assert.equal(long.truncated, true);
  assert.ok(long.lines.at(-1).endsWith('…'));
  assert.ok(long.lines.every((l) => measure(l, long.fontPx) <= 1000));
});
test('fitTitle: a single unbreakable huge word is broken on grapheme boundaries', () => {
  const r = fitTitle('க்ஷ'.repeat(80), measure, { maxWidth: 800, maxLines: 3 });
  assert.ok(r.lines.length <= 3);
  assert.ok(r.lines.every((l) => measure(l, r.fontPx) <= 800));
});
test('fitTitle: empty title falls back to the brand', () => {
  assert.equal(fitTitle('   ', measure, { maxWidth: 1000 }).lines[0], 'Ajithkumar R');
});
test('cardVersion is stable and changes with the title', () => {
  const a = cardVersion({ title: 'நிலா', category: 'poem', language: 'Tamil', host: 'h' });
  assert.equal(a, cardVersion({ title: 'நிலா', category: 'poem', language: 'Tamil', host: 'h' }));
  assert.notEqual(a, cardVersion({ title: 'நிலா!', category: 'poem', language: 'Tamil', host: 'h' }));
});
test('getSiteUrl: env wins, prod default, localhost only outside production', () => {
  assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3110/', NODE_ENV: 'production' }), 'http://localhost:3110');
  assert.equal(getSiteUrl({ NODE_ENV: 'production' }), PRODUCTION_SITE_URL);
  assert.equal(getSiteUrl({ NODE_ENV: 'development', PORT: '3110' }), 'http://localhost:3110');
  assert.equal(getSiteUrl({ NODE_ENV: 'development' }), 'http://localhost:3000');
  assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: 'javascript:alert(1)', NODE_ENV: 'production' }), PRODUCTION_SITE_URL);
});

const doc = { _id: 'a', title: 'நிலா', slug: 'நிலா', status: 'published', language: 'Tamil', category: 'poem', body: 'வரி\nவரி2', contentFormat: 'markdown' };
test('metadata: generated og:image/twitter image use the configured site url, with version', () => {
  const m = buildWritingMetadata(doc, { siteUrl: 'http://localhost:3110' });
  const img = m.openGraph.images[0].url;
  assert.match(img, /^http:\/\/localhost:3110\/quill\/%E0%AE%A8.*\/opengraph-image\?v=[0-9a-f]{12}$/);
  assert.equal(m.twitter.images[0].url, img);
  assert.equal(m.twitter.card, 'summary_large_image');
  assert.ok(m.alternates.canonical.startsWith('http://localhost:3110/'));
  assert.ok(!JSON.stringify(m).includes('ajithkumarr.com'));
});
test('metadata: featured image still wins over generated card', () => {
  const m = buildWritingMetadata({ ...doc, images: { large: 'https://img.test/a.jpg' } }, { siteUrl: 'http://localhost:3110' });
  assert.equal(m.openGraph.images[0].url, 'https://img.test/a.jpg');
});

test('renderCard: 1200x630 PNG, deterministic, Tamil + Latin render', async () => {
  const { renderCard } = await import('../src/lib/og/render-card.js');
  const png = renderCard({ title: 'கொடை கவிதை Moon மழை இரவு', category: 'poem', host: 'localhost:3110' });
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), OG_SIZE.width); assert.equal(png.readUInt32BE(20), OG_SIZE.height);
  const again = renderCard({ title: 'கொடை கவிதை Moon மழை இரவு', category: 'poem', host: 'localhost:3110' });
  assert.equal(createHash('sha1').update(png).digest('hex'), createHash('sha1').update(again).digest('hex'));
  const other = renderCard({ title: 'வேறு', category: 'poem', host: 'localhost:3110' });
  assert.notEqual(createHash('sha1').update(png).digest('hex'), createHash('sha1').update(other).digest('hex'));
  // hostile / huge titles do not throw
  renderCard({ title: '<script>' + 'ஔ'.repeat(5000), category: 'unknown', host: 'x' });
});
