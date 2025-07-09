// src/app/api/books/[id]/route.js
import { NextResponse } from 'next/server';
import { Book } from '@/models/book.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper to log API requests for monitoring
function logRequest(method, identifier, userAgent, clientIP, result) {
  const timestamp = new Date().toISOString();
  console.log(`[API] ${timestamp} | ${method} /api/books/${identifier} | ${result} | IP: ${clientIP} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

// GET a single book by slug or ObjectId
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
          message: 'Invalid book identifier',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }
    
    let book;
    let foundByObjectId = false;
    
    // Check if it's a valid ObjectId first
    if (isValidObjectId(id)) {
      foundByObjectId = true;
      book = await Book.findById(id);
      
      // If found by ObjectId and has slug, redirect to slug URL
      if (book && book.slug) {
        logRequest('GET', id, userAgent, clientIP, '301-REDIRECT');
        
        const slugUrl = new URL(request.url);
        slugUrl.pathname = `/api/books/${book.slug}`;
        
        return NextResponse.redirect(slugUrl, {
          status: 301,
          headers: {
            'Cache-Control': 'public, max-age=3600',
            'X-Redirect-Reason': 'ObjectId-to-Slug'
          }
        });
      }
      
      // If found by ObjectId but no slug, still return it (migration period)
      if (book && !book.slug) {
        logRequest('GET', id, userAgent, clientIP, '200-OBJECTID-NO-SLUG');
        
        return NextResponse.json({
          status: 'success',
          data: { book },
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
      if (!book) {
        logRequest('GET', id, userAgent, clientIP, 'OBJECTID-NOT-FOUND');
      }
    }
    
    // If not found by ObjectId or not an ObjectId, try slug search
    if (!book) {
      book = await Book.findOne({ 
        slug: id.toLowerCase().trim(),
        status: 'published' // Only return published books
      });
      
      if (book) {
        logRequest('GET', id, userAgent, clientIP, '200-SLUG');
      }
    }
    
    // If still not found, return 404
    if (!book) {
      logRequest('GET', id, userAgent, clientIP, '404-NOT-FOUND');
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Book not found',
          code: 'NOT_FOUND',
          suggestions: [
            'Check if the URL is correct',
            'Visit /spotlight to browse all books',
            'Use the search function to find specific books'
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
    Book.findByIdAndUpdate(
      book._id,
      { $inc: { 'performance.views': 1 } },
      { new: false }
    ).catch(err => {
      console.error('Error incrementing view count:', err);
    });
    
    // Return successful response with additional book-specific data
    return NextResponse.json({
      status: 'success',
      data: { 
        book,
        // Add book-specific metadata
        totalPoems: book.poems ? book.poems.length : 0,
        hasReviews: book.reviews && book.reviews.length > 0,
        isPurchasable: !!(book.purchaseLinks?.amazon || book.purchaseLinks?.flipkart || book.purchaseLinks?.other)
      },
      meta: {
        accessedBy: foundByObjectId ? 'objectId' : 'slug',
        hasSlug: !!book.slug,
        canonicalUrl: `https://www.ajithkumarr.com/spotlight/${book.slug || book._id}`
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=7200, stale-while-revalidate=86400', // Longer cache for books
        'X-Content-Type': 'application/json',
        ...(book.slug && {
          'Link': `<https://www.ajithkumarr.com/spotlight/${book.slug}>; rel="canonical"`
        })
      }
    });
    
  } catch (error) {
    console.error('Error fetching book:', error);
    
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

// PUT update a book (optional - for admin functionality)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find book by slug or ObjectId
    let book;
    if (isValidObjectId(id)) {
      book = await Book.findById(id);
    } else {
      book = await Book.findOne({ slug: id });
    }
    
    if (!book) {
      logRequest('PUT', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Get update data
    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    // Update the book
    Object.assign(book, updateData);
    await book.save();
    
    logRequest('PUT', id, userAgent, clientIP, '200-UPDATED');
    
    return NextResponse.json({
      status: 'success',
      data: { book },
      message: 'Book updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating book:', error);
    
    logRequest('PUT', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error updating book',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}

// DELETE a book (optional - for admin functionality)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const userAgent = request.headers.get('user-agent');
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Find and delete book
    let book;
    if (isValidObjectId(id)) {
      book = await Book.findByIdAndDelete(id);
    } else {
      book = await Book.findOneAndDelete({ slug: id });
    }
    
    if (!book) {
      logRequest('DELETE', id, userAgent, clientIP, '404-NOT-FOUND');
      return NextResponse.json(
        { status: 'error', message: 'Book not found' },
        { status: 404 }
      );
    }
    
    logRequest('DELETE', id, userAgent, clientIP, '200-DELETED');
    
    return NextResponse.json({
      status: 'success',
      message: 'Book deleted successfully',
      data: { deletedId: book._id, deletedSlug: book.slug }
    });
    
  } catch (error) {
    console.error('Error deleting book:', error);
    
    logRequest('DELETE', params.id, request.headers.get('user-agent'), 'unknown', '500-ERROR');
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Error deleting book',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}