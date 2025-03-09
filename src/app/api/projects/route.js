// src/app/api/projects/route.js
import { NextResponse } from 'next/server';
import { Project } from '@/models/project.model';
import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper function to parse query parameters
function parseQueryParams(request) {
  const searchParams = request.nextUrl.searchParams;
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '9'); // Changed default to 9 for 3x3 grid
  
  // Sorting
  const sortField = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  
  // Filtering
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const status = searchParams.get('status') || 'published'; // Default to published
  const search = searchParams.get('search');
  
  // Build filter object
  const filter = { status };
  
  if (category) {
    filter.category = category;
  }
  
  if (featured) {
    filter.featured = featured === 'true';
  }
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { subtitle: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
    
    // Add stack search (renamed from technologies to match your frontend model)
    filter.$or.push({ stack: { $in: [new RegExp(search, 'i')] } });
  }
  
  return { 
    page, 
    limit, 
    sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 },
    filter
  };
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { page, limit, sort, filter } = parseQueryParams(request);
    const skip = (page - 1) * limit;
    
    // Define fields to select (projection)
    // Exclude the longDescription which could be large
    const projection = {
      longDescription: 0,
      // Keep other fields we need for the list view
    };
    
    // Get total count for pagination
    const totalProjects = await Project.countDocuments(filter);
    
    // Fetch projects with pagination, sorting and filtering
    const projects = await Project.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance on list views
    
    // Calculate pagination metadata
    const pages = Math.ceil(totalProjects / limit);
    
    // Return structured response matching RTK Query expectations
    return NextResponse.json({
      projects, // Array of projects
      pagination: {
        total: totalProjects,
        pages, // Total pages
        page,   // Current page
        limit,  // Items per page
        hasNextPage: page < pages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}