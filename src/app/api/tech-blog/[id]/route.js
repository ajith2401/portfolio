import connectDB from "@/lib/db";
import { TechBlog } from "@/models/techblog.model";
import { NextResponse } from "next/server";

// src/app/api/tech-blog/[id]/route.js
export async function GET(request, { params }) {
    try {
      await connectDB();
      
      const blog = await TechBlog.findById(params.id);
      if (!blog) {
        return NextResponse.json(
          { error: 'Tech blog not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(blog);
    } catch (error) {
      console.error('Error fetching tech blog:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tech blog' },
        { status: 500 }
      );
    }
  }
  
  // PUT update tech blog
  export async function PUT(request, { params }) {
    try {
      await connectDB();
      
      const data = await request.json();
      const blog = await TechBlog.findByIdAndUpdate(
        params.id,
        { $set: data },
        { new: true, runValidators: true }
      );
      
      if (!blog) {
        return NextResponse.json(
          { error: 'Tech blog not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(blog);
    } catch (error) {
      console.error('Error updating tech blog:', error);
      return NextResponse.json(
        { error: 'Failed to update tech blog' },
        { status: 500 }
      );
    }
  }
  
  // DELETE tech blog
  export async function DELETE(request, { params }) {
    try {
      await connectDB();
      
      const blog = await TechBlog.findByIdAndDelete(params.id);
      if (!blog) {
        return NextResponse.json(
          { error: 'Tech blog not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ message: 'Tech blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting tech blog:', error);
      return NextResponse.json(
        { error: 'Failed to delete tech blog' },
        { status: 500 }
      );
    }
  }