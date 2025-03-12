// src/app/api/orders/[id]/updatePayment/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const { razorpayOrderId } = await request.json();
    
    if (!razorpayOrderId) {
      return NextResponse.json(
        { error: 'Razorpay order ID is required' },
        { status: 400 }
      );
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update payment information
    order.payment.razorpayOrderId = razorpayOrderId;
    await order.save();
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating payment information:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}