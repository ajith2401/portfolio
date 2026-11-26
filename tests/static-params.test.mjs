import test from 'node:test';
import assert from 'node:assert/strict';
import { isPrerenderSafeSlug, MAX_PRERENDER_SLUG_BYTES } from '../src/lib/static-params.js';

test('short ASCII and short Tamil slugs are prerendered', () => {
  assert.equal(isPrerenderSafeSlug('hello-world'), true);
  assert.equal(isPrerenderSafeSlug('மழை-இரவு'), true);
});
test('the production slug that broke the Vercel build (ENAMETOOLONG) is excluded', () => {
  const slug = 'நாகரிக-அழிவின்-விளிம்பில்-பாலுணர்வு-அழகியல்-மற்றும்-டிஜிட்டல்-சுரண்டல்-ஒரு-விமர்சன-பகுப்பாய்வு';
  assert.ok(Buffer.byteLength(slug) > 255 - '.segments'.length, 'fixture really exceeds the file-name limit');
  assert.equal(isPrerenderSafeSlug(slug), false);
});
test('budget is measured in bytes, not characters', () => {
  assert.equal(isPrerenderSafeSlug('a'.repeat(MAX_PRERENDER_SLUG_BYTES)), true);
  assert.equal(isPrerenderSafeSlug('a'.repeat(MAX_PRERENDER_SLUG_BYTES + 1)), false);
  assert.equal(isPrerenderSafeSlug('ம'.repeat(MAX_PRERENDER_SLUG_BYTES / 3 + 1)), false);
});
test('empty and non-string values are rejected', () => {
  for (const v of ['', null, undefined, 5]) assert.equal(isPrerenderSafeSlug(v), false);
});
