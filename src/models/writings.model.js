// src/models/writings.model.js
import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugGenerator.js';

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
    lowercase: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
      },
      message: 'Slug must be lowercase alphanumeric with hyphens only'
    },
    maxlength: [100, 'Slug cannot exceed 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Body content is required'],
    index: true
  },
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
      values: ['Poetry', 'Short Story', 'Essay', 'Novel', 'Article', 'Review', 'Personal'],
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
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    twitterTitle: String,
    twitterDescription: String,
    focusKeyword: String,
    structuredData: mongoose.Schema.Types.Mixed
  },
  performance: {
    views: {
      type: Number,
      default: 0,
      index: true
    },
    shares: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
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
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
WritingSchema.index({ status: 1, publishedAt: -1 });
WritingSchema.index({ category: 1, status: 1, publishedAt: -1 });
WritingSchema.index({ language: 1, status: 1, publishedAt: -1 });
WritingSchema.index({ tags: 1, status: 1 });
WritingSchema.index({ featured: 1, status: 1, publishedAt: -1 });
WritingSchema.index({ trending: 1, status: 1, publishedAt: -1 });
WritingSchema.index({ 'performance.views': -1, status: 1 });

// Pre-save middleware to generate slug
WritingSchema.pre('save', async function(next) {
  try {
    // Generate slug if not provided or if title has changed
    if (!this.slug || this.isModified('title')) {
      const baseSlug = generateSlug(this.title);
      
      if (baseSlug) {
        // Ensure uniqueness
        this.slug = await ensureUniqueSlug(
          baseSlug,
          async (slug, excludeId) => {
            const query = { slug };
            if (excludeId) query._id = { $ne: excludeId };
            return await this.constructor.findOne(query);
          },
          this._id
        );
      }
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