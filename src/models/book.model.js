// src/models/book.model.js
import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugGenerator.js';

const PoemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a poem title'],
    trim: true,
    maxlength: [100, 'Poem title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide the poem content']
  },
  translation: {
    type: String,
    default: ''
  },
  pageNumber: {
    type: Number,
    default: null
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [200, 'Book title cannot be more than 200 characters'],
    index: true
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
  description: {
    type: String,
    required: [true, 'Please provide a book description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
    trim: true
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  publishYear: {
    type: Number,
    required: [true, 'Please provide the year of publication'],
    index: true
  },
  isbn: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'Tamil',
    enum: ['Tamil', 'English', 'Bilingual'],
    index: true
  },
  pageCount: {
    type: Number,
    default: 0
  },
  poems: [PoemSchema],
  publisher: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  price: {
    type: Number,
    default: 0
  },
  purchaseLinks: {
    amazon: String,
    flipkart: String,
    other: String
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
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    name: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  genre: {
    type: String,
    enum: ['Poetry', 'Fiction', 'Non-Fiction', 'Biography', 'Essay Collection', 'Short Stories'],
    default: 'Poetry',
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published',
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
BookSchema.index({ status: 1, publishYear: -1 });
BookSchema.index({ featured: 1, status: 1, publishYear: -1 });
BookSchema.index({ language: 1, status: 1, publishYear: -1 });
BookSchema.index({ genre: 1, status: 1, publishYear: -1 });
BookSchema.index({ averageRating: -1, status: 1 });

// Pre-save middleware to generate slug and other fields
BookSchema.pre('save', async function(next) {
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
    
    // Auto-generate meta description if not provided
    if (!this.metaDescription && this.description) {
      this.metaDescription = this.description.substring(0, 160);
    }
    
    // Calculate average rating
    if (this.reviews && this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / this.reviews.length;
      this.totalReviews = this.reviews.length;
    }
    
    // Set published date if not set
    if (this.status === 'published' && !this.publishedAt) {
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
BookSchema.statics.findBySlugOrId = async function(identifier) {
  // Check if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return await this.findById(identifier);
  }
  
  // Otherwise, search by slug
  return await this.findOne({ slug: identifier });
};

// Static method to get featured books
BookSchema.statics.getFeatured = async function(limit = 3) {
  return await this.find({ 
    status: 'published', 
    featured: true 
  })
  .sort({ publishYear: -1 })
  .limit(limit)
  .lean();
};

// Static method to get popular books by views
BookSchema.statics.getPopular = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ 'performance.views': -1 })
    .limit(limit)
    .lean();
};

// Static method to get recent books
BookSchema.statics.getRecent = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ publishYear: -1 })
    .limit(limit)
    .lean();
};

// Static method to get books by genre
BookSchema.statics.getByGenre = async function(genre, limit = 10) {
  return await this.find({ 
    status: 'published',
    genre: genre 
  })
  .sort({ publishYear: -1 })
  .limit(limit)
  .lean();
};

// Instance method to get full URL
BookSchema.methods.getUrl = function() {
  return `/spotlight/${this.slug || this._id}`;
};

// Instance method to get SEO data
BookSchema.methods.getSEOData = function() {
  return {
    title: this.seo?.ogTitle || this.title,
    description: this.seo?.ogDescription || this.metaDescription || this.description,
    url: `https://www.ajithkumarr.com${this.getUrl()}`,
    image: this.coverImage,
    type: 'book',
    publishedTime: this.publishedAt,
    modifiedTime: this.updatedAt,
    author: 'Ajithkumar R',
    isbn: this.isbn,
    genre: this.genre,
    tags: this.tags
  };
};

let Book;
try {
  Book = mongoose.model('Book');
} catch {
  Book = mongoose.model('Book', BookSchema);
}

export { Book };