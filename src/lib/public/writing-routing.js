// Pure routing decision for /quill/[id]. No database or framework imports so it is unit-testable.
// lookups: { byId(id), bySlug(slug), byHistory(slug) } each resolving to a lean doc or null.
import { decodeSlugParam, looksLikeObjectId, normalizeText } from "../content-contract/index.js";

const isPublished = (w) => Boolean(w) && w.status === "published";

/**
 * Decide what to do with a URL segment.
 * - { action: 'render', writing, via: 'slug' | 'objectId' }
 * - { action: 'redirect', slug, reason: 'objectId' | 'slugHistory' }  (always permanent, never to itself)
 * - { action: 'notfound' }
 * Only published writings are ever rendered or redirected to. A current slug always beats a historical one.
 */
export async function resolveWritingRoute(param, lookups) {
  const decoded = decodeSlugParam(param);
  if (!decoded || decoded.length > 200) return { action: "notfound" };

  if (looksLikeObjectId(decoded)) {
    const byId = await lookups.byId(decoded);
    if (isPublished(byId)) {
      if (byId.slug && normalizeText(byId.slug) !== decoded) {
        return { action: "redirect", slug: byId.slug, reason: "objectId" };
      }
      return { action: "render", writing: byId, via: "objectId" };
    }
    // Not an id of a published writing: a 24-hex string may still be a real slug.
  }

  const current = await lookups.bySlug(decoded);
  if (isPublished(current)) return { action: "render", writing: current, via: "slug" };

  const old = await lookups.byHistory(decoded);
  if (isPublished(old) && old.slug && normalizeText(old.slug) !== decoded) {
    return { action: "redirect", slug: old.slug, reason: "slugHistory" };
  }
  return { action: "notfound" };
}
