// src/app/api/comments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Comment } from '@/models';
import { handleCommentOperations, updateCommentStats } from '@/middleware/comment.middleware';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Rate limit: 5 comments per 5 minutes per IP
    const ip = getClientIP(request);
    const { allowed, resetAt } = rateLimit(`comment:${ip}`, 5, 5 * 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) } }
      );
    }

    await connectDB();
    const commentData = await request.json();
    
    // Validate required fields
    if (!commentData.parentId || !commentData.parentModel || !commentData.name || 
        !commentData.email || !commentData.comment || !commentData.rating) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Use middleware to handle comment operations and initialize arrays
    const { parent, Model } = await handleCommentOperations(commentData);

    // Create new comment
    const comment = await Comment.create({
      ...commentData,
      parentId: parent._id,
      parentModel: commentData.parentModel,
      status: 'pending'
    });
    
    // Add comment reference to parent
    await Model.findByIdAndUpdate(parent._id, {
      $push: { comments: comment._id },
      $inc: { 'performance.comments': 1 }
    });

    // Update rating stats
    await updateCommentStats(parent, Model);
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Failed to create comment' 
    }, { status: 500 });
  }
}