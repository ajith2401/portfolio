// src/models/subscriber.model.js
import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  preferences: {
    blog: {
      type: Boolean,
      default: true
    },
    quill: {
      type: Boolean,
      default: false
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  verificationToken: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  unsubscribeToken: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
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

// Auto-update the updatedAt field
SubscriberSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

let Subscriber;
try {
  // Try to get the model if it exists
  Subscriber = mongoose.model('Subscriber');
} catch {
  // Otherwise create it
  Subscriber = mongoose.model('Subscriber', SubscriberSchema);
}

export { Subscriber };