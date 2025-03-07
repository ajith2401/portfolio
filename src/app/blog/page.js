// src/app/blog/page.js
import { TechBlog } from '@/models';
import connectDB from '@/lib/db';
import TechBlogClient from './TechBlogClient';

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

// Server component for better SEO
export default async function TechBlogPage() {
  await connectDB();
  // Pre-render the page with initial data
  const initialPosts = await TechBlog.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(12)
    .lean();

  return <TechBlogClient initialPosts={JSON.parse(JSON.stringify(initialPosts))} />;
}