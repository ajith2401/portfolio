// Pure routing decision for /spotlight/[id] (testable without a DB).
import { decodeSlugParam, encodeSlugForUrl, looksLikeObjectId } from '../content-contract/slug.js';

/**
 * deps: { byId(id), bySlug(slug), byHistory(slug) } -> lean book doc | null
 * Returns { action: 'render', book, via } | { action: 'redirect', to } | { action: 'notfound' }
 */
export async function resolveBookRoute(param, { byId, bySlug, byHistory }) {
  const slug = decodeSlugParam(param);
  if (!slug) return { action: 'notfound' };
  if (looksLikeObjectId(slug)) {
    const book = await byId(slug);
    if (book) return { action: 'render', book, via: 'objectId' };
  }
  const book = await bySlug(slug);
  if (book) return { action: 'render', book, via: 'slug' };
  const old = await byHistory(slug);
  if (old?.slug) return { action: 'redirect', to: `/spotlight/${encodeSlugForUrl(old.slug)}` };
  return { action: 'notfound' };
}
