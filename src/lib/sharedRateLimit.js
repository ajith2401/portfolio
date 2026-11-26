// src/lib/sharedRateLimit.js
// Rate limiting that is shared across serverless instances and regions: one atomic MongoDB upsert per check
// on the database the app already uses (no new paid service). Fixed window; a TTL index removes old counters.
//
// Failure policy: if MongoDB is unreachable the check falls back to the per-instance in-memory limiter
// (see rateLimit.js) instead of failing open without any limit or blocking all visitors.
// Keep this in addition to, not instead of, a Vercel WAF rate-limit rule for the same paths.
import mongoose from 'mongoose';
import { rateLimit } from './rateLimit.js';

const COLLECTION = 'ratelimits';
let indexReady = null;

function withTimeout(promise, ms) {
  let t;
  const limit = new Promise((_, rej) => { t = setTimeout(() => rej(new Error('rate-limit store timeout')), ms); });
  return Promise.race([promise, limit]).finally(() => clearTimeout(t));
}

async function defaultCollection() {
  const { default: connectDB } = await import('./db.js'); // lazy: db.js throws at import without MONGODB_URI
  await connectDB();
  const col = mongoose.connection.db.collection(COLLECTION);
  indexReady ??= col.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }).catch(() => { indexReady = null; });
  await indexReady;
  return col;
}

/**
 * @returns {Promise<{ allowed: boolean, remaining: number, resetAt: number, shared: boolean }>}
 */
export async function rateLimitShared(key, limit = 5, windowMs = 60_000, { collection, now = Date.now(), timeoutMs = 1500 } = {}) {
  try {
    // Bound the whole shared path: an unreachable store must degrade to the local limiter quickly, not hang the request.
    const col = collection || (await withTimeout(defaultCollection(), timeoutMs));
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const resetAt = windowStart + windowMs;
    const _id = `${key}|${windowStart}`;
    const update = { $inc: { count: 1 }, $setOnInsert: { expireAt: new Date(resetAt + 60_000) } };
    let doc;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        doc = await withTimeout(col.findOneAndUpdate({ _id }, update, { upsert: true, returnDocument: 'after' }), timeoutMs);
        break;
      } catch (e) {
        if (e?.code !== 11000 || attempt === 1) throw e; // two first-hits raced the upsert: retry once
      }
    }
    const count = (doc && 'value' in doc ? doc.value : doc)?.count;
    if (!Number.isInteger(count)) throw new Error('rate-limit counter unreadable');
    return { allowed: count <= limit, remaining: Math.max(0, limit - count), resetAt, shared: true };
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') console.error('[rate-limit] shared store unavailable, using per-instance limiter:', error?.code || error?.message);
    return { ...rateLimit(key, limit, windowMs), shared: false };
  }
}
