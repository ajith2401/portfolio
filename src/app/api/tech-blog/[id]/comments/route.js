// src/app/api/tech-blog/[id]/comments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

import { Comment } from '@/models/comment.model';
import { TechBlog } from '@/models';

// GET comments for a tech blog
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const comments = await Comment.find({
      parentId: params.id,
      parentModel: 'TechBlog',
      status: 'approved'
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST new comment
export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const data = await request.json();
    const blog = await TechBlog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Tech blog not found' },
        { status: 404 }
      );
    }
    
    // Create comment with reference to TechBlog
    const comment = await Comment.create({
      ...data,
      parentId: params.id,
      parentModel: 'TechBlog'
    });
    
    // Update blog's rating
    if (blog.ratings) {
      const existingRating = blog.ratings.find(r => r.email === data.email);
      
      if (existingRating) {
        existingRating.rating = data.rating;
        existingRating.name = data.name;
      } else {
        blog.ratings.push({
          name: data.name,
          email: data.email,
          rating: data.rating
        });
      }
      
      // Calculate average rating
      const totalRating = blog.ratings.reduce((sum, r) => sum + r.rating, 0);
      blog.averageRating = totalRating / blog.ratings.length;
      blog.totalRatings = blog.ratings.length;
      
      await blog.save();
    }
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}