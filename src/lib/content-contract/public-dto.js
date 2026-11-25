// Shared content contract: explicit public shapes. Public pages must serialise ONLY these,
// never a raw Mongo document (ratings[] carry reviewer emails, revisions carry old drafts).

const iso = (d) => (d ? new Date(d).toISOString() : null);
const str = (v) => (v == null ? null : String(v));

const pickImages = (i = {}) => ({
  small: i.small || null,
  medium: i.medium || null,
  large: i.large || null,
  thumbnail: i.thumbnail || null,
  alt: i.alt || null,
});

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
    body: doc.body,
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
