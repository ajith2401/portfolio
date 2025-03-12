// src/app/api/otp/send-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/db';
import { OTP } from '@/models/otp.model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Create a nodemailer transporter
const createTransporter = () => {
  // For production, use your actual SMTP settings
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Use app password for Gmail
    },
  });
};

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Generate new OTP with 10 minute expiry
    const otpRecord = await OTP.generateOTP(email, 'email', 10);
    
    // Create email transporter
    const transporter = createTransporter();
    
    // Send email with OTP
    await transporter.sendMail({
      from: `"Photography Studio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code for Your Booking",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 10px;">Verification Code</h2>
            <p style="color: #666; margin-bottom: 20px;">Use the following code to verify your email address</p>
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; font-size: 32px; letter-spacing: 5px; color: #4F46E5; font-weight: bold;">
              ${otpRecord.otp}
            </div>
          </div>
          <p style="color: #666; margin-bottom: 10px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
            If you did not request this verification code, please ignore this email.
          </p>
        </div>
      `
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent to your email' 
    });
    
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}