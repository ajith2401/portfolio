// src/models/photography.model.js
import mongoose from 'mongoose';

const PhotoServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['photoshoot', 'studio', 'wedding', 'frames', 'editing'],
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  images: {
    thumbnail: String,
    gallery: [String]
  },
  features: [{
    type: String,
    trim: true
  }],
  options: [{
    name: String,
    values: [String],
    priceModifier: Number
  }],
  duration: String, // e.g., "2 hours", "Full day"
  location: {
    type: String,
    enum: ['studio', 'outdoor', 'client-location', 'both']
  },
  availability: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean, 
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before save
PhotoServiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate unique slug from name
PhotoServiceSchema.pre('save', async function(next) {
  try {
    // Only generate slug if name is modified or the document is new
    if (!this.isModified('name') && this.slug) {
      return next();
    }
    
    // Generate the base slug from name
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check if the slug already exists
    const model = this.constructor;
    
    // Create a regex to find documents with the same base slug
    // This will match: baseSlug, baseSlug-1, baseSlug-2, etc.
    const slugRegex = new RegExp(`^${baseSlug}(-[0-9]+)?$`);
    
    // Find documents with similar slugs, excluding this document
    const similarSlugs = await model.find({
      slug: slugRegex,
      _id: { $ne: this._id } // Exclude current document when updating
    }).sort({ slug: -1 });
    
    // If no similar slugs found, use the base slug
    if (similarSlugs.length === 0) {
      this.slug = baseSlug;
      return next();
    }
    
    // Find the highest suffix number
    let highestSuffix = 0;
    
    for (const doc of similarSlugs) {
      const match = doc.slug.match(/-([0-9]+)$/);
      if (match) {
        const suffix = parseInt(match[1], 10);
        if (suffix > highestSuffix) {
          highestSuffix = suffix;
        }
      }
    }
    
    // Increment the highest suffix and append to the base slug
    this.slug = `${baseSlug}-${highestSuffix + 1}`;
    next();
  } catch (error) {
    next(error);
  }
});

// Export model
let PhotoService;
try {
  PhotoService = mongoose.model('PhotoService');
} catch {
  PhotoService = mongoose.model('PhotoService', PhotoServiceSchema);
}

export { PhotoService };