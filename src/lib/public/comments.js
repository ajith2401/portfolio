// Public comment shape: never expose reviewer email or moderation fields.
export function toPublicComment(c) {
  return {
    _id: String(c._id),
    name: c.name,
    comment: c.comment,
    rating: c.rating,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
  };
}

/** Escape user text for use inside a RegExp. */
export function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** XML text escape (RSS / sitemap). */
export function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
