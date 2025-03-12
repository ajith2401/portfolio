// src/app/api/razorpay/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db';
import { Order } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
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
    
    // Check if payment is already completed
    if (order.payment?.status === 'completed') {
      return NextResponse.json(
        { error: 'Payment for this order is already completed' },
        { status: 400 }
      );
    }
    
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.payment.amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: order._id.toString(),
      notes: {
        orderId: order._id.toString(),
        customerName: order.customer.name,
        customerEmail: order.customer.email
      }
    });
    
    return NextResponse.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount / 100, // Convert back to rupees for frontend
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}