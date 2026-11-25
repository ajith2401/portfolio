// Shared content contract: publishing lifecycle. Persistence-agnostic and side-effect free.
import { validateSlug } from "./slug.js";

export const STATUSES = ["draft", "published", "archived"];

// "unpublished" is deliberately NOT a stored status: it is a draft that has a publishedAt (see derivePublicState).
const TRANSITIONS = {
  draft: ["published", "archived"],
  published: ["draft", "archived"],
  archived: ["draft", "published"],
};

export function canTransition(from, to) {
  if (from === to) return true; // no-op is always allowed
  return (TRANSITIONS[from] || []).includes(to);
}

export function derivePublicState(doc) {
  if (doc.status === "draft" && doc.publishedAt) return "unpublished";
  return doc.status;
}

/** The only definition of "publicly visible". Use it in every public query, sitemap and metadata lookup. */
export const PUBLIC_FILTER = Object.freeze({ status: "published" });

/**
 * Validate and plan a status change. Returns { ok, errors[], set } where `set` are fields the
 * caller must assign. publishedAt is only set on the FIRST publish and never reset.
 */
export function planTransition(doc, nextStatus, now = new Date()) {
  const errors = [];
  const current = doc.status || "draft";
  if (!STATUSES.includes(nextStatus))
    errors.push(`Unknown status "${nextStatus}".`);
  else if (!canTransition(current, nextStatus))
    errors.push(`Cannot change status from ${current} to ${nextStatus}.`);

  if (errors.length === 0 && nextStatus === "published") {
    if (!String(doc.title ?? "").trim())
      errors.push("A title is required to publish.");
    if (!String(doc.body ?? "").trim())
      errors.push("Content is required to publish."); // any length: short poems are valid
    const slugCheck = validateSlug(doc.slug);
    if (!slugCheck.valid) errors.push(slugCheck.reason);
  }

  const set = {};
  if (errors.length === 0 && nextStatus === "published" && !doc.publishedAt)
    set.publishedAt = now;
  if (errors.length === 0 && nextStatus !== current) set.status = nextStatus;
  return { ok: errors.length === 0, errors, set };
}

/**
 * Slug change planning. Published slugs are never regenerated implicitly; a change must be explicit
 * and the old slug is kept so the public site can 301 to the new one.
 */
export function planSlugChange(doc, newSlug, now = new Date()) {
  const check = validateSlug(newSlug);
  if (!check.valid) return { ok: false, errors: [check.reason], set: {} };
  if (newSlug === doc.slug) return { ok: true, errors: [], set: {} };
  const history = Array.isArray(doc.slugHistory) ? [...doc.slugHistory] : [];
  const wasPublic = doc.status === "published" || Boolean(doc.publishedAt);
  if (doc.slug && wasPublic && !history.some((h) => h.slug === doc.slug)) {
    history.push({ slug: doc.slug, changedAt: now });
  }
  // A slug being reclaimed must not stay in history, or it would redirect to itself.
  const cleaned = history.filter((h) => h.slug !== newSlug);
  return {
    ok: true,
    errors: [],
    set: { slug: newSlug, slugHistory: cleaned },
    publishedUrlChanged: wasPublic,
  };
}
