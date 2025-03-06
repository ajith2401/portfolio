// src/app/api/comments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Comment, Writing, TechBlog } from '@/models';

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
    
    // Check if parent exists
    let parent;
    if (commentData.parentModel === 'Writing') {
      parent = await Writing.findById(commentData.parentId);
    } else if (commentData.parentModel === 'TechBlog') {
      parent = await TechBlog.findById(commentData.parentId);
    }
    
    if (!parent) {
      return NextResponse.json({ 
        error: `${commentData.parentModel} not found` 
      }, { status: 404 });
    }
    
    // Create comment
    const comment = await Comment.create({
      parentId: commentData.parentId,
      parentModel: commentData.parentModel,
      name: commentData.name,
      email: commentData.email,
      comment: commentData.comment,
      rating: commentData.rating,
      status: 'approved' // Default to approved
    });
    
    // Add rating to parent
    if (commentData.parentModel === 'Writing') {
      // Add comment reference
      parent.comments.push(comment._id);
      
      // Update rating
      await parent.addRating(commentData.name, commentData.email, commentData.rating);
    } else if (commentData.parentModel === 'TechBlog') {
      // Update rating
      await parent.addRating(commentData.name, commentData.email, commentData.rating);
    }
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Failed to create comment' 
    }, { status: 500 });
  }
}