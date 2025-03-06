// src/app/api/tech-blog/[id]/rate/route.js
import connectDB from "@/lib/db";
import { TechBlog } from "@/models";
import { NextResponse } from "next/server";

// src/app/api/tech-blog/[id]/rate/route.js
export async function POST(request, { params }) {
    try {
      await connectDB();
      
      const { name, email, rating } = await request.json();
      const blog = await TechBlog.findById(params.id);
      
      if (!blog) {
        return NextResponse.json(
          { error: 'Tech blog not found' },
          { status: 404 }
        );
      }
      
      // Initialize ratings array if it doesn't exist
      if (!blog.ratings) {
        blog.ratings = [];
      }
      
      // Update or add new rating
      const existingRating = blog.ratings.find(r => r.email === email);
      if (existingRating) {
        existingRating.rating = rating;
        existingRating.name = name;
      } else {
        blog.ratings.push({ name, email, rating });
      }
      
      // Calculate average rating
      const totalRating = blog.ratings.reduce((sum, r) => sum + r.rating, 0);
      blog.averageRating = totalRating / blog.ratings.length;
      blog.totalRatings = blog.ratings.length;
      
      await blog.save();
      
      return NextResponse.json({
        averageRating: blog.averageRating,
        totalRatings: blog.totalRatings
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      return NextResponse.json(
        { error: 'Failed to update rating' },
        { status: 500 }
      );
    }
  }