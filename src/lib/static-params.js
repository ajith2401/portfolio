// Next writes each prerendered page's cache entry to a file named after its slug (plus a suffix such as ".segments").
// Filesystems cap one name at 255 BYTES, and Tamil letters are 3 bytes each in UTF-8, so a long Tamil slug makes
// the production build fail with ENAMETOOLONG. Slugs over the budget are not prerendered at build time;
// they are still rendered on demand (dynamicParams) and cached by ISR.
export const MAX_PRERENDER_SLUG_BYTES = 180; // 255 minus headroom for ".segments"/".html"/".rsc" and encoding

export function isPrerenderSafeSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && Buffer.byteLength(slug, 'utf8') <= MAX_PRERENDER_SLUG_BYTES;
}
