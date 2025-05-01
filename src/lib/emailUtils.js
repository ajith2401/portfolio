// src/lib/emailUtils.js
import { Resend } from 'resend';
import dns from 'dns';
import { promisify } from 'util';
import connectDB from './db';
import mongoose from 'mongoose';

// Initialize the email client
const resend = new Resend(process.env.RESEND_API_KEY);
const resolveMx = promisify(dns.resolveMx);

/**
 * Validate email by checking MX records
 * This provides better validation than just regex
 * @param {string} email - The email to validate
 * @returns {Promise<boolean>} - Whether the email is valid
 */
export async function validateEmail(email) {
  try {
    // First check basic format with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Extract domain from email
    const domain = email.split('@')[1];
    
    // Check if domain has MX records
    const mxRecords = await resolveMx(domain);
    return Array.isArray(mxRecords) && mxRecords.length > 0;
  } catch (error) {
    console.error(`Email validation error for ${email}:`, error);
    return false;
  }
}

/**
 * Send verification email to subscriber
 * @param {string} email - Recipient email
 * @param {string} token - Verification token
 * @param {Object} preferences - Subscription preferences
 */
export async function sendVerificationEmail(email, token, preferences) {
  try {
    // Generate list of subscribed content types
    const subscriptionList = [];
    if (preferences.blog) subscriptionList.push('Tech Blog');
    if (preferences.quill) subscriptionList.push('Tamil Writings (Quill)');
    
    const subscriptionText = subscriptionList.join(' and ');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ajithkumarr.com';
    const verificationUrl = `${baseUrl}/api/subscribe?token=${token}&action=verify`;
    
    const { data, error } = await resend.emails.send({
      from: 'Ajithkumar <noreply@ajithkumarr.com>',
      to: email,
      subject: 'Verify your subscription to Ajithkumar.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9; font-size: 24px;">Confirm Your Subscription</h1>
          
          <p>Thank you for subscribing to updates from Ajithkumar.com!</p>
          
          <p>You've subscribed to receive updates about: <strong>${subscriptionText}</strong></p>
          
          <p>Please confirm your subscription by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #0ea5e9; color: white; padding: 12px 24px; 
                     text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify My Email
            </a>
          </div>
          
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 14px;">
            If you didn't request this subscription, you can ignore this email.
          </p>
          
          <p style="color: #64748b; font-size: 14px;">
            &copy; ${new Date().getFullYear()} Ajithkumar.com
          </p>
        </div>
      `
    });
    
    if (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send verification email');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

/**
 * Send content notification email to subscribers
 * @param {Array} subscribers - Array of subscriber objects
 * @param {Object} content - Content object with title, excerpt, url, etc.
 * @param {string} contentType - Type of content ('blog' or 'quill')
 */
export async function sendContentNotification(subscribers, content, contentType) {
  try {
    // Prepare email content
    const contentTypeLabel = contentType === 'blog' ? 'Tech Blog' : 'Tamil Writings (Quill)';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ajithkumarr.com';
    const contentUrl = `${baseUrl}/${contentType === 'blog' ? 'blog' : 'quill'}/${content._id}`;
    
    // Filter subscribers by preference and verification status
    const targetSubscribers = subscribers.filter(sub => 
      sub.isVerified && 
      sub.active && 
      sub.preferences[contentType]
    );
    
    const emailPromises = targetSubscribers.map(async (subscriber) => {
      const unsubscribeUrl = `${baseUrl}/api/subscribe?token=${subscriber.unsubscribeToken}&action=unsubscribe`;
      
      return resend.emails.send({
        from: 'Ajithkumar <noreply@ajithkumarr.com>',
        to: subscriber.email,
        subject: `New ${contentTypeLabel}: ${content.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0ea5e9; font-size: 24px;">New ${contentTypeLabel}</h1>
            
            <h2 style="font-size: 20px;">${content.title}</h2>
            
            ${content.images?.medium ? 
              `<div style="margin: 20px 0;">
                <img src="${content.images.medium}" alt="${content.title}" 
                     style="max-width: 100%; height: auto; border-radius: 8px;">
              </div>` : ''
            }
            
            <p>${content.subtitle || content.body?.substring(0, 150) || ''} ...</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${contentUrl}" 
                 style="background-color: #0ea5e9; color: white; padding: 12px 24px; 
                       text-decoration: none; border-radius: 4px; font-weight: bold;">
                Read Full ${contentType === 'blog' ? 'Article' : 'Writing'}
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #64748b; font-size: 14px;">
              You're receiving this email because you subscribed to ${contentTypeLabel} updates from Ajithkumar.com.
            </p>
            
            <p style="color: #64748b; font-size: 14px;">
              <a href="${unsubscribeUrl}" style="color: #64748b;">Unsubscribe</a> | 
              <a href="${baseUrl}" style="color: #64748b;">Visit Website</a>
            </p>
            
            <p style="color: #64748b; font-size: 14px;">
              &copy; ${new Date().getFullYear()} Ajithkumar.com
            </p>
          </div>
        `
      });
    });
    
    const results = await Promise.allSettled(emailPromises);
    
    // Log failed emails
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to send notification to ${targetSubscribers[index].email}:`, result.reason);
      }
    });
    
    return {
      total: targetSubscribers.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };
  } catch (error) {
    console.error('Failed to send notification emails:', error);
    throw error;
  }
}

/**
 * Send welcome email after verification
 * @param {string} email - Recipient email
 * @param {Object} preferences - Subscription preferences
 * @param {string} unsubscribeToken - Token for unsubscribing
 */
export async function sendWelcomeEmail(email, preferences, unsubscribeToken) {
  try {
    // Generate list of subscribed content types
    const subscriptionList = [];
    if (preferences.blog) subscriptionList.push('Tech Blog');
    if (preferences.quill) subscriptionList.push('Tamil Writings (Quill)');
    
    const subscriptionText = subscriptionList.join(' and ');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ajithkumarr.com';
    const unsubscribeUrl = `${baseUrl}/api/subscribe?token=${unsubscribeToken}&action=unsubscribe`;
    
    const { data, error } = await resend.emails.send({
      from: 'Ajithkumar <noreply@ajithkumarr.com>',
      to: email,
      subject: 'Welcome to Ajithkumar.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9; font-size: 24px;">Welcome!</h1>
          
          <p>Thank you for subscribing to updates from Ajithkumar.com!</p>
          
          <p>You're now subscribed to receive updates about: <strong>${subscriptionText}</strong></p>
          
          <p>I'm excited to share my work with you. Here are some links you might find interesting:</p>
          
          <ul>
            <li><a href="${baseUrl}/blog">Tech Blog</a> - Full Stack Development insights</li>
            <li><a href="${baseUrl}/quill">Tamil Writings (Quill)</a> - Explore my literary works</li>
            <li><a href="${baseUrl}/spotlight">Books</a> - Browse my published books</li>
          </ul>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 14px;">
            You can unsubscribe at any time by clicking <a href="${unsubscribeUrl}" style="color: #64748b;">here</a>.
          </p>
          
          <p style="color: #64748b; font-size: 14px;">
            &copy; ${new Date().getFullYear()} Ajithkumar.com
          </p>
        </div>
      `
    });
    
    if (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send welcome email');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

/**
 * Update subscriber preferences
 * @param {string} email - Subscriber email
 * @param {Object} preferences - New subscription preferences
 */
export async function updateSubscriberPreferences(email, preferences) {
  // This function would be used to update preferences on the subscriber's account page
  // Implementation depends on your database setup
  try {
    // Connect to database
    await connectDB();
    
    // Find subscriber by email
    const subscriber = await mongoose.model('Subscriber').findOne({ email });
    
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }
    
    // Update preferences
    subscriber.preferences = preferences;
    await subscriber.save();
    
    return {
      success: true,
      message: 'Preferences updated successfully'
    };
  } catch (error) {
    console.error('Failed to update subscriber preferences:', error);
    throw error;
  }
}