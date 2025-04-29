// src/app/quill/page.js - Server Component
import { Suspense } from 'react';
import QuillClientPage from './QuillClientPage';

// Metadata must be in a server component, not a client component
export const metadata = {
  title: "Ajithkumar | Tamil Writer & Poet",
  description: "Explore the literary works of Ajithkumar - published Tamil writer with 5 poetry books exploring themes of feminism, social justice, and human emotions through nuanced Tamil poetry.",
  keywords: [
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
    canonical: "https://ajithkumarr.com/quill",
  },
  openGraph: {
    title: "Ajithkumar | Tamil Writer & Poet",
    description: "Explore the literary works of Ajithkumar - published Tamil writer with 5 poetry books exploring themes of feminism and social justice.",
    url: "https://ajithkumarr.com/quill",
    type: "website",
    images: [
      {
        url: "/og-image-writer.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar - Tamil Writer & Poet"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajithkumar | Tamil Writer & Poet",
    description: "Explore the literary works of Ajithkumar - published Tamil writer with 5 poetry books exploring themes of feminism and social justice.",
    images: ["/twitter-image-writer.jpg"],
    creator: "@ajithkumarr"
  }
};

// Main QuillPage component (server component)
export default function QuillPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Writings...</h2>
          <p className="text-gray-500">Please wait while we fetch the content.</p>
        </div>
      </div>
    }>
      <QuillClientPage />
    </Suspense>
  );
}