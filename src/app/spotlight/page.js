// src/app/spotlight/page.js
import SpotlightClient from "./SpotlightClient.jsx";
import { Book } from "@/models";
import { Suspense } from "react";
import connectDB from "@/lib/db";

// Enhanced metadata for better SEO
export const metadata = {
  title: "Tamil Poetry Books | Ajith Kumar",
  description: "Explore a collection of Tamil poetry books by Ajith Kumar, exploring themes of love, feminism, social justice and human emotions.",
  keywords: ["Tamil poetry", "Ajith Kumar", "Tamil literature", "Tamil books", "Indian poetry", "feminism", "social justice"],
  openGraph: {
    title: "Tamil Poetry Books | Ajith Kumar",
    description: "Discover the poetic works of Ajith Kumar spanning themes of love, social justice, and contemporary Tamil culture.",
    images: [
      {
        url: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197427/books/aznatozjb3eaqfavh3nb.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajith Kumar Tamil Poetry Books Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tamil Poetry Books | Ajith Kumar",
    description: "Discover the poetic works of Ajith Kumar spanning themes of love, social justice, and contemporary Tamil culture.",
    images: ['https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197427/books/aznatozjb3eaqfavh3nb.jpg'],
  }
};

// Loading component for Suspense
function SpotlightLoading() {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
  </div>
}

// Server component for better SEO
export default async function SpotlightPage() {
  await connectDB();
  
  // Pre-render the page with initial data
  const books = await Book.find({})
    .sort({ publishYear: -1 })
    .lean();

  // Music videos data
  const musicVideos = [
    {
      title: "நாளும் புதிது",
      link: "https://youtu.be/CC_1fzAUmUc",
      thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741198342/youtube_songs/ht8d48m8ugzorirnz7ab.png"
    },
    {
      title: "தாலாட்டு",
      link: "https://youtu.be/3YlqopnlVXA",
      thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741198879/youtube_songs/i9ad7cd6o4aiwhfjqohf.png"
    },
    {
      title: "அன்பின் கீர்த்தனை",
      link: "https://youtu.be/TWW-VgZMrYs",
      thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741199027/youtube_songs/jilq54jvngutbkw1ps4z.png"
    },
    {
      title: "காட்டுச் சிறுக்கி",
      link: "https://youtu.be/zGxt7DU9Sl4",
      thumbnail: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741199188/youtube_songs/db4kyg5msvxiy4enkvjq.png"
    }
  ];

 // Use a safer approach:
const safeBooks = books.map(book => ({
  _id: book._id.toString(),
  title: book.title,
  description: book.description,
  coverImage: book.coverImage,
  publishYear: book.publishYear,
  isbn: book.isbn,
  language: book.language,
  pageCount: book.pageCount,
  publisher: book.publisher,
  featured: book.featured,
  price: book.price,
  purchaseLinks: book.purchaseLinks ? {
    amazon: book.purchaseLinks.amazon || '',
    flipkart: book.purchaseLinks.flipkart || '',
    other: book.purchaseLinks.other || ''
  } : {},
  // Only include specific fields from arrays to avoid potential circular refs
  poems: (book.poems || []).map(poem => ({
    title: poem.title || '',
    content: poem.content || '',
    translation: poem.translation || ''
  })),
  reviews: (book.reviews || []).map(review => ({
    name: review.name || '',
    rating: review.rating || 0,
    comment: review.comment || '',
    date: review.date ? review.date.toString() : ''
  })),
  createdAt: book.createdAt ? book.createdAt.toString() : null,
  updatedAt: book.updatedAt ? book.updatedAt.toString() : null
}));


return <SpotlightClient initialBooks={safeBooks} musicVideos={musicVideos} />;
}