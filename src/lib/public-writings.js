// Server-only data access for PUBLIC writing reads. Every function returns contract DTOs or
// lean docs that are meant to be passed through toPublicWriting*. Never hand a raw doc to a response.
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Writing } from '@/models';
import { toPublicWritingCard } from '@/lib/content-contract/index.js';
import { resolveWritingRoute } from '@/lib/public/writing-routing.js';
import { poemPreview } from '@/lib/public/poem-preview.js';

// Never selected on public paths: ratings carry reviewer emails, revisions carry old drafts.
const EXCLUDE = '-ratings -revisions -comments -__v';
const CARD_FIELDS =
  'title slug excerpt category language tags images readTime wordCount featured publishedAt createdAt updatedAt lastModified status';

export async function findForRoute(param) {
  await connectDB();
  return resolveWritingRoute(param, {
    byId: (id) => (mongoose.Types.ObjectId.isValid(id) ? Writing.findById(id).select(EXCLUDE).lean() : null),
    bySlug: (slug) => Writing.findOne({ slug, status: 'published' }).select(EXCLUDE).lean(),
    byHistory: (slug) =>
      Writing.findOne({ 'slugHistory.slug': slug, status: 'published' }).select(EXCLUDE).lean(),
  });
}

/**
 * Cards for lean docs, plus `preview` (first stanza) for poems only. The poem text is loaded in a second,
 * narrow query so list pages never pull every prose body.
 */
export async function toCardsWithPreview(docs) {
  const poemIds = docs.filter((d) => d.category === 'poem').map((d) => d._id);
  const byId = new Map();
  if (poemIds.length) {
    const rows = await Writing.find({ _id: { $in: poemIds }, status: 'published' })
      .select('category contentFormat content body').lean();
    for (const r of rows) byId.set(String(r._id), poemPreview(r));
  }
  return docs.map((d) => ({ ...toPublicWritingCard(d), preview: byId.get(String(d._id)) || null }));
}

export async function listPublishedCards({ category, search, sort = { publishedAt: -1, createdAt: -1 }, skip = 0, limit = 12 } = {}) {
  await connectDB();
  const query = { status: 'published' };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  const [total, docs] = await Promise.all([
    Writing.countDocuments(query),
    Writing.find(query).select(CARD_FIELDS).sort(sort).skip(skip).limit(limit).lean(),
  ]);
  return { total, cards: await toCardsWithPreview(docs) };
}

/** Related works: same category first, then most recent others. Published only, excludes the source. */
export async function relatedCards(writing, limit = 3) {
  await connectDB();
  const base = { status: 'published', _id: { $ne: writing._id } };
  const same = await Writing.find({ ...base, category: writing.category })
    .select(CARD_FIELDS).sort({ publishedAt: -1 }).limit(limit).lean();
  let docs = same;
  if (docs.length < limit) {
    const have = new Set([String(writing._id), ...docs.map((d) => String(d._id))]);
    const more = await Writing.find({ status: 'published', _id: { $nin: [...have] } })
      .select(CARD_FIELDS).sort({ publishedAt: -1 }).limit(limit - docs.length).lean();
    docs = docs.concat(more);
  }
  return toCardsWithPreview(docs);
}
