// src/app/api/comments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Comment } from '@/models';
import { handleCommentOperations, updateCommentStats } from '@/middleware/comment.middleware';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
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
      status: 'approved' // All comments start as pending
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