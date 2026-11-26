// src/app/api/comments/[parentModel]/[parentId]/route.js

import connectDB from "@/lib/db";
import { Comment } from "@/models";
import { NextResponse } from "next/server";
import { toPublicComment } from "@/lib/public/comments";
import { findPublishedParent } from "@/lib/public/comment-parent";


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10; // Maximum execution time for Vercel

// Timeout wrapper for database operations
const withTimeout = (promise, timeoutMs = 8000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout')), timeoutMs);
    })
  ]);
};

export async function GET(request, props) {
  const params = await props.params;
  try {
    await connectDB();
    
    const { parentModel, parentId } = params;
    
    // Validate parameters
    if (!parentModel || !parentId || 
        !['Writing', 'TechBlog'].includes(parentModel)) {
      return NextResponse.json({ 
        error: 'Invalid parameters' 
      }, { status: 400 });
    }
    
    if (!(await findPublishedParent(parentModel, parentId))) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Find comments with timeout
    const comments = await withTimeout(Comment.findByParent(parentId, parentModel));
    
    return NextResponse.json(comments.map((c) => toPublicComment(c)));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comments' 
    }, { status: 500 });
  }
}