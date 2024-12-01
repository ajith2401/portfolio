// src/app/api/writings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing, Comment } from '@/models';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Build query based on parameters
    const query = {};
    const sort = {};
    
    // Category filter
    const category = searchParams.get('category');
    if (category) query.category = category;
    
    // Date filter
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Search text
    const search = searchParams.get('search');
    if (search) {
      query.$text = { $search: search };
    }
    
    // Sorting
    const sortBy = searchParams.get('sortBy');
    if (sortBy === 'rating') {
      sort.averageRating = -1;
    } else if (sortBy === 'date') {
      sort.createdAt = -1;
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;
    
    const writings = await Writing.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } }
      });
      
    const total = await Writing.countDocuments(query);
    
    return NextResponse.json({
      writings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    });
  } catch (error) {
    console.error('Error fetching writings:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Parse the incoming form data
    const formData = await request.formData();
    
    // Get the writing data and parse it from JSON string
    const writingData = formData.get('writing');
    if (!writingData) {
      return NextResponse.json(
        { error: 'Writing data is required' },
        { status: 400 }
      );
    }

    let writing;
    try {
      writing = JSON.parse(writingData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid writing data format' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!writing.title || !writing.category || !writing.body) {
      return NextResponse.json(
        { error: 'Title, category, and body are required' },
        { status: 400 }
      );
    }

    // Handle image upload if present
    const imageFile = formData.get('image');
    if (imageFile) {
      try {
        // Convert file to buffer/base64 if needed by your cloudinary setup
        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64Image}`;
        
        const images = await uploadImage(dataURI);
        writing.images = images;
      } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Set initial values
    writing.averageRating = 0;
    writing.totalRatings = 0;
    writing.ratings = [];
    writing.comments = [];

    // Create the writing
    const newWriting = await Writing.create(writing);

    // Populate comments if any
    const populatedWriting = await newWriting.populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } }
    });

    return NextResponse.json(populatedWriting, { status: 201 });

  } catch (error) {
    console.error('Error creating writing:', error);
    
    // Handle Mongoose validation errors
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

// Increase payload size limit for the route
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
    sizeLimit: '10mb', // Set maximum request size
  },
};