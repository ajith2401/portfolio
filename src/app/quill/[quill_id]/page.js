// src/app/quill/[quill_id]/page.js
import { notFound, redirect } from 'next/navigation';
import { Writing } from '@/models/writings.model';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import WritingDetailClient from './WritingDetailClient';

// Helper to check if string is ObjectId
function isObjectId(str) {
  return mongoose.Types.ObjectId.isValid(str);
}

// Helper to log page access for monitoring
function logPageAccess(identifier, accessType, userAgent) {
  const timestamp = new Date().toISOString();
  console.log(`[PAGE] ${timestamp} | /quill/${identifier} | ${accessType} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

async function getWriting(quill_id) {
  try {
    await connectDB();
    
    let writing;
    
    // First, try to find by slug
    if (!isObjectId(quill_id)) {
      writing = await Writing.findOne({ 
        slug: quill_id.toLowerCase().trim(),
        status: 'published'
      }).lean();
      
      if (writing) {
        logPageAccess(quill_id, 'SLUG-SUCCESS', '');
        return { writing, accessType: 'slug' };
      }
    }
    
    // If not found by slug and it's a valid ObjectId, try ObjectId
    if (isObjectId(quill_id)) {
      writing = await Writing.findOne({ 
        _id: quill_id,
        status: 'published'
      }).lean();
      
      if (writing) {
        logPageAccess(quill_id, 'OBJECTID-SUCCESS', '');
        return { writing, accessType: 'objectId' };
      }
    }
    
    logPageAccess(quill_id, 'NOT-FOUND', '');
    return null;
    
  } catch (error) {
    console.error('Error fetching writing:', error);
    logPageAccess(quill_id, 'ERROR', '');
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { quill_id } = params;
  
  try {
    const result = await getWriting(quill_id);
    
    if (!result) {
      return {
        title: 'Writing Not Found - Ajithkumar R',
        description: 'The requested writing could not be found. Browse other writings by Ajithkumar R.',
        robots: 'noindex, nofollow'
      };
    }
    
    const { writing, accessType } = result;
    
    // If accessed by ObjectId but has slug, set canonical to slug URL
    const canonicalUrl = writing.slug 
      ? `https://www.ajithkumarr.com/quill/${writing.slug}`
      : `https://www.ajithkumarr.com/quill/${writing._id}`;
    
    return {
      title: `${writing.title} - Ajithkumar R`,
      description: writing.metaDescription || writing.excerpt || `${writing.title} - A Tamil writing by Ajithkumar R`,
      keywords: writing.tags ? writing.tags.join(', ') : 'Tamil writing, poetry, literature',
      authors: [{ name: 'Ajithkumar R' }],
      creator: 'Ajithkumar R',
      publisher: 'Ajithkumar R',
      robots: accessType === 'objectId' ? 'noindex, nofollow' : 'index, follow',
      canonical: canonicalUrl,
      openGraph: {
        title: writing.seo?.ogTitle || writing.title,
        description: writing.seo?.ogDescription || writing.metaDescription || writing.excerpt,
        url: canonicalUrl,
        siteName: 'Ajithkumar R',
        type: 'article',
        publishedTime: writing.publishedAt,
        modifiedTime: writing.updatedAt,
        authors: ['Ajithkumar R'],
        section: writing.category,
        tags: writing.tags,
        images: writing.images?.large ? [{
          url: writing.images.large,
          width: 1200,
          height: 630,
          alt: writing.title
        }] : undefined
      },
      twitter: {
        card: 'summary_large_image',
        title: writing.seo?.twitterTitle || writing.title,
        description: writing.seo?.twitterDescription || writing.metaDescription || writing.excerpt,
        creator: '@ajithkumarr',
        images: writing.images?.large ? [writing.images.large] : undefined
      },
      alternates: {
        canonical: canonicalUrl
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Writing - Ajithkumar R',
      description: 'Tamil writings by Ajithkumar R',
      robots: 'noindex, nofollow'
    };
  }
}

// Main page component
export default async function WritingDetailPage({ params }) {
  const { quill_id } = params;
  
  // Get writing data
  const result = await getWriting(quill_id);
  
  if (!result) {
    notFound();
  }
  
  const { writing, accessType } = result;
  
  // If accessed by ObjectId but has slug, redirect to slug URL
  if (accessType === 'objectId' && writing.slug) {
    redirect(`/quill/${writing.slug}`);
  }
  
  // Convert MongoDB _id to string for client component
  const writingData = {
    ...writing,
    _id: writing._id.toString(),
    createdAt: writing.createdAt?.toISOString(),
    updatedAt: writing.updatedAt?.toISOString(),
    publishedAt: writing.publishedAt?.toISOString(),
    lastModified: writing.lastModified?.toISOString()
  };
  
  return (
    <WritingDetailClient 
      writing={writingData} 
      accessType={accessType}
    />
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    await connectDB();
    
    // Only generate for published writings with slugs
    const writings = await Writing.find({ 
      status: 'published',
      slug: { $exists: true, $ne: null, $ne: '' }
    })
    .select('slug')
    .limit(100) // Limit for build performance
    .lean();
    
    return writings.map((writing) => ({
      quill_id: writing.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Configure dynamic behavior
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour