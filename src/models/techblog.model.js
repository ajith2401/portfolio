// src/models/techblog.model.js
import mongoose from 'mongoose';

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
    trim: true,
    lowercase: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
      },
      message: 'Slug must only contain lowercase letters, numbers, and hyphens'
    }
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
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
TechBlogSchema.index({ 'performance.views': -1, status: 1 });

// Text search index for full-text search
TechBlogSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text',
  metaDescription: 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    metaDescription: 3,
    content: 1
  }
});

// Generate slug from title before saving
TechBlogSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Generate excerpt from content if not provided
  if (this.isModified('content') && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    this.excerpt = plainText.substring(0, 250).trim() + (plainText.length > 250 ? '...' : '');
  }

  // Generate meta description if not provided
  if (this.isModified('content') && !this.metaDescription) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.metaDescription = plainText.substring(0, 155).trim() + (plainText.length > 155 ? '...' : '');
  }

  // Calculate word count and read time
  if (this.isModified('content')) {
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    this.readTime = Math.ceil(this.wordCount / 200); // 200 words per minute
  }

  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Update lastModified timestamp
  this.lastModified = new Date();

  next();
});

// Calculate average rating
TechBlogSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = Number((sum / this.ratings.length).toFixed(1));
  this.totalRatings = this.ratings.length;
};

// Add rating method
TechBlogSchema.methods.addRating = async function(name, email, rating, comment = '') {
  const existingRating = this.ratings.find(r => r.email === email);
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.name = name;
    existingRating.comment = comment;
  } else {
    this.ratings.push({ name, email, rating, comment });
  }
  
  this.calculateAverageRating();
  await this.save();
  return this;
};

// Increment view count
TechBlogSchema.methods.incrementViews = async function() {
  this.performance.views += 1;
  await this.save();
  return this;
};

// Static method to find related posts
TechBlogSchema.statics.findRelated = function(blogId, category, tags = [], limit = 5) {
  return this.find({
    _id: { $ne: blogId },
    status: 'published',
    $or: [
      { category: category },
      { tags: { $in: tags } }
    ]
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .select('title slug category tags images excerpt publishedAt readTime');
};

// Static method to get trending posts
TechBlogSchema.statics.getTrending = function(limit = 10) {
  return this.find({
    status: 'published',
    publishedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
  })
  .sort({ 'performance.views': -1, publishedAt: -1 })
  .limit(limit)
  .select('title slug category tags images excerpt publishedAt readTime performance.views');
};

// Static method to get featured posts
TechBlogSchema.statics.getFeatured = function(limit = 5) {
  return this.find({
    status: 'published',
    featured: true
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .select('title slug category tags images excerpt publishedAt readTime');
};

// Virtual for URL
TechBlogSchema.virtual('url').get(function() {
  return `/blog/${this.slug || this._id}`;
});

// Virtual for reading time text
TechBlogSchema.virtual('readTimeText').get(function() {
  return `${this.readTime} min read`;
});

// Ensure virtual fields are serialized
TechBlogSchema.set('toJSON', { virtuals: true });
TechBlogSchema.set('toObject', { virtuals: true });

let TechBlog;
try {
  TechBlog = mongoose.model('TechBlog');
} catch {
  TechBlog = mongoose.model('TechBlog', TechBlogSchema);
}

export { TechBlog };