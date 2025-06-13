// src/models/project.model.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true
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
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters'],
    trim: true
  },
  longDescription: {
    type: String,
    required: [true, 'Detailed description is required'],
    trim: true
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required for SEO'],
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
    trim: true
  },
  technologies: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    version: String,
    purpose: String // frontend, backend, database, deployment, etc.
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['ai-ml', 'web-app', 'mobile-app', 'backend-api', 'devops', 'data-science', 'automation', 'other'],
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
        return tags.length <= 15;
      },
      message: 'Cannot have more than 15 tags'
    }
  }],
  images: {
    small: String,
    medium: String,
    large: String,
    thumbnail: String,
    banner: String,
    gallery: [String],
    screenshots: [{
      url: String,
      caption: String,
      alt: String
    }],
    alt: {
      type: String,
      default: function() {
        return this.title;
      }
    }
  },
  stack: {
    frontend: [String],
    backend: [String],
    database: [String],
    deployment: [String],
    tools: [String]
  },
  features: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    implemented: {
      type: Boolean,
      default: true
    }
  }],
  challenges: [{
    problem: {
      type: String,
      required: true
    },
    solution: String,
    impact: String
  }],
  achievements: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    date: Date,
    organization: String,
    certificate: String
  }],
  stats: {
    users: String,
    accuracy: String,
    performance: String,
    uptime: String,
    schemes: String, // For government scheme projects
    downloads: Number,
    stars: Number
  },
  links: {
    github: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/github\.com\//.test(v);
        },
        message: 'GitHub URL must start with https://github.com/'
      }
    },
    live: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: 'Live URL must be a valid HTTP/HTTPS URL'
      }
    },
    demo: String,
    documentation: String,
    api: String,
    video: String
  },
  collaboration: {
    teamSize: Number,
    role: {
      type: String,
      enum: ['solo', 'lead', 'frontend', 'backend', 'fullstack', 'contributor']
    },
    duration: String,
    teammates: [{
      name: String,
      role: String,
      linkedin: String
    }]
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      title: String,
      description: String,
      date: Date,
      completed: {
        type: Boolean,
        default: false
      }
    }]
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
    githubStars: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: Number,
    default: 0,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'maintained', 'archived', 'draft', 'published'],
    default: 'draft',
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'portfolio-only'],
    default: 'portfolio-only'
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
ProjectSchema.index({ status: 1, publishedAt: -1 });
ProjectSchema.index({ category: 1, status: 1, priority: -1 });
ProjectSchema.index({ featured: 1, status: 1, priority: -1 });
ProjectSchema.index({ 'performance.views': -1, status: 1 });
ProjectSchema.index({ tags: 1, status: 1 });
ProjectSchema.index({ 'technologies.name': 1, status: 1 });

// Text search index
ProjectSchema.index({ 
  title: 'text', 
  shortDescription: 'text',
  longDescription: 'text',
  tags: 'text',
  'technologies.name': 'text'
}, {
  weights: {
    title: 10,
    shortDescription: 5,
    tags: 3,
    'technologies.name': 3,
    longDescription: 1
  }
});

// Generate slug from title before saving
ProjectSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Generate meta description if not provided
  if (this.isModified('shortDescription') && !this.metaDescription) {
    this.metaDescription = this.shortDescription.length > 160 
      ? this.shortDescription.substring(0, 157) + '...'
      : this.shortDescription;
  }

  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Update lastModified timestamp
  this.lastModified = new Date();

  next();
});

// Increment view count
ProjectSchema.methods.incrementViews = async function() {
  this.performance.views += 1;
  await this.save();
  return this;
};

// Static method to find related projects
ProjectSchema.statics.findRelated = function(projectId, category, technologies = [], limit = 5) {
  const techNames = technologies.map(tech => 
    typeof tech === 'object' ? tech.name : tech
  ).filter(Boolean);

  return this.find({
    _id: { $ne: projectId },
    status: 'published',
    $or: [
      { category: category },
      { 'technologies.name': { $in: techNames } },
      { tags: { $in: techNames } }
    ]
  })
  .sort({ priority: -1, publishedAt: -1 })
  .limit(limit)
  .select('title slug category technologies tags images shortDescription status difficulty');
};

// Static method to get featured projects
ProjectSchema.statics.getFeatured = function(limit = 6) {
  return this.find({
    status: 'published',
    featured: true
  })
  .sort({ priority: -1, publishedAt: -1 })
  .limit(limit)
  .select('title slug category technologies tags images shortDescription difficulty performance.views');
};

// Static method to get projects by technology
ProjectSchema.statics.getByTechnology = function(technology, limit = 10) {
  return this.find({
    status: 'published',
    $or: [
      { 'technologies.name': new RegExp(technology, 'i') },
      { tags: new RegExp(technology, 'i') }
    ]
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .select('title slug category technologies tags images shortDescription');
};

// Static method to get projects by category
ProjectSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({
    status: 'published',
    category: category
  })
  .sort({ priority: -1, publishedAt: -1 })
  .limit(limit)
  .select('title slug category technologies tags images shortDescription difficulty');
};

// Virtual for URL
ProjectSchema.virtual('url').get(function() {
  return `/devfolio/${this.slug || this._id}`;
});

// Virtual for tech stack summary
ProjectSchema.virtual('techStackSummary').get(function() {
  const allTech = [
    ...(this.stack?.frontend || []),
    ...(this.stack?.backend || []),
    ...(this.stack?.database || [])
  ].filter(Boolean);
  
  return allTech.slice(0, 5).join(', ') + (allTech.length > 5 ? '...' : '');
});

// Virtual for project duration
ProjectSchema.virtual('duration').get(function() {
  if (!this.timeline?.startDate || !this.timeline?.endDate) {
    return null;
  }
  
  const start = new Date(this.timeline.startDate);
  const end = new Date(this.timeline.endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    return `${Math.ceil(diffDays / 30)} months`;
  } else {
    return `${Math.ceil(diffDays / 365)} years`;
  }
});

// Ensure virtual fields are serialized
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

let Project;
try {
  Project = mongoose.model('Project');
} catch {
  Project = mongoose.model('Project', ProjectSchema);
}

export { Project };