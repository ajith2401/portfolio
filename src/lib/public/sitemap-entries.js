// Pure sitemap entry builder for writings. Published-only filtering happens in the query; this
// additionally refuses anything that must never be listed (no slug, ObjectId-shaped slug, bad title).
import { looksLikeObjectId, writingPath, DEFAULT_SITE } from '../content-contract/index.js';

const toDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export function writingSitemapEntry(w, site = DEFAULT_SITE) {
  if (!w || w.status === 'draft' || w.status === 'archived') return null;
  const slug = typeof w.slug === 'string' ? w.slug.trim() : '';
  if (!slug || looksLikeObjectId(slug)) return null;
  if (typeof w.title !== 'string' || !w.title.trim()) return null;
  const entry = {
    url: `${site.siteUrl}${writingPath(slug, site.section)}`,
    lastModified: toDate(w.updatedAt) || toDate(w.publishedAt) || toDate(w.createdAt) || undefined,
    changeFrequency: 'monthly',
    priority: 0.8,
  };
  if (w.images?.large && /^https?:\/\//.test(w.images.large)) entry.images = [w.images.large];
  return entry;
}
