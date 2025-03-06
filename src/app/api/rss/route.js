import connectDB from "@/lib/db";
import { TechBlog, Writing } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  
  const techBlogs = await TechBlog.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(20)
    .lean();
    
  const writings = await Writing.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
    
  const baseUrl = 'https://www.ajithkumarr.com';
  
  // Build XML for RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ajithkumar - Poet, Writer & Lyricist</title>
    <link>${baseUrl}</link>
    <description>Exploring themes of feminism, social justice, and human emotions through Tamil poetry and creative works</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    
    ${techBlogs.map(blog => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/techblog/${blog._id}</link>
      <guid>${baseUrl}/techblog/${blog._id}</guid>
      <pubDate>${new Date(blog.publishedAt || blog.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${blog.subtitle || blog.content.substring(0, 160)}]]></description>
      <category>${blog.category}</category>
    </item>
    `).join('')}
    
    ${writings.map(writing => `
    <item>
      <title><![CDATA[${writing.title}]]></title>
      <link>${baseUrl}/quill/${writing._id}</link>
      <guid>${baseUrl}/quill/${writing._id}</guid>
      <pubDate>${new Date(writing.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${writing.subtitle || writing.body.substring(0, 160)}]]></description>
      <category>${writing.category}</category>
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}