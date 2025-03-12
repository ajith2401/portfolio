// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order, PhotoService } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Build query
    const query = {};
    
    // Status filter
    const status = searchParams.get('status');
    if (status) query.status = status;
    
    // Customer email filter (for viewing own orders)
    const email = searchParams.get('email');
    if (email) query['customer.email'] = email;
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('service');
      
    const total = await Order.countDocuments(query);
    
    return NextResponse.json({
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.customer || !data.service) {
      return NextResponse.json(
        { error: 'Customer and service information are required' }, 
        { status: 400 }
      );
    }
    
    // Validate customer fields
    if (!data.customer.name || !data.customer.email || !data.customer.phone) {
      return NextResponse.json(
        { error: 'Customer name, email, and phone are required' }, 
        { status: 400 }
      );
    }
    
    // Verify service exists
    const service = await PhotoService.findById(data.service);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' }, 
        { status: 400 }
      );
    }
    
    // Verify service is available
    if (!service.availability) {
      return NextResponse.json(
        { error: 'This service is currently not available for booking' }, 
        { status: 400 }
      );
    }
    
    // Create new order
    const order = await Order.create(data);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' }, 
      { status: 500 }
    );
  }
}