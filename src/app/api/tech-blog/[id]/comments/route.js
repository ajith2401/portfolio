// src/app/api/tech-blog/[id]/comments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

import { Comment } from '@/models/comment.model';
import { toPublicComment } from '@/lib/public/comments';

// GET comments for a tech blog
export async function GET(request, props) {
  const params = await props.params;
  try {
    await connectDB();
    
    const comments = await Comment.find({
      parentId: params.id,
      parentModel: 'TechBlog',
      status: 'approved'
    }).select('name comment rating createdAt').sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json(comments.map(toPublicComment));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Writes go through POST /api/comments (validated, rate-limited, moderated).
export async function POST() {
  return NextResponse.json(
    { error: 'Gone. Submit comments through POST /api/comments.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
