// One rule for "is this Book public?", used by every public Book surface in the Portfolio and by the
// Admin when it decides what to refresh. Keep this the ONLY place that knows the rule.
//
//   status 'published'            -> public
//   status field absent           -> public   (legacy records written before `status` existed)
//   'draft', 'archived'           -> hidden
//   any other string / unknown    -> hidden   (fail closed: a future status is private until added here)
//   explicit null / non-string    -> hidden   (a record that deliberately has no value is not a legacy record;
//                                              the inspector in docs/PRODUCTION_READINESS.md counts them)
//
// Two forms of the same rule: an in-memory check and a MongoDB filter. They are tested against each other.

export const BOOK_PUBLIC_STATUS = "published";
export const BOOK_KNOWN_STATUSES = Object.freeze(["draft", "published", "archived"]);

/** In-memory check for a loaded Book (lean object or document). */
export function isBookPublic(book) {
  if (!book || typeof book !== "object") return false;
  const status = book.status;
  if (status === undefined) return true; // field absent: legacy record
  return status === BOOK_PUBLIC_STATUS;
}

/** MongoDB clause equivalent to isBookPublic (matches absent field or exactly 'published'; not null). */
export function bookVisibilityClause() {
  return { $or: [{ status: { $exists: false } }, { status: BOOK_PUBLIC_STATUS }] };
}

/**
 * Combine any query with the visibility rule. Uses $and so a caller's own $or / $text is never overwritten:
 *   Book.find(withBookVisibility({ $text: { $search: q } }))
 */
export function withBookVisibility(query = {}) {
  return { $and: [query, bookVisibilityClause()] };
}
