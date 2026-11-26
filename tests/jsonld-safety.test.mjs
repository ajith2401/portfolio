import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { safeJsonLd } from '../src/lib/content-contract/structured-data.js';

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

describe('safeJsonLd', () => {
  const hostile = { name: `</script><script>alert(1)</script> & <b>x</b> ${LS} ${PS} <!-- -->` };
  const out = safeJsonLd(hostile);
  it('contains no raw HTML delimiters, ampersands or line separators', () => {
    for (const bad of ['<', '>', '&', LS, PS]) assert.equal(out.includes(bad), false, `raw ${JSON.stringify(bad)}`);
    assert.equal(/<\/script/i.test(out), false);
  });
  it('round-trips to the identical value', () => assert.deepEqual(JSON.parse(out), hostile));
});

// Guard: every ld+json script in src must serialise through safeJsonLd, never a bare JSON.stringify.
describe('no unsafe JSON-LD injection points', () => {
  const walk = (d) => readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs)$/.test(p) ? [p] : [];
  });
  for (const file of walk('src')) {
    const src = readFileSync(file, 'utf8');
    if (!src.includes('application/ld+json')) continue;
    it(file, () => {
      assert.equal(/__html:\s*JSON\.stringify\(/.test(src), false, 'bare JSON.stringify in __html');
    });
  }
});

// Regression: an import placed above 'use client' breaks `next build` (lint and unit tests do not notice).
describe('directive placement', () => {
  const walk2 = (d) => readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk2(p) : /\.(jsx?|mjs)$/.test(p) ? [p] : [];
  });
  for (const file of walk2('src')) {
    const src = readFileSync(file, 'utf8');
    const m = src.match(/^['"]use (client|server)['"];?/m);
    if (!m) continue;
    it(file, () => {
      const before = src.slice(0, m.index);
      assert.equal(/^\s*(import|export|const|let|var|function)\b/m.test(before), false, 'directive must precede code');
    });
  }
});
