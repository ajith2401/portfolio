// src/app/api/writings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing, Comment } from '@/models';
import { uploadImage } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Build query based on parameters
    const query = {};
    const sort = {};
    
    // Category filter - make case insensitive
    let category = searchParams.get('category');
    if (category && category.toLowerCase() !== 'all writings') {
      // Using regex for case-insensitive search
      query.category = new RegExp(category, 'i');
    }
    
    // Date filter - enhanced with proper date handling
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (startDate || endDate) {
      query.createdAt = {};
      
      if (startDate) {
        // Set to beginning of the day (00:00:00)
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      
      if (endDate) {
        // Set to end of the day (23:59:59)
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }
    
    // Search text - improved search functionality
    const search = searchParams.get('search');
    if (search && search.trim() !== '') {
      // Check if the database has text index setup
      // If not, use OR conditions for title and body
      try {
        query.$text = { $search: search };
      } catch (err) {
        // Fallback if text search is not available
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { title: searchRegex },
          { body: searchRegex },
          { category: searchRegex }
        ];
      }
    }
    
    // Sorting - enhanced with more options
    const sortBy = searchParams.get('sortBy') || 'date'; // Default to date
    
    switch(sortBy) {
      case 'rating':
        // Sort by rating (highest first)
        sort.averageRating = -1;
        // Secondary sort by date if ratings are equal
        sort.createdAt = -1;
        break;
      
      case 'oldest':
        // Sort by oldest first
        sort.createdAt = 1;
        break;
        
      case 'title':
        // Sort alphabetically by title
        sort.title = 1;
        break;
        
      case 'date':
      default:
        // Default sort: newest first
        sort.createdAt = -1;
        break;
    }
    
    // Pagination - validate input values
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    // Ensure these are valid numbers
    let page = 1;
    if (pageParam) {
      const parsedPage = parseInt(pageParam);
      page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    }
    
    let limit = 12;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      limit = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 50) : 12;
    }
    
    const skip = (page - 1) * limit;
    
    // Log query for debugging if needed
    // console.log('Query:', JSON.stringify(query), 'Sort:', JSON.stringify(sort));
    
    // Execute the query with pagination
    const writings = await Writing.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } }
      });
      
    // Get total count for pagination
    const total = await Writing.countDocuments(query);
    
    // Calculate total pages (minimum of 1)
    const totalPages = Math.max(1, Math.ceil(total / limit));
    
    // If requested page exceeds total pages, adjust to the last page
    const currentPage = page > totalPages ? totalPages : page;
    
    return NextResponse.json({
      writings,
      pagination: {
        total,
        pages: totalPages,
        current: currentPage,
        limit
      },
      filters: {
        category: category || null,
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null,
        sortBy
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
// export async function POST(request) {
//   try {
//     await connectDB();

//     // Parse the incoming form data
//     const formData = await request.formData();
    
//     // Get the writing data and parse it from JSON string
//     const writingData = formData.get('writing');
//     if (!writingData) {
//       return NextResponse.json(
//         { error: 'Writing data is required' },
//         { status: 400 }
//       );
//     }

//     let writing;
//     try {
//       writing = JSON.parse(writingData);
//     } catch (error) {
//       return NextResponse.json(
//         { error: 'Invalid writing data format' },
//         { status: 400 }
//       );
//     }

//     // Validate required fields
//     if (!writing.title || !writing.category || !writing.body) {
//       return NextResponse.json(
//         { error: 'Title, category, and body are required' },
//         { status: 400 }
//       );
//     }

//     // Handle image upload if present
//     const imageFile = formData.get('image');
//     if (imageFile) {
//       try {
//         // Convert file to buffer/base64 if needed by your cloudinary setup
//         const buffer = await imageFile.arrayBuffer();
//         const base64Image = Buffer.from(buffer).toString('base64');
//         const dataURI = `data:${imageFile.type};base64,${base64Image}`;
        
//         const images = await uploadImage(dataURI);
//         writing.images = images;
//       } catch (error) {
//         console.error('Image upload error:', error);
//         return NextResponse.json(
//           { error: 'Failed to upload image' },
//           { status: 500 }
//         );
//       }
//     }

//     // Set initial values
//     writing.averageRating = 0;
//     writing.totalRatings = 0;
//     writing.ratings = [];
//     writing.comments = [];

//     // Create the writing
//     const newWriting = await Writing.create(writing);

//     // Populate comments if any
//     const populatedWriting = await newWriting.populate({
//       path: 'comments',
//       options: { sort: { createdAt: -1 } }
//     });

//     return NextResponse.json(populatedWriting, { status: 201 });

//   } catch (error) {
//     console.error('Error creating writing:', error);
    
//     // Handle Mongoose validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return NextResponse.json(
//         { error: 'Validation failed', details: validationErrors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to create writing' },
//       { status: 500 }
//     );
//   }
// }