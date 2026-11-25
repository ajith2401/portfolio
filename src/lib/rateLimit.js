// src/lib/rateLimit.js
// In-memory fixed-window rate limiter (Node.js runtime).
//
// HONEST LIMITATION: the store lives in one process. On Vercel every serverless
// instance (and every region) has its own Map, and instances are recycled, so the
// effective limit is "per warm instance", not global. It still blunts a naive
// single-connection flood and costs nothing, but it is NOT a security boundary.
// For a real global limit use Vercel WAF rate-limit rules (configured in the
// dashboard, no code) or a shared store such as Upstash Redis (new infra, not added).

const store = new Map();
const MAX_KEYS = 5000;

function prune(now) {
  for (const [k, v] of store) if (now > v.resetAt) store.delete(k);
  // Hard cap so a flood of unique keys cannot grow memory without bound.
  if (store.size > MAX_KEYS) {
    const excess = store.size - MAX_KEYS;
    let i = 0;
    for (const k of store.keys()) { store.delete(k); if (++i >= excess) break; }
  }
}

/**
 * @param {string} key      unique key (e.g. "contact:1.2.3.4")
 * @param {number} limit    max requests in the window
 * @param {number} windowMs window length
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function rateLimit(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  if (store.size >= MAX_KEYS) prune(now);
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/** Test helper. */
export function _resetRateLimitStore() { store.clear(); }

const IPV4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6 = /^[0-9a-f:]+(?:%[\w.-]+)?$/i;
function cleanIp(value) {
  if (typeof value !== 'string') return null;
  let v = value.trim();
  if (!v || v.length > 45) return null;
  if (IPV4.test(v)) return v.split('.').every((n) => Number(n) <= 255) ? v : null;
  if (v.includes(':') && IPV6.test(v)) return v.toLowerCase();
  return null;
}

/**
 * Client identification.
 *
 * Vercel documents (https://vercel.com/docs/headers/request-headers) that the edge
 * OVERWRITES X-Forwarded-For (external values are not forwarded, to prevent spoofing)
 * and that x-vercel-forwarded-for is identical to it (and survives a proxy placed in
 * front of Vercel); x-real-ip is likewise set by the platform. So those headers are
 * trusted ONLY when running on Vercel (VERCEL env set by the platform).
 *
 * Elsewhere (local dev, `next start`, other hosts) client-supplied headers are
 * spoofable, so they are ignored unless TRUSTED_PROXY=<n> declares that exactly n
 * trusted reverse proxies append to X-Forwarded-For; then the entry n-from-the-right
 * is used (entries further left are attacker-controlled). "true" means 1.
 * App Router route handlers do not expose the TCP socket address, so with no trusted
 * source every caller shares the 'unknown' bucket (fails closed: strictest sharing).
 */
export function getClientIP(request, env = process.env) {
  const h = request.headers;
  if (env.VERCEL) {
    const platform = cleanIp(h.get('x-vercel-forwarded-for')?.split(',')[0])
      || cleanIp(h.get('x-real-ip'))
      || cleanIp(h.get('x-forwarded-for')?.split(',')[0]);
    return platform || 'unknown';
  }
  const hops = env.TRUSTED_PROXY === 'true' ? 1 : parseInt(env.TRUSTED_PROXY, 10);
  if (Number.isInteger(hops) && hops > 0) {
    const parts = (h.get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean);
    const picked = parts.length >= hops ? cleanIp(parts[parts.length - hops]) : null;
    return picked || 'unknown';
  }
  return 'unknown';
}
