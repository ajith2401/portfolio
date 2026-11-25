// src/app/api/writings/[id]/route.js
import { NextResponse } from 'next/server';
import { Writing } from '@/models/writings.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { findForRoute } from '@/lib/public-writings';
import { toPublicWriting, encodeSlugForUrl } from '@/lib/content-contract/index.js';
import { verifyAdminAuth, adminUnauthorizedResponse } from '@/lib/authGuard';

// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper to log API requests for monitoring
function logRequest(method, identifier, userAgent, clientIP, result) {
  const timestamp = new Date().toISOString();
  console.log(`[API] ${timestamp} | ${method} /api/writings/${identifier} | ${result} | IP: ${clientIP} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

// GET a single PUBLISHED writing by slug (or ObjectId, which permanently redirects to the slug).
// Always serialised through the public DTO: no ratings[] (reviewer emails), revisions or drafts.
export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { status: 'error', message: 'Invalid writing identifier', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const result = await findForRoute(id);

    if (result.action === 'redirect') {
      const target = new URL(request.url);
      target.pathname = `/api/writings/${encodeSlugForUrl(result.slug)}`;
      return NextResponse.redirect(target, {
        status: 301,
        headers: { 'Cache-Control': 'public, max-age=3600', 'X-Redirect-Reason': result.reason }
      });
    }

    if (result.action !== 'render') {
      return NextResponse.json(
        { status: 'error', message: 'Writing not found', code: 'NOT_FOUND' },
        { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } }
      );
    }

    const { writing } = result;
    // Fire-and-forget view counter on the real schema path.
    Writing.updateOne({ _id: writing._id }, { $inc: { 'performance.views.total': 1 } }).catch(() => {});

    const data = { ...toPublicWriting(writing), _id: String(writing._id) };
    const canonical = writing.slug ? `https://www.ajithkumarr.com/quill/${encodeSlugForUrl(writing.slug)}` : null;
    return NextResponse.json(
      {
        status: 'success',
        data: { writing: data },
        meta: { accessedBy: result.via, hasSlug: !!writing.slug, canonicalUrl: canonical }
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
          ...(canonical && { Link: `<${canonical}>; rel="canonical"` })
        }
      }
    );
  } catch (error) {
    console.error('Error fetching writing:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500, headers: { 'Cache-Control': 'no-cache' } }
    );
  }
}

// PUT update a writing (requires admin authentication)
export async function PUT(request, props) {
  const params = await props.params;
  const auth = verifyAdminAuth(request);
  if (!auth.authorized) {
    return adminUnauthorizedResponse(auth.error);
  }

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
    for (const k of ['_id', 'createdAt', 'updatedAt', 'ratings', 'comments', 'revisions', 'averageRating', 'totalRatings', 'performance', 'slugHistory']) {
      delete updateData[k];
    }
    
    // Update the writing
    Object.assign(writing, updateData);
    await writing.save();
    
    logRequest('PUT', id, userAgent, clientIP, '200-UPDATED');
    
    return NextResponse.json({
      status: 'success',
      data: { writing: { _id: String(writing._id), slug: writing.slug, status: writing.status } },
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

// DELETE a writing (requires admin authentication)
export async function DELETE(request, props) {
  const params = await props.params;
  const auth = verifyAdminAuth(request);
  if (!auth.authorized) {
    return adminUnauthorizedResponse(auth.error);
  }

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