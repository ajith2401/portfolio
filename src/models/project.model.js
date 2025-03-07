// src/models/project.model.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  technologies: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    required: true,
    enum: ['AI/ML', 'web', 'mobile', 'backend', 'devops', 'other'], // Added AI/ML based on your example
  },
  images: {
    small: String,
    medium: String,
    large: String,
    thumbnail: String,
    banner: String,
    gallery: [String],
  },
  stack: [{ // To store stack/technologies used in the project
    type: String,
  }],
  achievement: {
    type: String, // To store achievements like prize winnings
  },
  stats: {
    users: String, // To store the number of users, accuracy, etc.
    accuracy: String,
    schemes: String,
  },
  features: [{
    type: String,
  }],
  challenges: [{
    type: String,
  }],
  links: {
    github: String,
    live: String,
    demo: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

let Project;
try {
  Project = mongoose.model('Project');
} catch {
  Project = mongoose.model('Project', ProjectSchema);
}

export { Project };
