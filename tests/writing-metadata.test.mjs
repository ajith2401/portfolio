import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWritingMetadata, buildWritingJsonLdScripts } from '../src/lib/public/writing-metadata.js';

const doc = {
  _id: 'a1', title: 'நிலா', slug: 'நிலா', status: 'published', language: 'Tamil', category: 'poem',
  excerpt: 'ஒரு கவிதை', publishedAt: '2025-01-02T00:00:00Z', updatedAt: '2025-02-03T00:00:00Z',
  contentFormat: 'markdown', body: 'வரி ஒன்று\nவரி இரண்டு',
};

test('metadata: bare title, canonical in alternates, ta locale, encoded slug', () => {
  const m = buildWritingMetadata(doc);
  assert.equal(m.title, 'நிலா');
  assert.ok(!/Ajithkumar/.test(m.title));
  assert.equal(m.alternates.canonical, 'https://www.ajithkumarr.com/quill/' + encodeURIComponent('நிலா'));
  assert.equal(m.openGraph.locale, 'ta_IN');
  assert.equal(m.robots.index, true);
  assert.equal(m.openGraph.publishedTime, '2025-01-02T00:00:00.000Z');
});
test('metadata: objectId access and drafts are noindex', () => {
  assert.equal(buildWritingMetadata(doc, { objectIdAccess: true }).robots.index, false);
  assert.equal(buildWritingMetadata({ ...doc, status: 'draft' }).robots.index, false);
});
test('short poem is indexable (no 50-word rule)', () => {
  assert.equal(buildWritingMetadata({ ...doc, body: 'ஒன்று\nஇரண்டு' }).robots.index, true);
});
test('json-ld: valid JSON, no < in output, no fake rating, hostile title escaped', () => {
  const [a, b] = buildWritingJsonLdScripts({ ...doc, title: '</script><script>alert(1)</script>' });
  for (const s of [a, b]) { assert.ok(!s.includes('<')); JSON.parse(s); }
  assert.equal(JSON.parse(a)['@type'], 'CreativeWork');
  assert.ok(!/aggregateRating/.test(a));
  assert.equal(JSON.parse(b)['@type'], 'BreadcrumbList');
});
