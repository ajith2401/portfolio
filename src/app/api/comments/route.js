// src/app/api/comments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Comment } from '@/models';
import { handleCommentOperations, updateCommentStats } from '@/middleware/comment.middleware';
import { toPublicComment } from '@/lib/public/comments';
import { findPublishedParent } from '@/lib/public/comment-parent';
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
    
    // Strict allowlist for parentModel
    const ALLOWED_MODELS = ['Writing', 'TechBlog'];
    if (!ALLOWED_MODELS.includes(commentData.parentModel)) {
      return NextResponse.json({ error: 'Invalid parent model' }, { status: 400 });
    }

    // Validate required fields and types
    if (
      !commentData.parentId ||
      typeof commentData.name !== 'string' ||
      typeof commentData.email !== 'string' ||
      typeof commentData.comment !== 'string' ||
      typeof commentData.rating !== 'number'
    ) {
      return NextResponse.json({ 
        error: 'Missing or invalid required fields' 
      }, { status: 400 });
    }

    const trimmedName = commentData.name.trim();
    const trimmedEmail = commentData.email.trim();
    const trimmedComment = commentData.comment.trim();
    const numericRating = Math.min(5, Math.max(1, Math.round(commentData.rating)));

    // Length and format limits
    if (!trimmedName || trimmedName.length > 100 || !trimmedComment || trimmedComment.length > 2000) {
      return NextResponse.json({ 
        error: 'Name (max 100 chars) and comment (max 2000 chars) must be valid' 
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }
    
    // Use middleware to handle comment operations and initialize arrays
    const cleanPayload = {
      parentId: commentData.parentId,
      parentModel: commentData.parentModel,
      name: trimmedName,
      email: trimmedEmail,
      comment: trimmedComment,
      rating: numericRating
    };
    // Drafts, archived, deleted and malformed ids are all a plain 404, and nothing is touched.
    if (!(await findPublishedParent(cleanPayload.parentModel, cleanPayload.parentId))) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const { parent, Model } = await handleCommentOperations(cleanPayload);

    // One rating/comment per email per work: blocks ballot-stuffing with repeat submissions.
    const duplicate = await Comment.exists({
      parentId: parent._id,
      parentModel: cleanPayload.parentModel,
      email: cleanPayload.email.toLowerCase()
    });
    if (duplicate) {
      return NextResponse.json({ error: 'You have already submitted a response for this work.' }, { status: 409 });
    }

    // Create new comment with safe, explicit attributes (status defaults to pending)
    const comment = await Comment.create({
      parentId: parent._id,
      parentModel: cleanPayload.parentModel,
      name: cleanPayload.name,
      email: cleanPayload.email,
      comment: cleanPayload.comment,
      rating: cleanPayload.rating,
      status: 'pending'
    });
    
    // Add comment reference to parent
    await Model.findByIdAndUpdate(parent._id, {
      $push: { comments: comment._id },
      $inc: { 'performance.comments': 1 }
    });

    // Update rating stats
    await updateCommentStats(parent, Model);
    
    return NextResponse.json({ ...toPublicComment(comment), status: 'pending' }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Failed to create comment' 
    }, { status: 500 });
  }
}