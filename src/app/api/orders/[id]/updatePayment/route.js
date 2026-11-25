// src/app/api/orders/[id]/updatePayment/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request, props) {
  const params = await props.params;
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
    if (typeof razorpayOrderId !== 'string' || razorpayOrderId.length > 100 || !/^[A-Za-z0-9_]+$/.test(razorpayOrderId)) {
      return NextResponse.json({ error: 'Invalid Razorpay order ID' }, { status: 400 });
    }
    // Never rewrite the payment reference of an order that is already settled.
    if (order.payment?.status === 'paid' || order.payment?.status === 'completed') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 409 });
    }

    order.payment.razorpayOrderId = razorpayOrderId;
    await order.save();

    // Do not echo the order (it contains customer PII).
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating payment information:', error);
    return NextResponse.json(
      { error: 'Failed to update payment information' },
      { status: 500 }
    );
  }
}