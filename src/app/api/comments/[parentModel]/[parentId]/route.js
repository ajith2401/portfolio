// src/app/api/comments/[parentModel]/[parentId]/route.js

import connectDB from "@/lib/db";
import { Comment } from "@/models";
import { NextResponse } from "next/server";


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
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
    
    // Find comments
    const comments = await Comment.findByParent(parentId, parentModel);
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comments' 
    }, { status: 500 });
  }
}