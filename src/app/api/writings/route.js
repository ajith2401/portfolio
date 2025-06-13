// src/app/api/writings/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing, Comment } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'date';
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { status };
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { averageRating: -1, createdAt: -1 };
        break;
      case 'alphabetical':
        sort = { title: 1 };
        break;
      case 'date':
      default:
        sort = { createdAt: -1 };
    }
    
    // Fetch writings without populating comments (since they don't exist in schema)
    const writings = await Writing.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalWritings = await Writing.countDocuments(query);
    
    // Manually fetch comments for each writing
    const writingsWithComments = await Promise.all(
      writings.map(async (writing) => {
        try {
          // Fetch comments using the Comment model
          const comments = await Comment.find({
            parentId: writing._id,
            parentModel: 'Writing',
            status: 'approved'
          })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();
          
          return {
            ...writing,
            comments: comments || []
          };
        } catch (commentError) {
          console.error(`Error fetching comments for writing ${writing._id}:`, commentError);
          return {
            ...writing,
            comments: []
          };
        }
      })
    );
    
    return NextResponse.json({
      writings: writingsWithComments,
      pagination: {
        page,
        limit,
        total: totalWritings,
        pages: Math.ceil(totalWritings / limit),
        hasNext: page < Math.ceil(totalWritings / limit),
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching writings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch writings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const writingData = await request.json();
    
    // Validate required fields
    if (!writingData.title || !writingData.category || !writingData.body) {
      return NextResponse.json(
        { error: 'Title, category, and body are required' },
        { status: 400 }
      );
    }
    
    // Set initial values
    writingData.averageRating = 0;
    writingData.totalRatings = 0;
    writingData.status = writingData.status || 'published';
    
    // Create the writing
    const newWriting = await Writing.create(writingData);
    
    return NextResponse.json(newWriting, { status: 201 });
    
  } catch (error) {
    console.error('Error creating writing:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create writing' },
      { status: 500 }
    );
  }
}