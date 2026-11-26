import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { rateLimitShared } from '../src/lib/sharedRateLimit.js';
import { getClientIP, _resetRateLimitStore } from '../src/lib/rateLimit.js';

// An atomic in-memory stand-in for the one collection call the limiter makes.
const fakeCollection = () => {
  const rows = new Map();
  return { rows, async findOneAndUpdate({ _id }, update) {
    const r = rows.get(_id) || { _id, count: 0, ...update.$setOnInsert };
    r.count += update.$inc.count; rows.set(_id, r); return { ...r };
  } };
};
const req = (headers) => ({ headers: new Headers(headers) });
const T = 1_700_000_000_000;

test('fixed window: allows exactly `limit`, then blocks, then a new window resets', async () => {
  const collection = fakeCollection();
  const res = [];
  for (let i = 0; i < 6; i++) res.push(await rateLimitShared('k:1.1.1.1', 5, 60_000, { collection, now: T }));
  assert.deepEqual(res.map((r) => r.allowed), [true, true, true, true, true, false]);
  assert.ok(res.every((r) => r.shared));
  assert.equal(res[5].remaining, 0);
  assert.ok(res[5].resetAt > T && res[5].resetAt <= T + 60_000);
  assert.equal((await rateLimitShared('k:1.1.1.1', 5, 60_000, { collection, now: T + 61_000 })).allowed, true);
  assert.equal((await rateLimitShared('k:2.2.2.2', 5, 60_000, { collection, now: T })).allowed, true, 'other keys unaffected');
});

test('store outage falls back to the per-instance limiter (still limits, never throws)', async () => {
  _resetRateLimitStore();
  const collection = { async findOneAndUpdate() { throw new Error('connection refused'); } };
  const out = [];
  for (let i = 0; i < 4; i++) out.push(await rateLimitShared('fallback:x', 3, 60_000, { collection }));
  assert.deepEqual(out.map((r) => r.allowed), [true, true, true, false]);
  assert.ok(out.every((r) => r.shared === false));
});

test('spoofed forwarding headers cannot rotate the bucket off Vercel, and are ignored without a trusted source', async () => {
  const collection = fakeCollection();
  let allowed = 0;
  for (let i = 0; i < 10; i++) {
    const ip = getClientIP(req({ 'x-forwarded-for': `9.9.9.${i}`, 'x-real-ip': `8.8.8.${i}`, 'x-vercel-forwarded-for': `7.7.7.${i}` }), {});
    assert.equal(ip, 'unknown');
    if ((await rateLimitShared(`spoof:${ip}`, 3, 60_000, { collection, now: T })).allowed) allowed++;
  }
  assert.equal(allowed, 3);
});

test('TRUSTED_PROXY=1: a client-prepended left entry cannot change the bucket; missing header -> shared unknown bucket', () => {
  const env = { TRUSTED_PROXY: '1' };
  const a = getClientIP(req({ 'x-forwarded-for': '1.1.1.1, 203.0.113.9' }), env);
  const b = getClientIP(req({ 'x-forwarded-for': '2.2.2.2, 3.3.3.3, 203.0.113.9' }), env);
  assert.equal(a, '203.0.113.9'); assert.equal(b, '203.0.113.9');
  assert.equal(getClientIP(req({}), env), 'unknown');
  assert.equal(getClientIP(req({ 'x-forwarded-for': 'not-an-ip' }), env), 'unknown');
});

const URI = process.env.E2E_MONGODB_URI || '';
const LOCAL_TEST = /^mongodb:\/\/(127\.0\.0\.1|localhost):\d+\/[\w-]*test/.test(URI);
test('REAL MongoDB: 60 concurrent hits from two "instances" admit exactly the limit', { skip: !LOCAL_TEST && 'needs E2E_MONGODB_URI pointing at a local *test* database' }, async () => {
  const conn = await mongoose.createConnection(URI).asPromise();
  const col = conn.db.collection('ratelimits_unit');
  try {
    await col.deleteMany({});
    const hit = () => rateLimitShared('real:5.5.5.5', 20, 60_000, { collection: col, now: T });
    // two independent callers (as two serverless instances would be) racing on the first insert too
    const results = await Promise.all([...Array(30).keys()].map(hit).concat([...Array(30).keys()].map(hit)));
    assert.equal(results.filter((r) => r.allowed).length, 20);
    assert.ok(results.every((r) => r.shared));
    assert.equal((await col.findOne({ _id: `real:5.5.5.5|${Math.floor(T / 60_000) * 60_000}` })).count, 60);
  } finally { await col.drop().catch(() => {}); await conn.close(); }
});

test('a HANGING store degrades to the local limiter within the timeout instead of hanging the request', async () => {
  _resetRateLimitStore();
  const collection = { findOneAndUpdate: () => new Promise(() => {}) };
  const t0 = Date.now();
  const r = await rateLimitShared('hang:x', 3, 60_000, { collection, timeoutMs: 100 });
  assert.equal(r.shared, false); assert.equal(r.allowed, true);
  assert.ok(Date.now() - t0 < 1000);
});
