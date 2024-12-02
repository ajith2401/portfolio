// src/app/api/writings/[id]/rate/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing, Comment } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { name, email, rating } = await request.json();
    
    const writing = await Writing.findById(params.id);
    if (!writing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 });
    }
    
    await writing.addRating(name, email, rating);
    return NextResponse.json(writing);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}