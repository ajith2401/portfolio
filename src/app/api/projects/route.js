import { NextResponse } from 'next/server';
import { Project } from '@/models/project.model';
import connectDB from '@/lib/db';

// Helper function to parse query parameters
function parseQueryParams(request) {
  const searchParams = new URL(request.url).searchParams;
  
  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  // Sorting
  const sortField = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  
  // Filtering
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  
  return { 
    page, 
    limit, 
    sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 },
    filter: {
      ...(category && { category }),
      ...(featured && { featured: featured === 'true' }),
      ...(status && { status }),
      ...(search && { 
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { longDescription: { $regex: search, $options: 'i' } },
          { technologies: { $in: [new RegExp(search, 'i')] } }
        ]
      })
    }
  };
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { page, limit, sort, filter } = parseQueryParams(request);
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalProjects = await Project.countDocuments(filter);
    
    // Fetch projects with pagination, sorting and filtering
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Build pagination metadata
    const totalPages = Math.ceil(totalProjects / limit);
    
    return NextResponse.json({
      status: 'success',
      data: {
        projects,
        pagination: {
          total: totalProjects,
          page,
          limit,
          totalPages,
          hasMore: page < totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
