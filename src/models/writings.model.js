// src/models/writings.model.js
import mongoose from 'mongoose';

const WritingSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'philosophy', 'poem', 'article', 'short story',
      'short writings', 'politics', 'cinema', 'letter', 'joke'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    required: true,
    index: true
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
    default: Date.now,
    index: true
  }
});

WritingSchema.index({ title: 'text', body: 'text' });

WritingSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = (sum / this.ratings.length).toFixed(1);
  this.totalRatings = this.ratings.length;
};

WritingSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

WritingSchema.methods.addRating = async function(name, email, rating) {
  const existingRating = this.ratings.find(r => r.email === email);
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.name = name;
  } else {
    this.ratings.push({ name, email, rating });
  }
  
  this.calculateAverageRating();
  await this.save();
};

// Use a try-catch to handle model registration
let Writing;
try {
  Writing = mongoose.model('WritingTest');
} catch {
  Writing = mongoose.model('WritingTest', WritingSchema);
}

export { Writing };