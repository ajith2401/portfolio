// src/lib/notificationHandler.js
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

/**
 * Send notifications for new content
 * @param {Object} content - The newly published content (blog post or writing)
 * @param {String} contentType - Type of content ('blog' or 'quill')
 * @returns {Promise<Object>} - Result of notification sending
 */
export async function sendContentNotifications(content, contentType) {
  try {
    // Connect to database
    await connectDB();
    
    // Check if Subscriber model exists
    let Subscriber;
    try {
      Subscriber = mongoose.model('Subscriber');
    } catch (error) {
      console.error('Subscriber model not found:', error);
      return {
        success: false,
        error: 'Subscriber model not found'
      };
    }
    
    // Get verified and active subscribers with matching preferences
    const subscribers = await Subscriber.find({
      [`preferences.${contentType}`]: true,
      isVerified: true,
      active: true
    });
    
    if (!subscribers || subscribers.length === 0) {
      return {
        success: true,
        sent: 0,
        message: 'No subscribers found for this content type'
      };
    }
    
    // Send notifications
    const notificationResult = await sendContentNotification(
      subscribers,
      content,
      contentType
    );
    
    return {
      success: true,
      sent: notificationResult.successful,
      total: notificationResult.total,
      failed: notificationResult.failed
    };
  } catch (error) {
    console.error('Error sending content notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Trigger notifications when a blog post is published
 * Intended to be called when a blog post status changes to 'published'
 * @param {Object} blogPost - The blog post being published
 * @returns {Promise<Object>} - Result of notification sending
 */
export async function notifyBlogSubscribers(blogPost) {
  return sendContentNotifications(blogPost, 'blog');
}

/**
 * Trigger notifications when a writing is published
 * Intended to be called when a writing is created or updated
 * @param {Object} writing - The writing being published
 * @returns {Promise<Object>} - Result of notification sending
 */
export async function notifyWritingSubscribers(writing) {
  return sendContentNotifications(writing, 'quill');
}