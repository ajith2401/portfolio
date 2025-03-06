// src/app/quill/[quill_id]/page.js
import { Writing } from '@/models';
import connectDB from '@/lib/db';
import WritingDetailClient from './WritingDetailClient';

export async function generateMetadata({ params }) {
  await connectDB();
  const writing = await Writing.findById(params.quill_id);
  
  if (!writing) return { title: 'Writing Not Found' };
  
  // Clean up the text for description
  const plainTextBody = writing.body
    ? writing.body
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags if any
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .trim()
    : '';
    
  const description = writing.subtitle || plainTextBody.substring(0, 160);
  
  // Safely handle dates
  let publishedTime, modifiedTime;
  
  try {
    // Handle createdAt date
    if (writing.createdAt) {
      publishedTime = writing.createdAt instanceof Date 
        ? writing.createdAt.toISOString() 
        : new Date(writing.createdAt).toISOString();
    }
    
    // Handle updatedAt date
    if (writing.updatedAt) {
      modifiedTime = writing.updatedAt instanceof Date 
        ? writing.updatedAt.toISOString() 
        : new Date(writing.updatedAt).toISOString();
    }
  } catch (error) {
    console.error("Date conversion error in metadata:", error);
    // Use undefined as fallback
  }
  
  return {
    title: writing.title,
    description: description,
    keywords: [writing.category, 'Tamil writing', 'poetry', 'Ajithkumar', 'Tamil literature'].filter(Boolean),
    authors: [{ name: 'Ajithkumar' }],
    category: writing.category,
    openGraph: {
      title: writing.title,
      description: description,
      url: `https://www.ajithkumarr.com/quill/${params.quill_id}`,
      type: 'article',
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: ['Ajithkumar'],
      images: [
        {
          url: writing.images?.large || 'https://www.ajithkumarr.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: writing.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: writing.title,
      description: description,
      images: [writing.images?.large || 'https://www.ajithkumarr.com/twitter-image.jpg'],
    }
  };
}

export default async function WritingDetailPage({ params }) {
  await connectDB();
  
  try {
    // Fetch initial data for server-side rendering
    const writing = await Writing.findById(params.quill_id);
    
    if (!writing) {
      return <div className="min-h-screen flex items-center justify-center">Writing not found</div>;
    }
    
    // Create a safe object for serialization
    const safeWriting = {
      _id: writing._id.toString(),
      title: writing.title,
      subtitle: writing.subtitle,
      body: writing.body,
      category: writing.category,
      images: writing.images || {},
      // Convert dates to ISO strings explicitly
      createdAt: writing.createdAt ? writing.createdAt.toISOString() : null,
      updatedAt: writing.updatedAt ? writing.updatedAt.toISOString() : null,
      // Include other fields as needed
      averageRating: writing.averageRating,
      totalRatings: writing.totalRatings
    };
    
    // Pass the safely serialized data to the client component
    return <WritingDetailClient 
      initialWriting={safeWriting} 
      quillId={params.quill_id} 
    />;
  } catch (error) {
    console.error("Error in WritingDetailPage:", error);
    return <div className="min-h-screen flex items-center justify-center text-red-500">
      Error loading writing details. Please try again later.
    </div>;
  }
}