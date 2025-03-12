// src/models/otp.model.js
import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  // The contact information (email or phone) to which OTP was sent
  contactInfo: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  // Type of contact - either 'email' or 'phone'
  contactType: {
    type: String,
    required: true,
    enum: ['email', 'phone']
  },
  
  // The actual OTP code
  otp: {
    type: String,
    required: true
  },
  
  // When the OTP was created
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Expiration time for the OTP
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  
  // Whether the OTP has been verified already
  verified: {
    type: Boolean,
    default: false
  },
  
  // Number of verification attempts
  attempts: {
    type: Number,
    default: 0
  }
});

// Set TTL index to automatically delete expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance method to verify an OTP
OTPSchema.methods.verifyOTP = function(inputOTP) {
  if (this.expiresAt < new Date()) {
    return {
      success: false,
      message: 'OTP has expired'
    };
  }
  
  if (this.verified) {
    return {
      success: false,
      message: 'OTP has already been used'
    };
  }
  
  // Increment attempt counter
  this.attempts += 1;
  
  // Maximum attempts allowed (e.g., 5)
  if (this.attempts > 5) {
    return {
      success: false,
      message: 'Maximum verification attempts exceeded'
    };
  }
  
  // Compare OTP
  if (this.otp === inputOTP) {
    this.verified = true;
    return {
      success: true,
      message: 'OTP verified successfully'
    };
  }
  
  return {
    success: false,
    message: 'Invalid OTP'
  };
};

// Static method to generate a new OTP
OTPSchema.statics.generateOTP = async function(contactInfo, contactType, expiryMinutes = 10) {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Calculate expiry time
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);
  
  // First, invalidate any existing OTPs for this contact
  await this.updateMany(
    { 
      contactInfo,
      contactType,
      verified: false 
    },
    { 
      $set: { verified: true } 
    }
  );
  
  // Create a new OTP record
  const otpRecord = await this.create({
    contactInfo,
    contactType,
    otp,
    expiresAt
  });
  
  return otpRecord;
};

// Static method to find and validate an OTP
OTPSchema.statics.validateOTP = async function(contactInfo, contactType, inputOTP) {
  const otpRecord = await this.findOne({
    contactInfo,
    contactType,
    verified: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });
  
  if (!otpRecord) {
    return {
      success: false,
      message: 'No valid OTP found'
    };
  }
  
  const result = otpRecord.verifyOTP(inputOTP);
  
  // Save the record with updated attempts/verified status
  await otpRecord.save();
  
  return result;
};

// Use a try-catch to handle model registration
let OTP;
try {
  OTP = mongoose.model('OTP');
} catch {
  OTP = mongoose.model('OTP', OTPSchema);
}

export { OTP };