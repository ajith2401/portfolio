// src/app/api/tech-blog/route.js 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TechBlog } from '@/models';

// Add this to prevent static generation attempts
export const dynamic = 'force-dynamic';

// GET all tech blogs with pagination
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9'); // Default 9 for 3x3 grid
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');
    
    // Build query object
    const query = { status };
    
    if (category) {
      query.category = category;
    }
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
      
      // If you have tags, add them to search
      query.$or.push({ tags: { $in: [new RegExp(search, 'i')] } });
    }
    
    // Count total documents for pagination
    const totalBlogs = await TechBlog.countDocuments(query);
    
    // Define projection to exclude large content field from list view
    const projection = {
      content: 0, // Exclude full content for better performance
      // Include all other necessary fields
    };
    
    // Fetch blogs with pagination
    const techBlogs = await TechBlog.find(query, projection)
      .sort({ publishedAt: -1, createdAt: -1 }) // Sort by publish date, then creation date
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance
    
    // Calculate pagination metadata
    const pages = Math.ceil(totalBlogs / limit);
    
    // Return structured response matching RTK Query expectations
    return NextResponse.json({
      techBlogs, // Array of blog posts
      pagination: {
        total: totalBlogs,
        pages, // Total pages
        page,   // Current page
        limit,  // Items per page
        hasNextPage: page < pages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching tech blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech blogs' },
      { status: 500 }
    );
  }
}

// // POST new tech blog
// export async function POST(request) {
//   try {
//     await connectDB();
    
//     const data = await request.json();
//     const blog = await TechBlog.create(data);
    
//     return NextResponse.json(blog, { status: 201 });
//   } catch (error) {
//     console.error('Error creating tech blog:', error);
//     return NextResponse.json(
//       { error: 'Failed to create tech blog' },
//       { status: 500 }
//     );
//   }
// }
