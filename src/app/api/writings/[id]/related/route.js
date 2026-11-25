// src/app/api/writings/[id]/related/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Writing } from '@/models';
import { relatedCards } from '@/lib/public-writings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

// Related PUBLISHED works as public cards (no body, ratings, revisions). The source must itself be published.
export async function GET(request, props) {
  const params = await props.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    await connectDB();
    const writing = await Writing.findOne({ _id: params.id, status: 'published' }).select('category').lean();
    if (!writing) return NextResponse.json({ error: 'Writing not found' }, { status: 404 });
    const cards = await relatedCards(writing, 3);
    return NextResponse.json(cards.map((c) => ({ ...c, _id: c.id })), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
    });
  } catch (error) {
    console.error('Error fetching related writings:', error);
    return NextResponse.json({ error: 'Failed to fetch related writings' }, { status: 500 });
  }
}
