// src/models/subscriber.model.js
import mongoose from 'mongoose';
import crypto from 'crypto';

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
    default: () => crypto.randomBytes(32).toString('hex')
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
  Subscriber = mongoose.model('Subscriber');
} catch {
  Subscriber = mongoose.model('Subscriber', SubscriberSchema);
}

export { Subscriber };
