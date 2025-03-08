// src/app/api/sitemap/route.js
import connectDB from "@/lib/db";
import { TechBlog, Writing, Project } from "@/models";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all published tech blogs
    const techBlogs = await TechBlog.find({ status: 'published' })
      .select('_id title category updatedAt createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    // Fetch all published writings
    const writings = await Writing.find({ status: 'published' })
      .select('_id title category updatedAt createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    // Fetch all published projects
    const projects = await Project.find({ status: 'published' })
      .select('_id title slug category updatedAt createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    const baseUrl = 'https://www.ajithkumarr.com';
    
    // Define static routes with their properties
    const staticRoutes = [
      { url: '/', changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() },
      { url: '/devfolio', changefreq: 'weekly', priority: 0.8, lastmod: projects[0]?.updatedAt?.toISOString() || new Date().toISOString() },
      { url: '/blog', changefreq: 'daily', priority: 0.9, lastmod: techBlogs[0]?.updatedAt?.toISOString() || new Date().toISOString() },
      { url: '/quill', changefreq: 'daily', priority: 0.9, lastmod: writings[0]?.updatedAt?.toISOString() || new Date().toISOString() },
      { url: '/spotlight', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
      { url: '/about', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() }
    ];
    
    // Tech blog routes
    const techBlogRoutes = techBlogs.map(blog => ({
      url: `/blog/${blog._id}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: (blog.updatedAt || blog.createdAt)?.toISOString() || new Date().toISOString()
    }));
    
    // Writing routes
    const writingRoutes = writings.map(writing => ({
      url: `/quill/${writing._id}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: (writing.updatedAt || writing.createdAt)?.toISOString() || new Date().toISOString()
    }));
    
    // Project routes - use either slug or ID based on your URL structure
    const projectRoutes = projects.map(project => ({
      url: `/devfolio/${project._id}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: (project.updatedAt || project.createdAt)?.toISOString() || new Date().toISOString()
    }));
    
    // Combine all routes
    const allRoutes = [...staticRoutes, ...techBlogRoutes, ...writingRoutes, ...projectRoutes];
    
    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
</urlset>`;
    
    // Return XML with proper content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap with just the main pages in case of error
    const baseUrl = 'https://www.ajithkumarr.com';
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/devfolio</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/quill</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    
    return new NextResponse(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
      status: 500
    });
  }
}