import { resolveContentFormat, canonicalizeDoc, validateDoc } from "./document.js";

// Defence in depth: only validated structured content is ever exposed publicly.
function safeContent(doc) {
  if (resolveContentFormat(doc) !== "tiptap") return null;
  const c = canonicalizeDoc(doc.content);
  return validateDoc(c).ok ? c : null;
}
// Shared content contract: explicit public shapes. Public pages must serialise ONLY these,
// never a raw Mongo document (ratings[] carry reviewer emails, revisions carry old drafts).

const iso = (d) => (d ? new Date(d).toISOString() : null);
const str = (v) => (v == null ? null : String(v));

// `images` may be absent, null or any non-object in legacy documents; a default parameter would not catch null.
const imgStr = (v) => (typeof v === "string" && v.trim() ? v : null);
const pickImages = (input) => {
  const i = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  return {
    small: imgStr(i.small),
    medium: imgStr(i.medium),
    large: imgStr(i.large),
    thumbnail: imgStr(i.thumbnail),
    alt: imgStr(i.alt),
  };
};

/** Card/list shape: no body. */
export function toPublicWritingCard(doc) {
  return {
    id: str(doc._id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt || null,
    category: doc.category,
    language: doc.language || "Tamil",
    tags: Array.isArray(doc.tags) ? [...doc.tags] : [],
    images: pickImages(doc.images),
    readTime: doc.readTime || 0,
    wordCount: doc.wordCount || 0,
    featured: Boolean(doc.featured),
    publishedAt: iso(doc.publishedAt || doc.createdAt),
    updatedAt: iso(doc.updatedAt || doc.lastModified),
  };
}

/** Detail shape: adds body and the public SEO subset. Never ratings[], revisions, email, version or admin data. */
export function toPublicWriting(doc) {
  const seo = doc.seo || {};
  return {
    ...toPublicWritingCard(doc),
    contentFormat: resolveContentFormat(doc),
    // Exactly one representation is public: structured content OR legacy markdown body.
    // If structured content is invalid, fall back to the derived plain-text body (rendered as text only).
    body: resolveContentFormat(doc) === "markdown" || safeContent(doc) === null ? doc.body : null,
    content: safeContent(doc),
    metaDescription: doc.metaDescription || null,
    status: doc.status,
    seo: {
      title: seo.title || null,
      description: seo.description || null,
      canonicalUrl: seo.canonicalUrl || null,
      ogTitle: seo.ogTitle || null,
      ogDescription: seo.ogDescription || null,
      ogImage: seo.ogImage || null,
      ogImageAlt: seo.ogImageAlt || null,
      twitterCard: seo.twitterCard || null,
      twitterTitle: seo.twitterTitle || null,
      twitterDescription: seo.twitterDescription || null,
      robots: {
        index: seo.robots?.index !== false,
        follow: seo.robots?.follow !== false,
      },
    },
    // Only populated by the caller from APPROVED ratings; never from the raw ratings[] array.
    rating: null,
  };
}
