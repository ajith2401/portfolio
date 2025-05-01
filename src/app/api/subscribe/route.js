// src/app/api/subscribe/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { sendVerificationEmail, sendWelcomeEmail, validateEmail } from '@/lib/emailUtils';
// import { validateEmail, sendVerificationEmail, sendWelcomeEmail 
// Define subscriber schema
let Subscriber;
try {
  // Try to get the model if it exists
  Subscriber = mongoose.model('Subscriber');
} catch {
  // Otherwise create it
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

  // Create the model
  Subscriber = mongoose.model('Subscriber', SubscriberSchema);
}

// Helper function to generate verification token
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


export async function POST(request) {
  try {
    await connectDB();
    
    const { email, preferences } = await request.json();
    
    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Valid email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format and MX records
    const isValidEmail = await validateEmail(email);
    if (!isValidEmail) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { message: 'Preferences are required' }, 
        { status: 400 }
      );
    }
    
    if (!preferences.blog && !preferences.quill) {
      return NextResponse.json(
        { message: 'At least one subscription preference must be selected' },
        { status: 400 }
      );
    }
    
    // Generate verification token
    const verificationToken = generateToken();
    
    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email });
    
    if (subscriber) {
      // Update existing subscriber
      subscriber.preferences = preferences;
      subscriber.active = true;
      
      // Only regenerate verification token if not already verified
      if (!subscriber.isVerified) {
        subscriber.verificationToken = verificationToken;
      }
      
      await subscriber.save();
    } else {
      // Create new subscriber
      subscriber = await Subscriber.create({
        email,
        preferences,
        verificationToken,
        isVerified: false,
        active: true
      });
    }
    
    // Send verification email if not already verified
    if (!subscriber.isVerified) {
      await sendVerificationEmail(email, verificationToken, preferences);
    }
    
    // Return success response
    return NextResponse.json({
      message: 'Subscription successful!',
      isVerified: subscriber.isVerified,
      needsVerification: !subscriber.isVerified
    });
  } catch (error) {
    console.error('Subscription error:', error);
    
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'You are already subscribed with this email address' },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: errors.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// GET route for unsubscribing
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const action = searchParams.get('action') || 'verify';
    
    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }
    
    if (action === 'verify') {
      // Verify email
      const subscriber = await Subscriber.findOne({ verificationToken: token });
      
      if (!subscriber) {
        return NextResponse.json(
          { message: 'Invalid or expired verification token' },
          { status: 400 }
        );
      }
      
      subscriber.isVerified = true;
      subscriber.verificationToken = null;
      await subscriber.save();
      
      // Send welcome email
      try {
        await sendWelcomeEmail(
          subscriber.email, 
          subscriber.preferences, 
          subscriber.unsubscribeToken
        );
      } catch (error) {
        console.error('Error sending welcome email:', error);
        // Continue with verification even if welcome email fails
      }
      
      // Redirect to thank you page
      return NextResponse.redirect(new URL('/subscription-verified', request.url));
    } else if (action === 'unsubscribe') {
      // Unsubscribe
      const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
      
      if (!subscriber) {
        return NextResponse.json(
          { message: 'Invalid unsubscribe token' },
          { status: 400 }
        );
      }
      
      subscriber.active = false;
      await subscriber.save();
      
      // Redirect to unsubscribe confirmation page
      return NextResponse.redirect(new URL('/unsubscribed', request.url));
    }
    
    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    );
  }
}