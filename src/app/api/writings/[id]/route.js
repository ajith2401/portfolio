// src/app/api/writings/[id]/route.js
import { NextResponse } from 'next/server';
import { Writing } from '@/models/writings.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper to log API requests for monitoring
function logRequest(method, identifier, userAgent, clientIP, result) {
  const timestamp = new Date().toISOString();
  console.log(`[API] ${timestamp} | ${method} /api/writings/${identifier} | ${result} | IP: ${clientIP} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

// GET a single writing by slug or ObjectId
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
          message: 'Invalid writing identifier',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }
    
    let writing;
    let foundByObjectId = false;
    
    // Check if it's a valid ObjectId first
    if (isValidObjectId(id)) {
      foundByObjectId = true;
      writing = await Writing.findById(id);
      
      // If found by ObjectId and has slug, redirect to slug URL
      if (writing && writing.slug) {
        logRequest('GET', id, userAgent, clientIP, '301-REDIRECT');
        
        const slugUrl = new URL(request.url);
        slugUrl.pathname = `/api/writings/${writing.slug}`;
        
        return NextResponse.redirect(slugUrl, {
          status: 301,
          headers: {
            'Cache-Control': 'public, max-age=3600',
            'X-Redirect-Reason': 'ObjectId-to-Slug'
          }
        });
      }
      
      // If found by ObjectId but no slug, still return it (migration period)
      if (writing && !writing.slug) {
        logRequest('GET', id, userAgent, clientIP, '200-OBJECTID-NO-SLUG');
        
        return NextResponse.json({
          status: 'success',
          data: { writing },
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
      if (!writing) {
        logRequest('GET', id, userAgent, clientIP, 'OBJECTID-NOT-FOUND');
      }
    }
    
    // If not found by ObjectId or not an ObjectId, try slug search
    if (!writing) {
      writing = await Writing.findOne({ 
        slug: id.toLowerCase().trim(),
        status: 'published' // Only return published writings
      });
      
      if (writing) {
        logRequest('GET', id, userAgent, clientIP, '200-SLUG');
      }
    }
    
    // If still not found, return 404
    if (!writing) {
      logRequest('GET', id, userAgent, clientIP, '404-NOT-FOUND');
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Writing not found',
          code: 'NOT_FOUND',
          suggestions: [
            'Check if the URL is correct',
            'Visit /quill to browse all writings',
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
    Writing.findByIdAndUpdate(
      writing._id,
      { $inc: { 'performance.views': 1 } },
      { new: false }
    ).catch(err => {
      console.error('Error incrementing view count:', err);
    });
    
    // Always include both _id and slug in the response
    return NextResponse.json({
      status: 'success',
      data: { writing },
      meta: {
        accessedBy: foundByObjectId ? 'objectId' : 'slug',
        hasSlug: !!writing.slug,
        canonicalUrl: `https://www.ajithkumarr.com/quill/${writing.slug || writing._id}`
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type': 'application/json',
        ...(writing.slug && {
          'Link': `<https://www.ajithkumarr.com/quill/${writing.slug}>; rel="canonical"`
        })
      }
    });
    
  } catch (error) {
    console.error('Error fetching writing:', error);
    
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

// PUT update a writing (optional - for admin functionality)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find writing by slug or ObjectId
    let writing;
    if (isValidObjectId(id)) {
      writing = await Writing.findById(id);
    } else {
      writing = await Writing.findOne({ slug: id });
    }
    
    if (!writing) {
      logRequest('PUT', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Writing not found' },
        { status: 404 }
      );
    }
    
    // Get update data
    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    // Update the writing
    Object.assign(writing, updateData);
    await writing.save();
    
    logRequest('PUT', id, userAgent, clientIP, '200-UPDATED');
    
    return NextResponse.json({
      status: 'success',
      data: { writing },
      message: 'Writing updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating writing:', error);
    
    logRequest('PUT', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error updating writing',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}

// DELETE a writing (optional - for admin functionality)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find and delete writing
    let writing;
    if (isValidObjectId(id)) {
      writing = await Writing.findByIdAndDelete(id);
    } else {
      writing = await Writing.findOneAndDelete({ slug: id });
    }
    
    if (!writing) {
      logRequest('DELETE', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Writing not found' },
        { status: 404 }
      );
    }
    
    logRequest('DELETE', id, userAgent, clientIP, '200-DELETED');
    
    return NextResponse.json({
      status: 'success',
      message: 'Writing deleted successfully',
      data: { deletedId: writing._id, deletedSlug: writing.slug }
    });
    
  } catch (error) {
    console.error('Error deleting writing:', error);
    
    logRequest('DELETE', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error deleting writing',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}