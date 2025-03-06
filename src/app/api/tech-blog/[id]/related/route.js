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
    
    // STEP 1: Find blogs with matching category and/or tags (but exclude most recent)
    const categoryTagsQuery = {
      _id: { $ne: params.id },
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags || [] } }
      ],
      // Only include published items
      ...(blog.status === 'published' ? { status: 'published' } : {})
    };
    
    // Get more results to filter out recent ones
    const categoryMatchBlogs = await TechBlog.find(categoryTagsQuery)
      .sort({ createdAt: -1 })
      .limit(6);
    
    // Skip the most recent 2 blogs to avoid showing just the latest ones
    let relatedBlogs = [];
    if (categoryMatchBlogs.length > 3) {
      relatedBlogs = categoryMatchBlogs.slice(2, 5);
    } else if (categoryMatchBlogs.length > 0) {
      // If less than 3 total, avoid using the most recent one
      relatedBlogs = categoryMatchBlogs.slice(1);
    }
    
    // STEP 2: If we don't have enough from category/tags matching, use text search
    if (relatedBlogs.length < 3) {
      // Extract meaningful terms from the blog title, content, and tags
      const titleTerms = blog.title ? blog.title.split(' ') : [];
      const contentTerms = blog.content ? blog.content.substring(0, 300).split(/\s+/) : [];
      const searchTerms = [...titleTerms, ...contentTerms, ...(blog.tags || [])]
        .filter(term => {
          // Clean terms and filter out short words and HTML tags
          const cleaned = term.replace(/[<>\/.,;:'"!?(){}[\]]/g, '').trim();
          return cleaned.length > 4 && !cleaned.startsWith('<') && !cleaned.endsWith('>');
        })
        .slice(0, 7) // Limit to 7 terms for better search focus
        .join(' ');
      
      // Find blogs with similar content using text search
      const existingIds = new Set(relatedBlogs.map(b => b._id.toString()));
      existingIds.add(params.id); // Make sure current blog is excluded
      
      const textSearchQuery = {
        _id: { $nin: Array.from(existingIds).map(id => id) },
        $text: { $search: searchTerms },
        ...(blog.status === 'published' ? { status: 'published' } : {})
      };
      
      const textSearchResults = await TechBlog.find(textSearchQuery)
        .sort({ score: { $meta: 'textScore' } })
        .limit(3 - relatedBlogs.length);
      
      // Add text search results to our related blogs
      relatedBlogs = [...relatedBlogs, ...textSearchResults];
    }
    
    // STEP 3: If still not enough, get popular blogs from different categories
    if (relatedBlogs.length < 3) {
      const existingIds = new Set(relatedBlogs.map(b => b._id.toString()));
      existingIds.add(params.id); // Make sure current blog is excluded
      
      const popularBlogsQuery = {
        _id: { $nin: Array.from(existingIds).map(id => id) },
        category: { $ne: blog.category }, // Different category
        ...(blog.status === 'published' ? { status: 'published' } : {})
      };
      
      const popularBlogs = await TechBlog.find(popularBlogsQuery)
        .sort({ averageRating: -1, totalRatings: -1 }) // Sort by rating and popularity
        .limit(3 - relatedBlogs.length);
      
      relatedBlogs = [...relatedBlogs, ...popularBlogs];
    }
    
    // Make sure we have exactly 3 blogs or less
    relatedBlogs = relatedBlogs.slice(0, 3);
    
    return NextResponse.json(relatedBlogs);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related blogs' },
      { status: 500 }
    );
  }
}