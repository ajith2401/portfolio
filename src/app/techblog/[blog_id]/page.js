// src/app/techblog/[blog_id]/page.js
import { TechBlog } from '@/models';
import connectDB from '@/lib/db';
import TechBlogPostClient from './TechBlogPostClient';

export async function generateMetadata({ params }) {
  await connectDB();
  const blog = await TechBlog.findById(params.blog_id);
  
  if (!blog) {
    return { 
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  // Clean up the text for description
  const plainTextContent = blog.content
    ? blog.content
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .trim()
    : '';
    
  const description = blog.subtitle || plainTextContent.substring(0, 160);
  
  // Safely format dates for metadata
  const safeISODate = (dateValue) => {
    if (!dateValue) return undefined;
    try {
      return dateValue instanceof Date 
        ? dateValue?.toISOString() 
        : new Date(dateValue)?.toISOString();
    } catch (error) {
      console.error("Date conversion error:", error);
      return undefined;
    }
  };
  
  const publishedTime = safeISODate(blog.publishedAt || blog.createdAt);
  const modifiedTime = safeISODate(blog.updatedAt);
  
  return {
    title: blog.title,
    description: description,
    keywords: [...(blog.tags || []), blog.category, 'web development', 'technical writing'].filter(Boolean),
    authors: [{ name: blog.author?.name || 'Ajithkumar' }],
    category: blog.category,
    alternates: {
      canonical: `https://www.ajithkumarr.com/techblog/${params.blog_id}`,
    },
    openGraph: {
      title: blog.title,
      description: description,
      url: `https://www.ajithkumarr.com/techblog/${params.blog_id}`,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [blog.author?.name || 'Ajithkumar'],
      images: [
        {
          url: blog.images?.large || 'https://www.ajithkumarr.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
      images: [blog.images?.large || 'https://www.ajithkumarr.com/twitter-image.jpg'],
    }
  };
}

export default async function TechBlogPostPage({ params }) {
  await connectDB();
  
  try {
    // Pre-render the page with initial data
    const blog = await TechBlog.findById(params.blog_id).populate('author');
    
    if (!blog) {
      return <div className="min-h-screen flex items-center justify-center">Blog post not found</div>;
    }
    
    // Get related posts
    const relatedPosts = await TechBlog.find({
      _id: { $ne: params.blog_id },
      category: blog.category,
      status: 'published'
    })
    .select('_id title subtitle content images category createdAt')
    .limit(3)
    .lean();
    
    // Safe serialization with structured error handling
    const serialize = (obj) => {
      try {
        return JSON.parse(JSON.stringify(obj));
      } catch (error) {
        console.error("Serialization error:", error);
        // Return a simplified object if serialization fails
        return { error: true };
      }
    };
    
    return <TechBlogPostClient 
      blog={serialize(blog)} 
      relatedPosts={serialize(relatedPosts)}
      blogId={params.blog_id}
    />;
  } catch (error) {
    console.error("Error in TechBlogPostPage:", error);
    return <div className="min-h-screen flex items-center justify-center text-red-500">
      Error loading blog post. Please try again later.
    </div>;
  }
}