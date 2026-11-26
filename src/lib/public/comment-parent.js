import mongoose from 'mongoose';
import { Writing, TechBlog } from '@/models';

const MODELS = { Writing, TechBlog };
export const COMMENTABLE = Object.keys(MODELS);

/**
 * The parent a visitor may comment on / read comments of: it must exist and be published.
 * Drafts, archived and missing items are all indistinguishable (null) so nothing leaks about unpublished work.
 */
export async function findPublishedParent(parentModel, parentId) {
  const Model = MODELS[parentModel];
  if (!Model || typeof parentId !== 'string' || !mongoose.isValidObjectId(parentId)) return null;
  return Model.findOne({ _id: parentId, status: 'published' }).select('_id').lean();
}
