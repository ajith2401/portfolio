// models/Comment.js 
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    writing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Writing',
      required: true
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
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

module.exports = Comment;