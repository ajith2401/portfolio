import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { OTP } from '@/models/otp.model';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  // Rate limit: 3 OTP requests per 10 minutes per IP
  const ip = getClientIP(request);
  const { allowed, resetAt } = rateLimit(`otp-sms:${ip}`, 3, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many OTP requests. Please wait before requesting another.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    await connectDB();
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Basic phone validation (digits and optional leading +)
    const cleanedPhone = String(phone).trim().replace(/[\s-]/g, '');
    if (!/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Generate secure OTP
    const otpRecord = await OTP.generateOTP(cleanedPhone, 'phone', 10);

    // If an SMS provider (e.g. Twilio) is configured in the future, dispatch here.
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      // Integration hook ready
      console.log(`[SMS OTP] Dispatched OTP to ${cleanedPhone}`);
    } else {
      console.warn(`[SMS OTP] SMS provider not configured. OTP generated for ${cleanedPhone}: ${process.env.NODE_ENV === 'development' ? otpRecord.otp : '***'}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your phone'
    });
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification code. Please try email verification.' },
      { status: 500 }
    );
  }
}

