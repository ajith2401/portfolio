import test from 'node:test';
import assert from 'node:assert/strict';
import { writingSitemapEntry } from '../src/lib/public/sitemap-entries.js';

const base = { title: 'நிலா', slug: 'நிலா-ஒளி', status: 'published', updatedAt: '2025-03-04T00:00:00Z', publishedAt: '2025-01-01T00:00:00Z' };

test('Tamil slug is percent-encoded and lastmod uses updatedAt', () => {
  const e = writingSitemapEntry(base);
  assert.equal(e.url, 'https://www.ajithkumarr.com/quill/' + encodeURIComponent('நிலா-ஒளி'));
  assert.ok(/^https:\/\/www\.ajithkumarr\.com\/quill\/[A-Za-z0-9%\-_.~]+$/.test(e.url));
  assert.equal(e.lastModified.toISOString(), '2025-03-04T00:00:00.000Z');
});
test('drafts, missing slugs and ObjectId slugs are excluded', () => {
  assert.equal(writingSitemapEntry({ ...base, status: 'draft' }), null);
  assert.equal(writingSitemapEntry({ ...base, slug: '' }), null);
  assert.equal(writingSitemapEntry({ ...base, slug: '507f1f77bcf86cd799439011' }), null);
  assert.equal(writingSitemapEntry({ ...base, title: '  ' }), null);
});
test('short works are included (no word-count rule)', () => {
  assert.ok(writingSitemapEntry({ ...base, wordCount: 6 }));
});
test('lastmod falls back to publishedAt, then undefined', () => {
  assert.equal(writingSitemapEntry({ ...base, updatedAt: null }).lastModified.toISOString(), '2025-01-01T00:00:00.000Z');
  assert.equal(writingSitemapEntry({ ...base, updatedAt: null, publishedAt: null }).lastModified, undefined);
});
