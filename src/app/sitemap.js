// app/sitemap.js

import connectDB from "@/lib/db";
import { TechBlog, Writing } from "@/models";


export default async function sitemap() {
  await connectDB();
  
  // Get latest update dates from your collections
  const latestTechBlog = await TechBlog.findOne().sort({ updatedAt: -1 });
  const latestWriting = await Writing.findOne().sort({ updatedAt: -1 });
  
  // Get all published content
  const techBlogs = await TechBlog.find({ status: 'published' }).select('_id updatedAt slug').lean();
  const writings = await Writing.find({ status: 'published' }).select('_id updatedAt').lean();
  
  const baseUrl = 'https://www.ajithkumarr.com';
  
  // Core pages with accurate lastModified dates
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/devfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/techblog`, lastModified: latestTechBlog?.updatedAt || new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/quill`, lastModified: latestWriting?.updatedAt || new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/spotlight`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
  
  // Dynamic blog pages with proper lastModified dates
  const techBlogPages = techBlogs.map(blog => ({
    url: `${baseUrl}/techblog/${blog._id}`,
    lastModified: blog.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));
  
  // Writing pages
  const writingPages = writings.map(writing => ({
    url: `${baseUrl}/quill/${writing._id}`,
    lastModified: writing.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));
  
  return [...staticPages, ...techBlogPages, ...writingPages];
}