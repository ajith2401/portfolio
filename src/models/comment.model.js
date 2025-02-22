// src/models/comment.model.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  // Reference to either Writing or TechBlog
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'parentModel',
    index: true
  },
  // Discriminator field to determine which model to reference
  parentModel: {
    type: String,
    required: true,
    enum: ['Writing', 'TechBlog'],
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  isEdited: {
    type: Boolean,
    default: false
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
});

// Update timestamp on edit
CommentSchema.pre('save', function(next) {
  if (this.isModified('comment')) {
    this.isEdited = true;
  }
  this.updatedAt = new Date();
  next();
});

// Add virtual for getting parent document
CommentSchema.virtual('parent', {
  ref: function() {
    return this.parentModel;
  },
  localField: 'parentId',
  foreignField: '_id',
  justOne: true
});

// Add statics for common queries
CommentSchema.statics.findByParent = function(parentId, parentModel) {
  return this.find({
    parentId,
    parentModel,
    status: 'approved'
  }).sort({ createdAt: -1 });
};

CommentSchema.statics.findPendingComments = function() {
  return this.find({
    status: 'pending'
  }).sort({ createdAt: 1 });
};

// Instance method to approve comment
CommentSchema.methods.approve = async function() {
  this.status = 'approved';
  return this.save();
};

// Instance method to reject comment
CommentSchema.methods.reject = async function() {
  this.status = 'rejected';
  return this.save();
};

// Use a try-catch to handle model registration
let Comment;
try {
  Comment = mongoose.model('Comment');
} catch {
  Comment = mongoose.model('Comment', CommentSchema);
}

export { Comment };