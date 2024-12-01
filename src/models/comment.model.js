// src/models/comment.model.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  writing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Writing',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  comment: {
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
    default: Date.now,
    index: true
  }
});

// Use a try-catch to handle model registration
let Comment;
try {
  Comment = mongoose.model('Comment');
} catch {
  Comment = mongoose.model('Comment', CommentSchema);
}

export { Comment };