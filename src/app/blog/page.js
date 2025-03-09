// src/app/blog/page.js
import { TechBlog } from '@/models';
import connectDB from '@/lib/db';
import TechBlogClient from './TechBlogClient';
import { Suspense } from 'react';

// Static metadata for SEO
export const metadata = {
  title: "Technical Blog | Ajithkumar",
  description: "Deep dives into software development, architecture patterns, and engineering best practices from Ajithkumar.",
  keywords: ["software development", "web development", "javascript", "react", "backend", "devops", "cloud"],
  openGraph: {
    title: "Technical Blog | Ajithkumar",
    description: "Deep dives into software development, architecture patterns, and engineering best practices.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajithkumar Tech Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Technical Blog | Ajithkumar",
    description: "Deep dives into software development, architecture patterns, and engineering best practices.",
    images: ['/twitter-image.jpg'],
  }
};


// Loading component for Suspense
function BlogLoading() {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
}


// Server component for better SEO
export default async function TechBlogPage() {
  await connectDB();
  // Pre-render the page with initial data
  const initialPosts = await TechBlog.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(12)
    .lean();

    return (
      <Suspense fallback={<BlogLoading />}>
        <TechBlogClient initialPosts={JSON.parse(JSON.stringify(initialPosts))} />
      </Suspense>
    );
  }