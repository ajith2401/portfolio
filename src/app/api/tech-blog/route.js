// src/app/api/tech-blog/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TechBlog } from '@/models/techblog.model';


// GET all tech blogs
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    
    const query = { status };
    if (category) {
      query.category = category;
    }
    
    const blogs = await TechBlog.find(query)
      .sort({ publishedAt: -1 })
      .select('-content'); // Exclude content for list view
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching tech blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech blogs' },
      { status: 500 }
    );
  }
}

// POST new tech blog
export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const blog = await TechBlog.create(data);
    
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating tech blog:', error);
    return NextResponse.json(
      { error: 'Failed to create tech blog' },
      { status: 500 }
    );
  }
}
