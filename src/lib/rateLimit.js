// src/lib/rateLimit.js
// In-memory rate limiter — works in Node.js runtime (not Edge).
// For production at scale, replace with @upstash/ratelimit + Redis.

const store = new Map();

/**
 * Check if a request should be allowed.
 * @param {string} key      — unique key (e.g. "contact:1.2.3.4")
 * @param {number} limit    — max requests allowed in the window
 * @param {number} windowMs — window duration in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function rateLimit(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    // First request or expired window — start fresh
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/**
 * Get client IP from Next.js request headers.
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
