// src/models/project.model.js
import mongoose from 'mongoose';
import { generateSlug, ensureUniqueSlug } from '../utils/slugGenerator.js';
import { generateUniqueShortCode } from '../utils/shortCode.js';

const ProjectSchema = new mongoose.Schema({
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
  shortCode: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  longDescription: {
    type: String,
    required: [true, 'Long description is required'],
    trim: true,
    maxlength: [10000, 'Long description cannot exceed 10000 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'AI/ML',
        'web',
        'mobile',
        'backend',
        'devops',
        'other',
        'Web Apps',
        'Mobile Apps',
        'Web Application',
        'Mobile App',
        'Desktop App',
        'API/Backend',
        'Tool/Utility',
        'Open Source',
        'Client Work',
        'Personal Project'
      ],
      message: 'Category must be one of the predefined values'
    },
    index: true
  },
  technologies: [mongoose.Schema.Types.Mixed],
  stack: [{
    type: String,
    trim: true
  }],
  achievement: {
    type: String,
    trim: true,
    default: ''
  },
  stats: {
    users: { type: String, default: '' },
    accuracy: { type: String, default: '' },
    schemes: { type: String, default: '' }
  },
  links: {
    live: { type: mongoose.Schema.Types.Mixed, default: '' },
    github: { type: mongoose.Schema.Types.Mixed, default: '' },
    demo: { type: mongoose.Schema.Types.Mixed, default: '' },
    documentation: { type: mongoose.Schema.Types.Mixed, default: '' },
    blog: { type: mongoose.Schema.Types.Mixed, default: '' }
  },
  images: {
    small: { type: String, default: '' },
    medium: { type: String, default: '' },
    large: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    banner: { type: String, default: '' },
    featured: { type: String, default: '' },
    logo: { type: String, default: '' },
    gallery: [{ type: String }]
  },
  features: [mongoose.Schema.Types.Mixed],
  challenges: [mongoose.Schema.Types.Mixed],
  timeline: {
    started: Date,
    completed: Date,
    duration: String,
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'Maintained', 'Deprecated'],
      default: 'Completed'
    }
  },
  metrics: {
    users: Number,
    downloads: Number,
    stars: Number,
    forks: Number,
    commits: Number,
    contributors: Number
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
  priority: {
    type: Number,
    default: 0,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
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
ProjectSchema.index({ status: 1, publishedAt: -1 });
ProjectSchema.index({ category: 1, status: 1, publishedAt: -1 });
ProjectSchema.index({ featured: 1, status: 1, publishedAt: -1 });
ProjectSchema.index({ trending: 1, status: 1, publishedAt: -1 });
ProjectSchema.index({ priority: -1, status: 1 });
ProjectSchema.index({ 'technologies.name': 1, status: 1 });
ProjectSchema.index({ tags: 1, status: 1 });

// Pre-validate middleware to generate base slug if not provided
ProjectSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Pre-save middleware to generate slug and other fields
ProjectSchema.pre('save', async function(next) {
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
    
    if (!this.shortCode) {
      this.shortCode = await generateUniqueShortCode({
        excludeModelName: 'Project',
        excludeId: this._id,
      });
    }

    // Auto-generate meta description if not provided
    if (!this.metaDescription && this.shortDescription) {
      this.metaDescription = this.shortDescription.substring(0, 160);
    }
    
    // Set published date
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    
    // Calculate project duration if dates are set
    if (this.timeline?.started && this.timeline?.completed) {
      const start = new Date(this.timeline.started);
      const end = new Date(this.timeline.completed);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        this.timeline.duration = `${diffDays} days`;
      } else if (diffDays < 365) {
        const months = Math.ceil(diffDays / 30);
        this.timeline.duration = `${months} month${months > 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(diffDays / 365);
        const remainingMonths = Math.ceil((diffDays % 365) / 30);
        this.timeline.duration = `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
      }
    }
    
    // Update lastModified
    this.lastModified = new Date();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find by slug or ObjectId
ProjectSchema.statics.findBySlugOrId = async function(identifier) {
  // Check if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return await this.findById(identifier);
  }
  
  // Otherwise, search by slug
  return await this.findOne({ slug: identifier });
};

// Static method to get featured projects
ProjectSchema.statics.getFeatured = async function(limit = 3) {
  return await this.find({ 
    status: 'published', 
    featured: true 
  })
  .sort({ priority: -1, publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get trending projects
ProjectSchema.statics.getTrending = async function(limit = 5) {
  return await this.find({ 
    status: 'published', 
    trending: true 
  })
  .sort({ 'performance.views': -1, publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get popular projects by views
ProjectSchema.statics.getPopular = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ 'performance.views': -1 })
    .limit(limit)
    .lean();
};

// Static method to get recent projects
ProjectSchema.statics.getRecent = async function(limit = 5) {
  return await this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to get projects by category
ProjectSchema.statics.getByCategory = async function(category, limit = 10) {
  return await this.find({ 
    status: 'published',
    category: category 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Instance method to get full URL
ProjectSchema.methods.getUrl = function() {
  return `/devfolio/${this.slug || this._id}`;
};

// Instance method to get SEO data
ProjectSchema.methods.getSEOData = function() {
  return {
    title: this.seo?.ogTitle || this.title,
    description: this.seo?.ogDescription || this.metaDescription || this.shortDescription,
    url: `https://www.ajithkumarr.com${this.getUrl()}`,
    image: this.images?.featured || this.images?.thumbnail,
    type: 'article',
    publishedTime: this.publishedAt,
    modifiedTime: this.updatedAt,
    author: 'Ajithkumar R',
    section: this.category,
    tags: this.tags
  };
};

let Project;
try {
  Project = mongoose.model('Project');
} catch {
  Project = mongoose.model('Project', ProjectSchema);
}

export { Project };