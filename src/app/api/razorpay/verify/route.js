// src/app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { Order } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = await request.json();
    
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Fetch the order from our database
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Verify the payment signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    const isValid = expectedSignature === razorpaySignature;
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    // Update the order with payment information
    await order.completePayment(razorpayPaymentId, razorpaySignature);
    
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}