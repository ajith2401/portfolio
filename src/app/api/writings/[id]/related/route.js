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
    
    // Find writings in the same category, excluding the current one
    const relatedWritings = await Writing.find({
      _id: { $ne: params.id },
      category: writing.category,
      // Only include published items if applicable
      ...(writing.status === 'published' ? { status: 'published' } : {})
    })
    .sort({ createdAt: -1 })
    .limit(3);
    
    return NextResponse.json(relatedWritings);
  } catch (error) {
    console.error('Error fetching related writings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related writings' },
      { status: 500 }
    );
  }
}