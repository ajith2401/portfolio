// src/models/writings.model.js
import mongoose from 'mongoose';

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
    trim: true,
    lowercase: true,
    index: true,
    validate: {
      validator: function(v) {
        // Allow Tamil transliteration and English
        return /^[a-z0-9\u0B80-\u0BFF]+(?:-[a-z0-9\u0B80-\u0BFF]+)*$/.test(v);
      },
      message: 'Slug must only contain lowercase letters, numbers, Tamil characters, and hyphens'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'philosophy', 'poem', 'article', 'short story',
        'short writings', 'politics', 'cinema', 'letter', 
        'joke', 'feminism', 'social justice', 'love', 
        'nature', 'spirituality', 'culture', 'translation'
      ],
      message: 'Category must be one of the predefined values'
    },
    index: true
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  body: {
    type: String,
    required: [true, 'Content body is required'],
    index: true
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    trim: true
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required for SEO'],
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
    trim: true
  },
  language: {
    type: String,
    enum: ['tamil', 'english', 'bilingual'],
    default: 'tamil',
    index: true
  },
  translation: {
    english: String,
    transliteration: String,
    notes: String
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(tags) {
        return tags.length <= 15;
      },
      message: 'Cannot have more than 15 tags'
    }
  }],
  mood: {
    type: String,
    enum: ['happy', 'sad', 'romantic', 'angry', 'peaceful', 'contemplative', 'rebellious', 'nostalgic'],
    index: true
  },
  theme: {
    type: String,
    enum: ['love', 'loss', 'nature', 'politics', 'feminism', 'spirituality', 'social-justice', 'family', 'friendship'],
    index: true
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
WritingSchema.index({ status: 1, publishedAt: -1 });
WritingSchema.index({ category: 1, status: 1, publishedAt: -1 });
WritingSchema.index({ language: 1, status: 1, publishedAt: -1 });
WritingSchema.index({ tags: 1, status: 1 });
WritingSchema.index({ featured: 1, status: 1, publishedAt: -1 });
WritingSchema.index({ mood: 1, status: 1 });
WritingSchema.index({ theme: 1, status: 1 });
WritingSchema.index({ 'performance.views': -1, status: 1 });

// Text search index for Tamil and English content
WritingSchema.index({ 
  title: 'text', 
  body: 'text', 
  tags: 'text',
  metaDescription: 'text',
  'translation.english': 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    metaDescription: 3,
    body: 1,
    'translation.english': 2
  }
});

// Generate slug from title before saving
WritingSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (this.isModified('title') && !this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .trim()
      // Handle Tamil characters and transliteration
      .replace(/[\u0B80-\u0BFF]+/g, (match) => {
        // Keep Tamil characters as is, or add transliteration logic here
        return match;
      })
      .replace(/[^\w\s\u0B80-\u0BFF-]/g, '') // Remove special characters except Tamil
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    this.slug = baseSlug;
  }

  // Generate excerpt from body if not provided
  if (this.isModified('body') && !this.excerpt) {
    const plainText = this.body.replace(/<[^>]*>/g, ''); // Remove HTML tags
    this.excerpt = plainText.substring(0, 400).trim() + (plainText.length > 400 ? '...' : '');
  }

  // Generate meta description if not provided
  if (this.isModified('body') && !this.metaDescription) {
    const plainText = this.body.replace(/<[^>]*>/g, '');
    this.metaDescription = plainText.substring(0, 155).trim() + (plainText.length > 155 ? '...' : '');
  }

  // Calculate word count and read time
  if (this.isModified('body')) {
    const words = this.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    // Tamil reading speed is typically slower
    const wordsPerMinute = this.language === 'tamil' ? 150 : 200;
    this.readTime = Math.ceil(this.wordCount / wordsPerMinute);
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
WritingSchema.methods.calculateAverageRating = function() {
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
WritingSchema.methods.addRating = async function(name, email, rating, comment = '') {
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
WritingSchema.methods.incrementViews = async function() {
  this.performance.views += 1;
  await this.save();
  return this;
};

// Static method to find related writings
WritingSchema.statics.findRelated = function(writingId, category, tags = [], theme = null, limit = 5) {
  const query = {
    _id: { $ne: writingId },
    status: 'published'
  };

  // Build OR conditions for related content
  const orConditions = [
    { category: category }
  ];

  if (tags.length > 0) {
    orConditions.push({ tags: { $in: tags } });
  }

  if (theme) {
    orConditions.push({ theme: theme });
  }

  query.$or = orConditions;

  return this.find(query)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('title slug category tags theme mood images excerpt publishedAt readTime language');
};

// Static method to get by mood
WritingSchema.statics.getByMood = function(mood, limit = 10) {
  return this.find({
    status: 'published',
    mood: mood
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .select('title slug category mood theme images excerpt publishedAt readTime');
};

// Static method to get by theme
WritingSchema.statics.getByTheme = function(theme, limit = 10) {
  return this.find({
    status: 'published',
    theme: theme
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .select('title slug category mood theme images excerpt publishedAt readTime');
};

// Static method to get featured writings
WritingSchema.statics.getFeatured = function(limit = 5) {
  return this.find({
    status: 'published',
    featured: true
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .select('title slug category theme mood images excerpt publishedAt readTime language');
};

// Virtual for URL
WritingSchema.virtual('url').get(function() {
  return `/quill/${this.slug || this._id}`;
});

// Virtual for reading time text
WritingSchema.virtual('readTimeText').get(function() {
  return `${this.readTime} min read`;
});

// Virtual for language display
WritingSchema.virtual('languageDisplay').get(function() {
  const langMap = {
    'tamil': 'தமிழ்',
    'english': 'English',
    'bilingual': 'தமிழ் & English'
  };
  return langMap[this.language] || this.language;
});

// Ensure virtual fields are serialized
WritingSchema.set('toJSON', { virtuals: true });
WritingSchema.set('toObject', { virtuals: true });

let Writing;
try {
  Writing = mongoose.model('Writing');
} catch {
  Writing = mongoose.model('Writing', WritingSchema);
}

export { Writing };