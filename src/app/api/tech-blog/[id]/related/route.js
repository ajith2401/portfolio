// src/app/api/tech-blog/[id]/related/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TechBlog } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const blog = await TechBlog.findById(params.id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    // Find blogs with matching category and/or tags
    const query = {
      _id: { $ne: params.id },
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags || [] } }
      ],
      // Only include published items
      ...(blog.status === 'published' ? { status: 'published' } : {})
    };
    
    const relatedBlogs = await TechBlog.find(query)
      .sort({ createdAt: -1 })
      .limit(3);
    
    return NextResponse.json(relatedBlogs);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related blogs' },
      { status: 500 }
    );
  }
}