// Pure helpers for POST /api/revalidate.
import crypto from 'node:crypto';
import { encodeSlugForUrl } from '../content-contract/index.js';

/** Constant-time secret check. Rejects when the expected secret is unset or too short. */
export function secretMatches(provided, expected) {
  if (typeof expected !== 'string' || expected.length < 16) return false;
  if (typeof provided !== 'string' || !provided) return false;
  const a = crypto.createHash('sha256').update(provided).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

const validSlug = (s) => typeof s === 'string' && s.trim().length > 0 && s.length <= 200 && !/[\u0000-\u001f/\\]/.test(s);

/** Returns { paths } or { error }. Both raw and percent-encoded forms of each slug are listed. */
export function revalidationTargets(body) {
  if (!body || typeof body !== 'object') return { error: 'Body must be a JSON object' };
  const { slug, previousSlugs = [], section = 'quill' } = body;
  if (section !== 'quill' && section !== 'book') return { error: "section must be 'quill' or 'book'" };
  if (!validSlug(slug)) return { error: 'slug is required' };
  if (!Array.isArray(previousSlugs) || previousSlugs.length > 50 || !previousSlugs.every(validSlug)) {
    return { error: 'previousSlugs must be an array of up to 50 valid slugs' };
  }
  if (section === 'book') {
    // Listings, sitemap and detail pages that could still show a book that was just hidden or changed.
    const bp = new Set(['/books', '/spotlight', '/sitemap.xml']);
    for (const s of [slug, ...previousSlugs]) {
      bp.add(`/spotlight/${s.trim()}`);
      bp.add(`/spotlight/${encodeSlugForUrl(s.trim())}`);
    }
    return { paths: [...bp] };
  }
  const paths = new Set(['/quill', '/sitemap.xml', '/api/rss']);
  for (const s of [slug, ...previousSlugs]) {
    paths.add(`/quill/${s.trim()}`);
    paths.add(`/quill/${encodeSlugForUrl(s.trim())}`);
    paths.add(`/quill/${encodeSlugForUrl(s.trim())}/opengraph-image`);
  }
  return { paths: [...paths] };
}
