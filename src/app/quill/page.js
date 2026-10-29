// src/app/quill/page.js - Server Component
import { Suspense } from 'react';
import QuillClientPage from './QuillClientPage';
import connectDB from '@/lib/db';
import { Writing } from '@/models';

// Metadata must be in a server component, not a client component
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata = {
  title: "Ajithkumar R | Tamil Writer & Poet",
  description: "Explore the literary works of Ajithkumar R - published Tamil writer with 5 poetry books exploring themes of feminism, social justice, identity, and human emotions through nuanced Tamil poetry.",
  keywords: [
    "Ajithkumar R",
    "Ajithkumar writer", 
    "Tamil poet", 
    "published Tamil author",
    "Tamil poetry books", 
    "Tamil literature", 
    "feminist poetry", 
    "social justice poetry", 
    "contemporary Tamil writer",
    "Indian Tamil poet",
    "Tamil essays"
  ],
  alternates: {
    canonical: "https://www.ajithkumarr.com/quill",
  },
  openGraph: {
    title: "Ajithkumar R | Tamil Writer & Poet",
    description: "Explore the literary works of Ajithkumar R - published Tamil writer with 5 poetry books exploring themes of feminism, social justice, and human emotions.",
    url: "https://www.ajithkumarr.com/quill",
    type: "website",
    images: [
      {
        url: "/og-image-writer.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar R - Tamil Writer & Poet"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajithkumar R | Tamil Writer & Poet",
    description: "Explore the literary works of Ajithkumar R - published Tamil writer with 5 poetry books exploring themes of feminism, social justice, and human emotions.",
    images: ["/twitter-image-writer.jpg"],
    creator: "@ajithkumarr"
  }
};

// Loading component for Suspense
function QuillLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-primary">Loading Writings...</h2>
        <p className="text-secondary">Please wait while we fetch the content.</p>
      </div>
    </div>
  );
}

// Main QuillPage component (server component)
export default async function QuillPage({ searchParams }) {
  let initialWritings = [];
  let initialPagination = {
    total: 0,
    pages: 1,
    current: 1,
    limit: 12
  };

  try {
    await connectDB();
    const page = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1);
    const limit = 12;
    const query = {
      status: 'published',
      wordCount: { $gte: 50 }
    };

    if (searchParams?.category && searchParams.category !== 'All Writings') {
      query.category = searchParams.category;
    }

    const total = await Writing.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const writings = await Writing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title body excerpt category images publishedAt createdAt readTime slug status wordCount averageRating totalRatings')
      .lean();

    initialWritings = writings.map((writing) => ({
      _id: writing._id.toString(),
      title: writing.title,
      body: writing.body,
      excerpt: writing.excerpt || '',
      category: writing.category,
      images: writing.images || null,
      publishedAt: writing.publishedAt ? new Date(writing.publishedAt).toISOString() : null,
      createdAt: writing.createdAt ? new Date(writing.createdAt).toISOString() : null,
      averageRating: writing.averageRating || 0,
      totalRatings: writing.totalRatings || 0,
      readTime: writing.readTime || null,
      slug: writing.slug || writing._id.toString(),
      wordCount: writing.wordCount || 0
    }));

    initialPagination = {
      total,
      pages: totalPages,
      current: safePage,
      limit
    };
  } catch (error) {
    console.error('Error prefetching quill writings on server:', error);
  }

  return (
    <Suspense fallback={<QuillLoading />}>
      <QuillClientPage 
        initialWritings={initialWritings} 
        initialPagination={initialPagination} 
      />
    </Suspense>
  );
}
