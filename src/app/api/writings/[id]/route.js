// src/app/api/writings/[id]/route.js - Enhanced error handling
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing } from '@/models';
import { isValidObjectId } from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    // Validate ObjectId format before database query
    if (!params.id || !isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Invalid writing ID format' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const writing = await Writing.findById(params.id)
      .populate('category')
      .lean(); // Use lean() for better performance
    
    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      );
    }
    
    // Add cache headers for better performance
    return NextResponse.json(writing, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error fetching writing:', {
      id: params.id,
      error: error.message,
      stack: error.stack
    });
    
    // Return 500 for server errors, not 404
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}
