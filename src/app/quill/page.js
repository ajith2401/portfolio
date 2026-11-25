// src/app/quill/page.js - Server Component
import { Suspense } from 'react';
import QuillClientPage from './QuillClientPage';
import { listPublishedCards } from '@/lib/public-writings';

// Metadata must be in a server component, not a client component
export const revalidate = 60;

export const metadata = {
  title: "Tamil Writings, Poems and Stories",
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
    title: "Tamil Writings, Poems and Stories",
    description: "Explore the literary works of Ajithkumar R - published Tamil writer with 5 poetry books exploring themes of feminism, social justice, and human emotions.",
    url: "https://www.ajithkumarr.com/quill",
    type: "website",
    siteName: "Ajithkumar R",
    images: [
      {
        url: "https://www.ajithkumarr.com/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar R - Tamil Writer & Poet"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tamil Writings, Poems and Stories",
    description: "Explore the literary works of Ajithkumar R - published Tamil writer with 5 poetry books exploring themes of feminism, social justice, and human emotions.",
    images: ["https://www.ajithkumarr.com/twitter-image.jpg"],
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
export default async function QuillPage(props) {
  const searchParams = await props.searchParams;
  let initialWritings = [];
  let initialPagination = {
    total: 0,
    pages: 1,
    current: 1,
    limit: 12
  };

  try {
    const page = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1);
    const limit = 12;
    const category = searchParams?.category && searchParams.category !== 'All Writings'
      ? String(searchParams.category).slice(0, 50) : undefined;

    const first = await listPublishedCards({ category, skip: 0, limit: 1 });
    const total = first.total;
    const totalPages = Math.ceil(total / limit) || 1;
    const safePage = Math.min(page, totalPages);
    const { cards } = await listPublishedCards({ category, skip: (safePage - 1) * limit, limit });

    // Public cards only: no body, ratings or revisions reach the client.
    initialWritings = cards.map((c) => ({
      _id: c.id,
      title: c.title,
      body: c.excerpt || '',
      excerpt: c.excerpt || '',
      category: c.category,
      images: c.images,
      publishedAt: c.publishedAt,
      createdAt: c.publishedAt,
      averageRating: 0,
      totalRatings: 0,
      readTime: c.readTime || null,
      slug: c.slug,
      wordCount: c.wordCount || 0
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
