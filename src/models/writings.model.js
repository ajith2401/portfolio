// models/Writing.js
import mongoose from 'mongoose';

const WritingSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['philosophy', 'poem', 'story', 'article']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  images: {
    small: String,
    medium: String,
    large: String
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  ratings: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add method to calculate average rating
WritingSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = sum / this.ratings.length;
  this.totalRatings = this.ratings.length;
};

// Middleware to update average rating before saving
WritingSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

// Helper method to add new rating
WritingSchema.methods.addRating = async function(name, email, rating) {
  // Check if user has already rated
  const existingRating = this.ratings.find(r => r.email === email);
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.name = name; // Update name in case it changed
  } else {
    this.ratings.push({ name, email, rating });
  }
  
  this.calculateAverageRating();
  await this.save();
};


export const Writing = mongoose.models.Writing || mongoose.model('Writing', WritingSchema);


