import test from 'node:test';
import assert from 'node:assert/strict';
import { secretMatches, revalidationTargets } from '../src/lib/public/revalidate.js';

const SECRET = 'x'.repeat(20);
test('secret: rejects unset/short/wrong, accepts exact', () => {
  assert.equal(secretMatches('x', undefined), false);
  assert.equal(secretMatches('short', 'short'), false);
  assert.equal(secretMatches('', SECRET), false);
  assert.equal(secretMatches('z'.repeat(24), SECRET), false);
  assert.equal(secretMatches(SECRET, SECRET), true);
});
test('targets: slug + previous slugs, list and sitemap, Tamil in both forms', () => {
  const r = revalidationTargets({ slug: 'நிலா', previousSlugs: ['பழைய'] });
  for (const p of ['/quill', '/sitemap.xml', '/quill/நிலா', '/quill/' + encodeURIComponent('நிலா'), '/quill/பழைய'])
    assert.ok(r.paths.includes(p), p);
});
test('targets: invalid bodies rejected', () => {
  assert.ok(revalidationTargets(null).error);
  assert.ok(revalidationTargets({}).error);
  assert.ok(revalidationTargets({ slug: 'a/b' }).error);
  assert.ok(revalidationTargets({ slug: 'a', previousSlugs: 'x' }).error);
});
