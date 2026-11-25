// Shared content contract: slug rules. Identical copy lives in both repos (see CONTRACT.lock.json).
// Pure ES module, no dependencies, safe for Node, Next server and browser.

export const SLUG_MAX_LENGTH = 100;

// Letters, combining marks (Tamil vowel signs / pulli are \p{M}) and numbers, joined by single hyphens.
const SLUG_RE = /^[\p{L}\p{M}\p{N}]+(?:-[\p{L}\p{M}\p{N}]+)*$/u;
const OBJECT_ID_RE = /^[0-9a-f]{24}$/i;

const graphemeSegmenter =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

export function graphemes(text) {
  const s = String(text ?? "");
  return graphemeSegmenter
    ? Array.from(graphemeSegmenter.segment(s), (x) => x.segment)
    : Array.from(s);
}

export function normalizeText(text) {
  return String(text ?? "").normalize("NFC");
}

function truncateSlug(slug, maxLength) {
  if (slug.length <= maxLength) return slug;
  let out = "";
  for (const g of graphemes(slug)) {
    if (out.length + g.length > maxLength) break;
    out += g;
  }
  const lastHyphen = out.lastIndexOf("-");
  if (lastHyphen > maxLength * 0.5) out = out.slice(0, lastHyphen);
  return out.replace(/-+$/g, "");
}

/**
 * Title or manual input -> canonical slug. Keeps Tamil (and any Unicode letters), never transliterates.
 * Returns '' when nothing usable remains (callers must handle that explicitly).
 */
export function generateSlug(input, { maxLength = SLUG_MAX_LENGTH } = {}) {
  let s = normalizeText(input).toLowerCase();
  s = s.replace(/[​-‍⁠﻿]/g, ""); // zero-width characters
  s = s.replace(/['’‘`]/g, ""); // apostrophes: "it's" -> "its"
  s = s.replace(/[^\p{L}\p{M}\p{N}]+/gu, "-");
  s = s.replace(/^-+|-+$/g, "");
  return truncateSlug(normalizeText(s), maxLength);
}

/** Returns { valid, reason } so UIs and APIs can show an actionable message. */
export function validateSlug(slug) {
  if (typeof slug !== "string" || slug.length === 0)
    return { valid: false, reason: "Slug is required." };
  if (slug.length > SLUG_MAX_LENGTH)
    return {
      valid: false,
      reason: `Slug must be at most ${SLUG_MAX_LENGTH} characters.`,
    };
  if (slug !== slug.normalize("NFC"))
    return { valid: false, reason: "Slug must be Unicode NFC normalised." };
  if (slug !== slug.toLowerCase())
    return { valid: false, reason: "Slug must be lowercase." };
  if (OBJECT_ID_RE.test(slug))
    return { valid: false, reason: "Slug must not look like a database id." };
  if (!SLUG_RE.test(slug)) {
    return {
      valid: false,
      reason:
        "Use letters, numbers and single hyphens only (Tamil letters are fine).",
    };
  }
  return { valid: true, reason: null };
}

export function isValidSlug(slug) {
  return validateSlug(slug).valid;
}

/**
 * exists(slug) -> Promise<boolean>. Appends -2, -3 ... until free. Never returns an invalid slug.
 */
export async function ensureUniqueSlug(
  baseSlug,
  exists,
  { maxAttempts = 1000 } = {},
) {
  if (!baseSlug) return null;
  if (!(await exists(baseSlug))) return baseSlug;
  for (let n = 2; n <= maxAttempts; n += 1) {
    const suffix = `-${n}`;
    const candidate =
      truncateSlug(baseSlug, SLUG_MAX_LENGTH - suffix.length) + suffix;
    if (!(await exists(candidate))) return candidate;
  }
  throw new Error("Could not find a free slug");
}

/** Decode a URL path segment exactly once. Returns null if it is malformed. */
export function decodeSlugParam(param) {
  try {
    return normalizeText(decodeURIComponent(String(param)));
  } catch {
    return null;
  }
}

/** Encode for use inside a URL path exactly once. Input must be a decoded slug. */
export function encodeSlugForUrl(slug) {
  return encodeURIComponent(normalizeText(slug));
}

export function looksLikeObjectId(value) {
  return OBJECT_ID_RE.test(String(value ?? ""));
}
