import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { isBookPublic, bookVisibilityClause, withBookVisibility } from '../src/lib/content-contract/book-visibility.js';

const CASES = [
  ['published', { status: 'published' }, true],
  ['absent (legacy)', {}, true],
  ['draft', { status: 'draft' }, false],
  ['archived', { status: 'archived' }, false],
  ['explicit null', { status: null }, false],
  ['unknown string', { status: 'scheduled' }, false],
  ['future status', { status: 'in-review' }, false],
  ['wrong case', { status: 'Published' }, false],
  ['padded', { status: ' published ' }, false],
  ['empty string', { status: '' }, false],
  ['non-string', { status: 1 }, false],
];

describe('isBookPublic', () => {
  for (const [name, doc, expected] of CASES) it(name, () => assert.equal(isBookPublic(doc), expected));
  it('rejects non-objects', () => {
    for (const v of [null, undefined, 'published', 5]) assert.equal(isBookPublic(v), false);
  });
});

describe('query form', () => {
  it('never overwrites the caller\'s $or / $text', () => {
    const q = withBookVisibility({ $or: [{ a: 1 }], $text: { $search: 'x' } });
    assert.deepEqual(q.$and[0], { $or: [{ a: 1 }], $text: { $search: 'x' } });
    assert.deepEqual(q.$and[1], bookVisibilityClause());
  });
});

// The in-memory rule and the MongoDB filter must agree for every status (real database, skipped unless local test DB).
const URI = process.env.E2E_MONGODB_URI;
const live = URI && /^mongodb:\/\/(127\.0\.0\.1|localhost):/.test(URI) && /test/.test(URI);
describe('in-memory rule equals MongoDB filter', { skip: !live && 'set E2E_MONGODB_URI to a local *test* database' }, () => {
  let mongoose, col;
  before(async () => {
    ({ default: mongoose } = await import('mongoose'));
    await mongoose.connect(URI);
    col = mongoose.connection.db.collection('bookvis_test');
    await col.deleteMany({});
    await col.insertMany(CASES.map(([name, doc]) => ({ name, ...doc })));
  });
  after(async () => { await col?.drop().catch(() => {}); await mongoose?.disconnect(); });
  it('same set of public records', async () => {
    const viaQuery = (await col.find(withBookVisibility({})).toArray()).map((d) => d.name).sort();
    const viaCheck = (await col.find({}).toArray()).filter(isBookPublic).map((d) => d.name).sort();
    assert.deepEqual(viaQuery, viaCheck);
    assert.deepEqual(viaQuery, ['absent (legacy)', 'published']);
  });
  it('composes with another $or', async () => {
    const rows = await col.find(withBookVisibility({ $or: [{ name: 'draft' }, { name: 'published' }] })).toArray();
    assert.deepEqual(rows.map((r) => r.name), ['published']);
  });
});

// No public surface may re-implement the rule.
describe('no ad-hoc Book status filters outside the contract', () => {
  const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs)$/.test(p) ? [p] : []; });
  for (const file of walk('src').filter((f) => !f.includes('content-contract') && !f.includes('/models/'))) {
    const src = readFileSync(file, 'utf8');
    if (!/\bBook\b/.test(src)) continue;
    it(file, () => {
      assert.equal(/\$nin:\s*\[\s*['"]draft['"]/.test(src), false, 'use withBookVisibility');
      assert.equal(/Book\.\w+\([^)]*status:\s*['"]published['"]/.test(src), false, 'use withBookVisibility');
    });
  }
});
