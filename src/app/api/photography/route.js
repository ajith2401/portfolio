// src/app/api/photography/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { PhotoService } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Build query based on parameters
    const query = { status: 'published' };
    
    // Category filter
    const category = searchParams.get('category');
    if (category) query.category = category;
    
    // Featured filter
    const featured = searchParams.get('featured');
    if (featured === 'true') query.featured = true;
    
    // Search text
    const search = searchParams.get('search');
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;
    
    const services = await PhotoService.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await PhotoService.countDocuments(query);
    
    return NextResponse.json({
      services,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    });
  } catch (error) {
    console.error('Error fetching photography services:', error);
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
    if (!data.name || !data.description || !data.category || !data.price) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Create new service
    const service = await PhotoService.create(data);
    
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating photography service:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create service' }, 
      { status: 500 }
    );
  }
}