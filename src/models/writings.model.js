// src/models/writings.model.js
import mongoose from 'mongoose';
import {
  generateSlug, ensureUniqueSlug, validateSlug, validateDoc, canonicalizeDoc, docToPlainText,
  DOC_SCHEMA_VERSION, CONTENT_FORMATS,
} from '../lib/content-contract/index.js';
import { generateUniqueShortCode } from '../utils/shortCode.js';

const WritingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    index: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      // Single source of truth: the shared content contract (NFC, letters/marks/digits, hyphen separated).
      validator: (v) => validateSlug(v).valid,
      message: 'Invalid slug (use letters, numbers and single hyphens; not an ObjectId)'
    },
    maxlength: [100, 'Slug cannot exceed 100 characters']
  },
  shortCode: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    trim: true
  },
  // Legacy Markdown source. For contentFormat 'tiptap' this is a DERIVED plain-text projection
  // (search/index only), regenerated from `content` on every save; never edit it independently.
  body: {
    type: String,
    required: [function () { return this.contentFormat !== 'tiptap'; }, 'Body content is required'],
    default: '',
    index: true
  },
  contentFormat: { type: String, enum: CONTENT_FORMATS, default: 'markdown', index: true },
  contentSchemaVersion: { type: Number, default: null },
  // Structured document (Tiptap/ProseMirror JSON). Source of truth when contentFormat === 'tiptap'.
  content: { type: mongoose.Schema.Types.Mixed, default: undefined },
  // Original Markdown preserved when a legacy document is explicitly converted (never auto-deleted).
  importedFrom: {
    type: new mongoose.Schema({
      markdown: String,
      importedAt: Date,
      warnings: [String]
    }, { _id: false }),
    default: undefined
  },
  slugHistory: [{
    _id: false,
    slug: { type: String, required: true },
    changedAt: { type: Date, default: Date.now }
  }],
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    trim: true
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters for SEO'],
    trim: true
  },
  language: {
    type: String,
    enum: ['Tamil', 'English'],
    default: 'Tamil',
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['philosophy', 'poem', 'article', 'short story', 'short writings', 'politics', 'cinema', 'letter', 'joke'],
      message: 'Category must be one of the predefined values'
    },
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(tags) {
        return tags.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  }],
  images: {
    small: String,
    medium: String,
    large: String,
    thumbnail: String,
    alt: {
      type: String,
      default: function() {
        return this.title;
      }
    }
  },
  seo: {
    title: String,
    description: String,
    canonicalUrl: String,
    robots: { index: { type: Boolean, default: true }, follow: { type: Boolean, default: true } },
    ogImage: String,
    ogImageAlt: String,
    twitterCard: { type: String, enum: ['summary', 'summary_large_image'] },
    ogTitle: String,
    ogDescription: String,
    twitterTitle: String,
    twitterDescription: String,
    focusKeyword: String,
    structuredData: mongoose.Schema.Types.Mixed
  },
  performance: {
    views: {
      total: { type: Number, default: 0, index: true },
      unique: { type: Number, default: 0 },
      byDate: [{
        date: { type: Date, index: true },
        count: Number,
        uniqueCount: Number
      }]
    },
    engagement: {
      shares: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      averageTimeSpent: { type: Number, default: 0 }, // in seconds
      bounceRate: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 }
    },
    social: {
      facebook: { shares: Number, likes: Number },
      twitter: { shares: Number, likes: Number },
      linkedin: { shares: Number, likes: Number }
    }
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  ratings: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  readTime: {
    type: Number,
    default: 0,
    min: 0
  },
  wordCount: {
    type: Number,
    default: 0,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  trending: {
    type: Boolean,
    default: false,
    index: true
  },
  bookReference: {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    pageNumber: Number,
    chapterName: String
  },
  series: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Series'
    },
    order: Number,
    isFirst: Boolean,
    isLast: Boolean,
    totalParts: Number
  },
  awards: [{
    name: String,
    year: Number,
    organization: String
  }],
  publications: [{
    name: String,
    publishedDate: Date,
    url: String,
    type: {
      type: String,
      enum: ['magazine', 'newspaper', 'online', 'anthology', 'journal']
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: {
    type: Date,
    index: true
  },
  lastModified: {
    type: Date,
    default: Date.now,
    index: true
  },
  version: {
    type: Number,
    default: 1
  },
  revisions: [{
    content: {
      title: String,
      body: String,
      excerpt: String
    },
    version: Number,
    modifiedAt: Date,
    modifiedBy: String
  }],
  scheduledPublish: {
    date: Date,
    status: {
      type: String,
      enum: ['scheduled', 'published', 'failed'],
      default: 'scheduled'
    }
  }
}, {
  timestamps: true
});

// Optimized compound indexes for better query performance
WritingSchema.index({ status: 1, wordCount: 1, createdAt: -1 }); // Filtered wordCount listing index
WritingSchema.index({ status: 1, wordCount: 1, category: 1, createdAt: -1 }); // Filtered category listing index
WritingSchema.index({ status: 1, publishedAt: -1, category: 1 }); // Main listing index
WritingSchema.index({ 'performance.views.total': -1, status: 1, publishedAt: -1 }); // Popular content
WritingSchema.index({ language: 1, status: 1, category: 1, publishedAt: -1 }); // Language-specific listing
WritingSchema.index({ tags: 1, status: 1, publishedAt: -1 }); // Tag-based queries
WritingSchema.index({ featured: 1, status: 1, publishedAt: -1 }); // Featured content
WritingSchema.index({ trending: 1, status: 1, publishedAt: -1 }); // Trending content
WritingSchema.index({ 
  title: 'text', 
  body: 'text', 
  tags: 'text' 
}, {
  weights: {
    title: 10,
    tags: 5,
    body: 1
  },
  name: 'ContentIndex',
  // `language` holds 'Tamil'/'English', which MongoDB rejects as a text-index language override.
  // Point the override at a field that is never set and disable English stemming.
  default_language: 'none',
  language_override: 'textSearchLanguage'
}); // Full-text search

// Structured content: validate against the shared schema, canonicalize, derive the plain-text body.
WritingSchema.pre('validate', async function (next) {
  if (!this.slug && this.title) {
    const baseSlug = generateSlug(this.title);
    if (baseSlug) {
      this.slug = await ensureUniqueSlug(baseSlug, async (candidate) =>
        Boolean(await this.constructor.exists({ slug: candidate, _id: { $ne: this._id } })));
    }
  }
  if (this.contentFormat === 'tiptap') {
    const doc = this.content ? canonicalizeDoc(JSON.parse(JSON.stringify(this.content))) : null;
    const result = doc ? validateDoc(doc) : { ok: false, errors: ['content is required for contentFormat "tiptap"'] };
    if (!result.ok) return next(new Error(`Invalid structured content: ${result.errors.slice(0, 5).join('; ')}`));
    this.content = doc;
    this.contentSchemaVersion = DOC_SCHEMA_VERSION;
    this.body = docToPlainText(doc);
  }
  next();
});

// Query-style writes bypass document validation, so structured content is checked here too.
function guardStructuredUpdate(next) {
  const raw = this.getUpdate?.() || {};
  const u = { ...raw, ...(raw.$set || {}) };
  if ('content' in u || u.contentFormat === 'tiptap') {
    const doc = u.content ? canonicalizeDoc(JSON.parse(JSON.stringify(u.content))) : null;
    const result = doc ? validateDoc(doc) : { ok: false, errors: ['content is required for contentFormat "tiptap"'] };
    if (!result.ok) return next(new Error(`Invalid structured content: ${result.errors.slice(0, 5).join('; ')}`));
    const set = raw.$set || (raw.$set = {});
    set.content = doc; set.contentSchemaVersion = DOC_SCHEMA_VERSION; set.body = docToPlainText(doc);
    delete raw.content; delete raw.body;
  }
  next();
}
for (const op of ['findOneAndUpdate', 'updateOne', 'updateMany', 'replaceOne', 'findOneAndReplace']) {
  WritingSchema.pre(op, guardStructuredUpdate);
}
WritingSchema.pre('insertMany', function (next, docs) {
  for (const d of docs || []) {
    if (d.contentFormat === 'tiptap') {
      const c = d.content ? canonicalizeDoc(JSON.parse(JSON.stringify(d.content))) : null;
      if (!c || !validateDoc(c).ok) return next(new Error('Invalid structured content'));
      d.content = c; d.body = docToPlainText(c);
    }
  }
  next();
});

// Pre-save middleware to generate slug
WritingSchema.pre('save', async function(next) {
  try {
    if (!this.shortCode) {
      this.shortCode = await generateUniqueShortCode({
        excludeModelName: 'Writing',
        excludeId: this._id,
      });
    }

    // Auto-generate excerpt if not provided
    if (!this.excerpt && this.body) {
      const plainText = this.body.replace(/<[^>]*>/g, ''); // Remove HTML
      this.excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
    }
    
    // Calculate word count and reading time
    if (this.body) {
      const plainText = this.body.replace(/<[^>]*>/g, '');
      const words = plainText.trim().split(/\s+/).length;
      this.wordCount = words;
      this.readTime = Math.max(1, Math.ceil(words / 200)); // 200 words per minute
    }
    
    // Set published date
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    
    // Update lastModified
    this.lastModified = new Date();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find by slug or ObjectId
WritingSchema.statics.findBySlugOrId = async function(identifier) {
  // Check if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return await this.findById(identifier);
  }
  
  // Otherwise, search by slug
  return await this.findOne({ slug: identifier });
};

// Static method to get featured writings
WritingSchema.statics.getFeatured = async function(limit = 3) {
  return await this.find({ 
    status: 'published', 
    featured: true 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get trending writings
WritingSchema.statics.getTrending = async function(limit = 5) {
  return await this.find({ 
    status: 'published', 
    trending: true 
  })
  .sort({ 'performance.views': -1, publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get popular writings by views
WritingSchema.statics.getPopular = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ 'performance.views': -1 })
    .limit(limit)
    .lean();
};

// Static method to get recent writings
WritingSchema.statics.getRecent = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to get writings by category
WritingSchema.statics.getByCategory = async function(category, limit = 10) {
  return await this.find({ 
    status: 'published',
    category: category 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Instance method to get full URL
WritingSchema.methods.getUrl = function() {
  return `/quill/${this.slug || this._id}`;
};

// Instance method to get SEO data
WritingSchema.methods.getSEOData = function() {
  return {
    title: this.seo?.ogTitle || this.title,
    description: this.seo?.ogDescription || this.metaDescription || this.excerpt,
    url: `https://www.ajithkumarr.com${this.getUrl()}`,
    image: this.images?.large || this.images?.medium,
    type: 'article',
    publishedTime: this.publishedAt,
    modifiedTime: this.updatedAt,
    author: 'Ajithkumar R',
    section: this.category,
    tags: this.tags
  };
};

let Writing;
try {
  Writing = mongoose.model('Writing');
} catch {
  Writing = mongoose.model('Writing', WritingSchema);
}

export { Writing };