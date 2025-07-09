// src/app/api/projects/[id]/route.js
import { NextResponse } from 'next/server';
import { Project } from '@/models/project.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper to log API requests for monitoring
function logRequest(method, identifier, userAgent, clientIP, result) {
  const timestamp = new Date().toISOString();
  console.log(`[API] ${timestamp} | ${method} /api/projects/${identifier} | ${result} | IP: ${clientIP} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

// GET a single project by slug or ObjectId
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
          message: 'Invalid project identifier',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }
    
    let project;
    let foundByObjectId = false;
    
    // Check if it's a valid ObjectId first
    if (isValidObjectId(id)) {
      foundByObjectId = true;
      project = await Project.findById(id);
      
      // If found by ObjectId and has slug, redirect to slug URL
      if (project && project.slug) {
        logRequest('GET', id, userAgent, clientIP, '301-REDIRECT');
        
        const slugUrl = new URL(request.url);
        slugUrl.pathname = `/api/projects/${project.slug}`;
        
        return NextResponse.redirect(slugUrl, {
          status: 301,
          headers: {
            'Cache-Control': 'public, max-age=3600',
            'X-Redirect-Reason': 'ObjectId-to-Slug'
          }
        });
      }
      
      // If found by ObjectId but no slug, still return it (migration period)
      if (project && !project.slug) {
        logRequest('GET', id, userAgent, clientIP, '200-OBJECTID-NO-SLUG');
        
        return NextResponse.json({
          status: 'success',
          data: { project },
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
      if (!project) {
        logRequest('GET', id, userAgent, clientIP, 'OBJECTID-NOT-FOUND');
      }
    }
    
    // If not found by ObjectId or not an ObjectId, try slug search
    if (!project) {
      project = await Project.findOne({ 
        slug: id.toLowerCase().trim(),
        status: 'published' // Only return published projects
      });
      
      if (project) {
        logRequest('GET', id, userAgent, clientIP, '200-SLUG');
      }
    }
    
    // If still not found, return 404
    if (!project) {
      logRequest('GET', id, userAgent, clientIP, '404-NOT-FOUND');
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Project not found',
          code: 'NOT_FOUND',
          suggestions: [
            'Check if the URL is correct',
            'Visit /devfolio to browse all projects',
            'Use the search function to find specific projects'
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
    Project.findByIdAndUpdate(
      project._id,
      { $inc: { 'performance.views': 1 } },
      { new: false }
    ).catch(err => {
      console.error('Error incrementing view count:', err);
    });
    
    // Return successful response
    return NextResponse.json({
      status: 'success',
      data: { project },
      meta: {
        accessedBy: foundByObjectId ? 'objectId' : 'slug',
        hasSlug: !!project.slug,
        canonicalUrl: `https://www.ajithkumarr.com/devfolio/${project.slug || project._id}`
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type': 'application/json',
        ...(project.slug && {
          'Link': `<https://www.ajithkumarr.com/devfolio/${project.slug}>; rel="canonical"`
        })
      }
    });
    
  } catch (error) {
    console.error('Error fetching project:', error);
    
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

// PUT update a project (optional - for admin functionality)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find project by slug or ObjectId
    let project;
    if (isValidObjectId(id)) {
      project = await Project.findById(id);
    } else {
      project = await Project.findOne({ slug: id });
    }
    
    if (!project) {
      logRequest('PUT', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Get update data
    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    // Update the project
    Object.assign(project, updateData);
    await project.save();
    
    logRequest('PUT', id, userAgent, clientIP, '200-UPDATED');
    
    return NextResponse.json({
      status: 'success',
      data: { project },
      message: 'Project updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    
    logRequest('PUT', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error updating project',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}

// DELETE a project (optional - for admin functionality)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find and delete project
    let project;
    if (isValidObjectId(id)) {
      project = await Project.findByIdAndDelete(id);
    } else {
      project = await Project.findOneAndDelete({ slug: id });
    }
    
    if (!project) {
      logRequest('DELETE', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Project not found' },
        { status: 404 }
      );
    }
    
    logRequest('DELETE', id, userAgent, clientIP, '200-DELETED');
    
    return NextResponse.json({
      status: 'success',
      message: 'Project deleted successfully',
      data: { deletedId: project._id, deletedSlug: project.slug }
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    
    logRequest('DELETE', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error deleting project',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}