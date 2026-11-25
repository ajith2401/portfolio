// src/app/api/writings/[id]/comments/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Comment } from '@/models';
import { toPublicComment } from '@/lib/public/comments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Approved comments only, without reviewer emails.
export async function GET(request, props) {
  const params = await props.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    await connectDB();
    const comments = await Comment.find({ parentId: params.id, parentModel: 'Writing', status: 'approved' })
      .select('name comment rating createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json(comments.map(toPublicComment));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// Writes go through POST /api/comments (validated, rate-limited, moderated). The old handler spread the
// raw request body into Comment.create, which allowed forging `status: 'approved'` and arbitrary ratings.
export async function POST() {
  return NextResponse.json(
    { error: 'Gone. Submit comments through POST /api/comments.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
