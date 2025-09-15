// src/app/blog/[blog_id]/page.js
import { notFound, redirect } from 'next/navigation';
import { TechBlog } from '@/models/techblog.model';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import BlogDetailClient from './TechBlogPostClient';

// Helper to check if string is ObjectId
function isObjectId(str) {
  return mongoose.Types.ObjectId.isValid(str);
}

// Helper to log page access for monitoring
function logPageAccess(identifier, accessType, userAgent) {
  const timestamp = new Date().toISOString();
  console.log(`[PAGE] ${timestamp} | /blog/${identifier} | ${accessType} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

async function getTechBlog(blog_id) {
  try {
    const conn = await connectDB();
    if (!conn) {
      throw new Error('Database connection failed');
    }
    
    let techBlog;
    
    // First, try to find by slug
    if (!isObjectId(blog_id)) {
      techBlog = await TechBlog.findOne({ 
        slug: blog_id.toLowerCase().trim(),
        status: 'published'
      }).exec(); // Add .exec() to ensure promise is returned
      
      if (techBlog) {
        logPageAccess(blog_id, 'SLUG-SUCCESS', '');
        return { techBlog, accessType: 'slug' };
      }
    }
    
    // If not found by slug and it's a valid ObjectId, try ObjectId
    if (isObjectId(blog_id)) {
      techBlog = await TechBlog.findOne({ 
        _id: blog_id,
        status: 'published'
      }).lean();
      
      if (techBlog) {
        logPageAccess(blog_id, 'OBJECTID-SUCCESS', '');
        return { techBlog, accessType: 'objectId' };
      }
    }
    
    logPageAccess(blog_id, 'NOT-FOUND', '');
    return null;
    
  } catch (error) {
    console.error('Error fetching tech blog:', error);
    logPageAccess(blog_id, 'ERROR', '');
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { blog_id } = params;
  
  try {
    const result = await getTechBlog(blog_id);
    
    if (!result) {
      return {
        title: 'Blog Post Not Found - Ajithkumar R',
        description: 'The requested blog post could not be found. Browse other tech articles by Ajithkumar R.',
        robots: 'noindex, nofollow'
      };
    }
    
    const { techBlog, accessType } = result;
    
    // All canonical and OG URLs should use techBlog.slug if available
    const canonicalUrl = techBlog.slug 
      ? `https://www.ajithkumarr.com/blog/${techBlog.slug}`
      : `https://www.ajithkumarr.com/blog/${techBlog._id}`;
    
    return {
      title: `${techBlog.title} - Ajithkumar R`,
      description: techBlog.metaDescription || techBlog.excerpt || `${techBlog.title} - A technical blog post by Ajithkumar R`,
      keywords: techBlog.tags ? techBlog.tags.join(', ') : 'web development, programming, technology',
      authors: [{ name: techBlog.author?.name || 'Ajithkumar R' }],
      creator: techBlog.author?.name || 'Ajithkumar R',
      publisher: 'Ajithkumar R',
      robots: accessType === 'objectId' ? 'noindex, nofollow, noarchive, nosnippet' : 'index, follow',
      canonical: canonicalUrl,
      openGraph: {
        title: techBlog.seo?.ogTitle || techBlog.title,
        description: techBlog.seo?.ogDescription || techBlog.metaDescription || techBlog.excerpt,
        url: canonicalUrl,
        siteName: 'Ajithkumar R',
        type: 'article',
        publishedTime: techBlog.publishedAt,
        modifiedTime: techBlog.updatedAt,
        authors: [techBlog.author?.name || 'Ajithkumar R'],
        section: techBlog.category,
        tags: techBlog.tags,
        images: techBlog.images?.large ? [{
          url: techBlog.images.large,
          width: 1200,
          height: 630,
          alt: techBlog.title
        }] : undefined
      },
      twitter: {
        card: 'summary_large_image',
        title: techBlog.seo?.twitterTitle || techBlog.title,
        description: techBlog.seo?.twitterDescription || techBlog.metaDescription || techBlog.excerpt,
        creator: '@ajithkumarr',
        images: techBlog.images?.large ? [techBlog.images.large] : undefined
      },
      alternates: {
        canonical: canonicalUrl
      },
      other: {
        'article:author': techBlog.author?.name || 'Ajithkumar R',
        'article:section': techBlog.category,
        'article:published_time': techBlog.publishedAt,
        'article:modified_time': techBlog.updatedAt,
        'article:tag': techBlog.tags?.join(',') || ''
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tech Blog - Ajithkumar R',
      description: 'Technical blog posts by Ajithkumar R',
      robots: 'noindex, nofollow'
    };
  }
}

// JSON-LD structured data for better SEO
function generateStructuredData(techBlog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: techBlog.title,
    description: techBlog.metaDescription || techBlog.excerpt,
    image: techBlog.images?.large || techBlog.images?.medium,
    author: {
      '@type': 'Person',
      name: techBlog.author?.name || 'Ajithkumar R',
      email: techBlog.author?.email || 'contact@ajithkumarr.com',
      url: 'https://www.ajithkumarr.com/about'
    },
    publisher: {
      '@type': 'Person',
      name: 'Ajithkumar R',
      url: 'https://www.ajithkumarr.com'
    },
    datePublished: techBlog.publishedAt,
    dateModified: techBlog.updatedAt || techBlog.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.ajithkumarr.com/blog/${techBlog.slug || techBlog._id}`
    },
    keywords: techBlog.tags?.join(', ') || '',
    articleSection: techBlog.category,
    wordCount: techBlog.wordCount,
    timeRequired: `PT${techBlog.readTime || 5}M`,
    inLanguage: 'en-US'
  };
}

// Main page component
export default async function BlogDetailPage({ params }) {
  const { blog_id } = params;
  let techBlog = null;
  let accessType = null;

  if (mongoose.Types.ObjectId.isValid(blog_id)) {
    try {
      techBlog = await TechBlog.findById(blog_id).lean();
      if (techBlog) accessType = 'objectId';
    } catch (e) {}
  }
  if (!techBlog) {
    techBlog = await TechBlog.findOne({ slug: blog_id }).lean();
    if (techBlog) accessType = 'slug';
  }
  if (!techBlog) {
    return notFound();
  }
  
  // Don't redirect ObjectId URLs to avoid "Page with redirect" SEO issues
  // Instead, let canonical URLs and robots.txt handle proper indexing
  
  // Convert MongoDB _id to string for client component
  const techBlogData = {
    ...techBlog,
    _id: techBlog._id.toString(),
    createdAt: techBlog.createdAt?.toISOString(),
    updatedAt: techBlog.updatedAt?.toISOString(),
    publishedAt: techBlog.publishedAt?.toISOString(),
    lastModified: techBlog.lastModified?.toISOString()
  };
  
  const structuredData = generateStructuredData(techBlogData);
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <BlogDetailClient blog={techBlog} blogId={techBlog._id.toString()} />
    </>
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    await connectDB();
    
    // Only generate for published tech blogs with slugs
    const techBlogs = await TechBlog.find({ 
      status: 'published',
      slug: { $exists: true, $nin: [null, ''] }
    })
    .select('slug')
    .limit(100) // Limit for build performance
    .lean();
    
    return techBlogs.map((techBlog) => ({
      blog_id: techBlog.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Configure dynamic behavior
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour