// src/models/techblog.model.js
import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugGenerator.js';

const TechBlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    index: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
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
      message: 'Slug must only contain lowercase letters, numbers, and hyphens'
    },
    maxlength: [100, 'Slug cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    index: true
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    trim: true
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required for SEO'],
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
    trim: true
  },
  focusKeyword: {
    type: String,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['web-development', 'javascript', 'react', 'nextjs', 'nodejs', 'backend', 'devops', 'cloud', 'ai-ml', 'database', 'tutorial', 'career'],
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
  author: {
    name: {
      type: String,
      required: true,
      default: 'Ajithkumar'
    },
    email: {
      type: String,
      required: true,
      default: 'contact@ajithkumarr.com'
    },
    bio: {
      type: String,
      default: 'Tamil writer, poet, and full stack developer specializing in React.js, Node.js, and MERN stack development.'
    }
  },
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
      maxlength: [500, 'Comment cannot exceed 500 characters']
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
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
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
TechBlogSchema.index({ status: 1, publishedAt: -1 });
TechBlogSchema.index({ category: 1, status: 1, publishedAt: -1 });
TechBlogSchema.index({ tags: 1, status: 1 });
TechBlogSchema.index({ featured: 1, status: 1, publishedAt: -1 });
TechBlogSchema.index({ trending: 1, status: 1, publishedAt: -1 });
TechBlogSchema.index({ difficulty: 1, status: 1, publishedAt: -1 });
TechBlogSchema.index({ 'performance.views': -1, status: 1 });

// Pre-save middleware to generate slug and other fields
TechBlogSchema.pre('save', async function(next) {
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
    if (!this.excerpt && this.content) {
      const plainText = this.content.replace(/<[^>]*>/g, ''); // Remove HTML
      this.excerpt = plainText.substring(0, 250) + (plainText.length > 250 ? '...' : '');
    }
    
    // Calculate word count and reading time
    if (this.content) {
      const plainText = this.content.replace(/<[^>]*>/g, '');
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
TechBlogSchema.statics.findBySlugOrId = async function(identifier) {
  // Check if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return await this.findById(identifier);
  }
  
  // Otherwise, search by slug
  return await this.findOne({ slug: identifier });
};

// Static method to get featured posts
TechBlogSchema.statics.getFeatured = async function(limit = 3) {
  return await this.find({ 
    status: 'published', 
    featured: true 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get trending posts
TechBlogSchema.statics.getTrending = async function(limit = 5) {
  return await this.find({ 
    status: 'published', 
    trending: true 
  })
  .sort({ 'performance.views': -1, publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get popular posts by views
TechBlogSchema.statics.getPopular = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ 'performance.views': -1 })
    .limit(limit)
    .lean();
};

// Static method to get recent posts
TechBlogSchema.statics.getRecent = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to get posts by category
TechBlogSchema.statics.getByCategory = async function(category, limit = 10) {
  return await this.find({ 
    status: 'published',
    category: category 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Instance method to get full URL
TechBlogSchema.methods.getUrl = function() {
  return `/blog/${this.slug || this._id}`;
};

// Instance method to get SEO data
TechBlogSchema.methods.getSEOData = function() {
  return {
    title: this.seo?.ogTitle || this.title,
    description: this.seo?.ogDescription || this.metaDescription || this.excerpt,
    url: `https://www.ajithkumarr.com${this.getUrl()}`,
    image: this.images?.large || this.images?.medium,
    type: 'article',
    publishedTime: this.publishedAt,
    modifiedTime: this.updatedAt,
    author: this.author.name,
    section: this.category,
    tags: this.tags
  };
};

let TechBlog;
try {
  TechBlog = mongoose.model('TechBlog');
} catch {
  TechBlog = mongoose.model('TechBlog', TechBlogSchema);
}

export { TechBlog };