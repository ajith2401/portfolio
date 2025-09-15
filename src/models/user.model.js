// src/models/user.model.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor'
  },
  bio: {
    short: String,
    full: String
  },
  social: {
    github: String,
    linkedin: String,
    twitter: String
  },
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Export models
let  User;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', UserSchema);
}

export { User };