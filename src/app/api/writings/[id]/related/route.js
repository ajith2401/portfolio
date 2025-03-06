// src/app/api/writings/[id]/related/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const writing = await Writing.findById(params.id);
    if (!writing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 });
    }
    
    // First attempt: Find writings in the same category, excluding the current one
    let relatedWritings = await Writing.find({
      _id: { $ne: params.id },
      category: writing.category,
      // Only include published items if applicable
      ...(writing.status === 'published' ? { status: 'published' } : {})
    })
    .sort({ createdAt: -1 })
    .limit(5); // Get more than we need to filter
    
    // Exclude the most recent 2 writings to avoid showing the latest ones
    if (relatedWritings.length > 3) {
      relatedWritings = relatedWritings.slice(2, 5);
    }
    
    // If we don't have enough related writings by category, use text search
    if (relatedWritings.length < 3) {
      // Extract key terms from the title and beginning of the body
      const searchTerms = writing.title.split(' ')
        .concat((writing.body || '').substring(0, 200).split(' '))
        .filter(term => term.length > 4) // Only use substantial words
        .slice(0, 5) // Limit to 5 terms
        .join(' ');
      
      // Find writings with similar content using text search
      const textSearchResults = await Writing.find({
        _id: { $ne: params.id },
        $text: { $search: searchTerms },
        ...(writing.status === 'published' ? { status: 'published' } : {})
      })
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);
      
      // Combine results, maintaining uniqueness
      const existingIds = new Set(relatedWritings.map(w => w._id.toString()));
      
      for (const result of textSearchResults) {
        const resultId = result._id.toString();
        if (!existingIds.has(resultId) && relatedWritings.length < 3) {
          existingIds.add(resultId);
          relatedWritings.push(result);
        }
      }
    }
    
    // If we still don't have enough, get random writings from different categories
    if (relatedWritings.length < 3) {
      const randomWritings = await Writing.find({
        _id: { $ne: params.id },
        category: { $ne: writing.category },
        ...(writing.status === 'published' ? { status: 'published' } : {})
      })
      .sort({ averageRating: -1 }) // Sort by highest rating
      .limit(5);
      
      // Add unique random writings to fill gaps
      const existingIds = new Set(relatedWritings.map(w => w._id.toString()));
      
      for (const result of randomWritings) {
        const resultId = result._id.toString();
        if (!existingIds.has(resultId) && relatedWritings.length < 3) {
          existingIds.add(resultId);
          relatedWritings.push(result);
        }
      }
    }
    
    // Limit to exactly 3 results
    relatedWritings = relatedWritings.slice(0, 3);
    
    return NextResponse.json(relatedWritings);
  } catch (error) {
    console.error('Error fetching related writings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related writings' },
      { status: 500 }
    );
  }
}