import connectDB from "@/lib/db";
import { TechBlog } from "@/models";
import { NextResponse } from "next/server";

// src/app/api/tech-blog/category/[category]/route.js
export async function GET(request, { params }) {
    try {
      await connectDB();
      
      const blogs = await TechBlog.find({
        category: params.category,
        status: 'published'
      })
        .sort({ publishedAt: -1 })
        .select('title slug _id excerpt category tags publishedAt readTime images performance.views averageRating author')
        .lean();
      
      return NextResponse.json(blogs);
    } catch (error) {
      console.error('Error fetching tech blogs by category:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tech blogs' },
        { status: 500 }
      );
    }
  }