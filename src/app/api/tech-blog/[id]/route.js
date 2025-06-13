// src/app/api/tech-blog/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TechBlog } from '@/models';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper function to validate slug
function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// GET - Fetch single blog post
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { 
          error: 'Blog ID is required',
          code: 'MISSING_ID' 
        },
        { status: 400 }
      );
    }

    let blog;
    
    // Try to find by slug first (SEO-friendly URLs)
    if (isValidSlug(id)) {
      blog = await TechBlog.findOne({ 
        slug: id, 
        status: 'published' 
      }).populate('author', 'name email bio');
    }
    // Fallback to ObjectId for existing URLs (temporary support)
    else if (isValidObjectId(id)) {
      blog = await TechBlog.findOne({ 
        _id: id, 
        status: 'published' 
      }).populate('author', 'name email bio');
    }
    // Invalid format
    else {
      return NextResponse.json(
        { 
          error: 'Invalid blog identifier format',
          code: 'INVALID_FORMAT',
          message: 'Blog identifier must be a valid slug or ObjectId'
        },
        { status: 400 }
      );
    }

    if (!blog) {
      return NextResponse.json(
        { 
          error: 'Blog post not found',
          code: 'NOT_FOUND',
          message: 'The requested blog post does not exist or is not published'
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=300' // Cache 404s for 5 minutes
          }
        }
      );
    }

    // Increment view count asynchronously (don't wait)
    blog.incrementViews().catch(err => 
      console.error('Error incrementing blog views:', err)
    );

    // Prepare response with additional SEO data
    const responseData = {
      ...blog.toObject(),
      url: blog.url,
      readTimeText: blog.readTimeText,
      // Add canonical URL for SEO
      canonicalUrl: `https://www.ajithkumarr.com/blog/${blog.slug || blog._id}`,
      // Add structured data hints
      seoData: {
        '@type': 'Article',
        headline: blog.title,
        description: blog.metaDescription || blog.excerpt,
        author: blog.author?.name || 'Ajithkumar',
        datePublished: blog.publishedAt,
        dateModified: blog.updatedAt,
        wordCount: blog.wordCount,
        readingTime: `PT${blog.readTime}M`
      }
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'ETag': `"${blog._id}-${blog.updatedAt.getTime()}"`,
        'Last-Modified': blog.updatedAt.toUTCString(),
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('Blog API GET Error:', {
      message: error.message,
      stack: error.stack,
      params: params,
      timestamp: new Date().toISOString()
    });

    // Database connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          code: 'DB_CONNECTION_ERROR',
          message: 'Please try again in a moment'
        },
        { status: 503 }
      );
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          details: Object.values(error.errors).map(err => err.message)
        },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

// PUT - Update blog post (for admin use)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const updates = await request.json();

    if (!id || (!isValidObjectId(id) && !isValidSlug(id))) {
      return NextResponse.json(
        { error: 'Valid blog ID is required' },
        { status: 400 }
      );
    }

    // Find blog by slug or ObjectId
    let blog;
    if (isValidSlug(id)) {
      blog = await TechBlog.findOne({ slug: id });
    } else {
      blog = await TechBlog.findById(id);
    }

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Update blog with new data
    Object.assign(blog, updates);
    await blog.save();

    return NextResponse.json({
      message: 'Blog updated successfully',
      blog: blog.toObject(),
      canonicalUrl: `https://www.ajithkumarr.com/blog/${blog.slug || blog._id}`
    });

  } catch (error) {
    console.error('Blog API PUT Error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: Object.values(error.errors).map(err => err.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post (for admin use)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;

    if (!id || (!isValidObjectId(id) && !isValidSlug(id))) {
      return NextResponse.json(
        { error: 'Valid blog ID is required' },
        { status: 400 }
      );
    }

    let result;
    if (isValidSlug(id)) {
      result = await TechBlog.findOneAndDelete({ slug: id });
    } else {
      result = await TechBlog.findByIdAndDelete(id);
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog post deleted successfully',
      deletedId: result._id
    });

  } catch (error) {
    console.error('Blog API DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

// OPTIONS - Handle CORS preflight
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 