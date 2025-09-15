// src/models/analytics.model.js
import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  pageViews: {
    type: Map,
    of: Number,
    default: new Map()
  },
  visitors: {
    type: Number,
    default: 0
  },
  popularPosts: [{
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'postModel'
    },
    postModel: {
      type: String,
      enum: ['TechBlog', 'Writing', 'Project']
    },
    views: Number
  }],
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Export models
let Analytics;
try {
  Analytics = mongoose.model('Analytics');
} catch {
  Analytics = mongoose.model('Analytics', AnalyticsSchema);
}

export { Analytics };