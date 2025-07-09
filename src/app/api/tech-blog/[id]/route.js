// src/app/api/tech-blog/[id]/route.js
import { NextResponse } from 'next/server';
import { TechBlog } from '@/models/techblog.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper to log API requests for monitoring
function logRequest(method, identifier, userAgent, clientIP, result) {
  const timestamp = new Date().toISOString();
  console.log(`[API] ${timestamp} | ${method} /api/tech-blog/${identifier} | ${result} | IP: ${clientIP} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

// GET a single tech blog post by slug or ObjectId
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Input validation
    if (!id || id.trim() === '') {
      logRequest('GET', id, userAgent, clientIP, '400-INVALID');
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid blog post identifier',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }
    
    let techBlog;
    let foundByObjectId = false;
    
    // Check if it's a valid ObjectId first
    if (isValidObjectId(id)) {
      foundByObjectId = true;
      techBlog = await TechBlog.findById(id);
      
      // If found by ObjectId and has slug, redirect to slug URL
      if (techBlog && techBlog.slug) {
        logRequest('GET', id, userAgent, clientIP, '301-REDIRECT');
        
        const slugUrl = new URL(request.url);
        slugUrl.pathname = `/api/tech-blog/${techBlog.slug}`;
        
        return NextResponse.redirect(slugUrl, {
          status: 301,
          headers: {
            'Cache-Control': 'public, max-age=3600',
            'X-Redirect-Reason': 'ObjectId-to-Slug'
          }
        });
      }
      
      // If found by ObjectId but no slug, still return it (migration period)
      if (techBlog && !techBlog.slug) {
        logRequest('GET', id, userAgent, clientIP, '200-OBJECTID-NO-SLUG');
        
        return NextResponse.json({
          status: 'success',
          data: { techBlog },
          meta: {
            accessedBy: 'objectId',
            hasSlug: false,
            warning: 'This URL format will be deprecated. Please use slug-based URLs.'
          }
        }, {
          headers: {
            'X-Robots-Tag': 'noindex', // Don't index ObjectId responses
            'Cache-Control': 'private, max-age=300' // Short cache for ObjectId URLs
          }
        });
      }
      
      // If not found by ObjectId, log and continue to slug search
      if (!techBlog) {
        logRequest('GET', id, userAgent, clientIP, 'OBJECTID-NOT-FOUND');
      }
    }
    
    // If not found by ObjectId or not an ObjectId, try slug search
    if (!techBlog) {
      techBlog = await TechBlog.findOne({ 
        slug: id.toLowerCase().trim(),
        status: 'published' // Only return published posts
      });
      
      if (techBlog) {
        logRequest('GET', id, userAgent, clientIP, '200-SLUG');
      }
    }
    
    // If still not found, return 404
    if (!techBlog) {
      logRequest('GET', id, userAgent, clientIP, '404-NOT-FOUND');
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Tech blog post not found',
          code: 'NOT_FOUND',
          suggestions: [
            'Check if the URL is correct',
            'Visit /blog to browse all tech blog posts',
            'Use the search function to find specific content'
          ]
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=300' // Short cache for 404s
          }
        }
      );
    }
    
    // Increment view count (async, don't wait)
    TechBlog.findByIdAndUpdate(
      techBlog._id,
      { $inc: { 'performance.views': 1 } },
      { new: false }
    ).catch(err => {
      console.error('Error incrementing view count:', err);
    });
    
    // Return successful response
    return NextResponse.json({
      status: 'success',
      data: { techBlog },
      meta: {
        accessedBy: foundByObjectId ? 'objectId' : 'slug',
        hasSlug: !!techBlog.slug,
        canonicalUrl: `https://www.ajithkumarr.com/blog/${techBlog.slug || techBlog._id}`
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type': 'application/json',
        ...(techBlog.slug && {
          'Link': `<https://www.ajithkumarr.com/blog/${techBlog.slug}>; rel="canonical"`
        })
      }
    });
    
  } catch (error) {
    console.error('Error fetching tech blog post:', error);
    
    logRequest('GET', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Internal server error',
        code: 'SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// PUT update a tech blog post (optional - for admin functionality)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find tech blog by slug or ObjectId
    let techBlog;
    if (isValidObjectId(id)) {
      techBlog = await TechBlog.findById(id);
    } else {
      techBlog = await TechBlog.findOne({ slug: id });
    }
    
    if (!techBlog) {
      logRequest('PUT', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Tech blog post not found' },
        { status: 404 }
      );
    }
    
    // Get update data
    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    // Update the tech blog post
    Object.assign(techBlog, updateData);
    await techBlog.save();
    
    logRequest('PUT', id, userAgent, clientIP, '200-UPDATED');
    
    return NextResponse.json({
      status: 'success',
      data: { techBlog },
      message: 'Tech blog post updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating tech blog post:', error);
    
    logRequest('PUT', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error updating tech blog post',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}

// DELETE a tech blog post (optional - for admin functionality)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find and delete tech blog post
    let techBlog;
    if (isValidObjectId(id)) {
      techBlog = await TechBlog.findByIdAndDelete(id);
    } else {
      techBlog = await TechBlog.findOneAndDelete({ slug: id });
    }
    
    if (!techBlog) {
      logRequest('DELETE', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Tech blog post not found' },
        { status: 404 }
      );
    }
    
    logRequest('DELETE', id, userAgent, clientIP, '200-DELETED');
    
    return NextResponse.json({
      status: 'success',
      message: 'Tech blog post deleted successfully',
      data: { deletedId: techBlog._id, deletedSlug: techBlog.slug }
    });
    
  } catch (error) {
    console.error('Error deleting tech blog post:', error);
    
    logRequest('DELETE', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error deleting tech blog post',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}