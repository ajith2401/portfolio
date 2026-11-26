import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCoverSrc } from '../src/lib/cover-src.js';
import fs from 'node:fs';

const OK = 'https://res.cloudinary.com/demo/image/upload/v1/writings/a.jpg';
test('usable covers are returned', () => {
  assert.equal(resolveCoverSrc({ small: OK }), OK);
  assert.equal(resolveCoverSrc({ small: '/placeholder.jpg' }), '/placeholder.jpg');
  assert.equal(resolveCoverSrc({ small: '', medium: OK }), OK, 'falls through empty key');
  assert.equal(resolveCoverSrc({ small: `  ${OK}  ` }), `${OK}`.trim() === OK ? OK : null);
});
test('missing / null / empty / malformed / unsafe sources give null', () => {
  for (const v of [undefined, null, 'str', 5, [], {}, { small: null }, { small: '' }, { small: '   ' }, { small: 5 },
    { small: 'not a url at all' }, { small: 'javascript:alert(1)' }, { small: 'data:image/png;base64,AAAA' },
    { small: 'http://res.cloudinary.com/x.jpg' }, { small: '//evil.com/x.jpg' }, { small: '/\\evil.com/x.jpg' },
    { small: 'https://localhost/x.jpg' }, { small: 'https://' + 'a'.repeat(2100) + '.com/x.jpg' }]) {
    assert.equal(resolveCoverSrc(v), null, JSON.stringify(v)?.slice(0, 60));
  }
});
test('proxy never assumes a Host header (Next internal image fetch sends none)', () => {
  const src = fs.readFileSync(new URL('../src/proxy.js', import.meta.url), 'utf8');
  assert.match(src, /headers\.get\('host'\) \|\| request\.nextUrl\.host \|\| ''/);
  assert.match(src, /needsWwwRedirect = Boolean\(hostname\)/);
});

import { toPublicWritingCard, toPublicWriting } from '../src/lib/content-contract/public-dto.js';
test('public DTOs survive legacy documents whose images is null / non-object / has junk values', () => {
  for (const images of [undefined, null, 'x', 5, [], { small: null, medium: 7, large: '  ', alt: {} }]) {
    for (const fn of [toPublicWritingCard, toPublicWriting]) {
      const out = fn({ _id: 'a'.repeat(24), title: 't', slug: 's', status: 'published', images });
      assert.deepEqual(Object.keys(out.images).sort(), ['alt', 'large', 'medium', 'small', 'thumbnail']);
      for (const v of Object.values(out.images)) assert.equal(v, null);
    }
  }
  const ok = toPublicWritingCard({ _id: 'a'.repeat(24), title: 't', slug: 's', images: { small: '/p.jpg', alt: 'a' } });
  assert.equal(ok.images.small, '/p.jpg'); assert.equal(ok.images.alt, 'a');
});
