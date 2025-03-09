// src/app/spotlight/[id]/page.js
import { Book } from '@/models';
import BookDetailClient from './BookDetailClient.jsx';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';

export async function generateMetadata({ params }) {
  await connectDB();
  
  try {
    const book = await Book.findById(params.id).lean();
    
    if (!book) return { title: 'Book Not Found' };
    
    // Clean up the text for description
    const cleanDescription = (text) => {
      if (!text) return '';
      return text.substring(0, 160).replace(/\n/g, ' ').trim();
    };
    
    const description = cleanDescription(book.description);
    
    // Safely handle dates
    let publishDate;
    try {
      if (book.publishYear) {
        publishDate = new Date(book.publishYear, 0).toISOString();
      } else if (book.createdAt) {
        publishDate = book.createdAt instanceof Date 
          ? book.createdAt.toISOString() 
          : new Date(book.createdAt).toISOString();
      }
    } catch (error) {
      console.error("Date conversion error in metadata:", error);
      publishDate = new Date().toISOString();
    }
    
    return {
      title: `${book.title} | Tamil Poetry by Ajith Kumar`,
      description: description,
      keywords: [
        'tamil poetry', 
        'tamil literature', 
        book.title, 
        'Ajith Kumar', 
        book.publisher, 
        'tamil poems', 
        'poetry collection'
      ],
      authors: [{ name: 'Ajith Kumar' }],
      category: 'Poetry',
      alternates: {
        canonical: `https://www.ajithkumarr.com/spotlight/${params.id}`,
      },
      openGraph: {
        title: book.title,
        description: description,
        url: `https://www.ajithkumarr.com/spotlight/${params.id}`,
        type: 'book',
        publishedTime: publishDate,
        authors: ['Ajith Kumar'],
        images: [
          {
            url: book.coverImage || 'https://www.ajithkumarr.com/og-image.jpg',
            width: 1200,
            height: 630,
            alt: book.title,
          },
        ],
        locale: 'ta_IN',
        siteName: 'Ajith Kumar Poetry'
      },
      twitter: {
        card: 'summary_large_image',
        title: book.title,
        description: description,
        images: [book.coverImage || 'https://www.ajithkumarr.com/twitter-image.jpg'],
      },
      // Schema.org structured data specifically for books
      bookInfo: {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.title,
        "author": {
          "@type": "Person",
          "name": "Ajith Kumar"
        },
        "publisher": {
          "@type": "Organization",
          "name": book.publisher
        },
        "inLanguage": "ta",
        "datePublished": publishDate,
        "image": book.coverImage,
        "description": description
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: 'Book Details | Ajith Kumar' };
  }
}

export default async function BookDetailPage({ params }) {
  await connectDB();
  
  try {
    // Fetch initial data for server-side rendering
    const book = await Book.findById(params.id);
    
    if (!book) {
      return notFound();
    }
    
    // Create a safe object for serialization - with explicit mapping of all nested objects
    const safeBook = {
      _id: book._id.toString(),
      title: book.title || '',
      description: book.description || '',
      publisher: book.publisher || '',
      publishYear: book.publishYear || null,
      isbn: book.isbn || '',
      language: book.language || '',
      pageCount: book.pageCount || 0,
      coverImage: book.coverImage || '',
      price: book.price || 0,
      featured: book.featured || false,
      purchaseLinks: book.purchaseLinks ? {
        amazon: book.purchaseLinks.amazon || '',
        flipkart: book.purchaseLinks.flipkart || '',
        other: book.purchaseLinks.other || ''
      } : {},
      poems: Array.isArray(book.poems) ? book.poems.map(poem => ({
        title: poem.title || '',
        content: poem.content || '',
        translation: poem.translation || '',
        pageNumber: poem.pageNumber || 0,
        tags: Array.isArray(poem.tags) ? [...poem.tags] : []
      })) : [],
      reviews: Array.isArray(book.reviews) ? book.reviews.map(review => ({
        name: review.name || '',
        rating: review.rating || 0,
        comment: review.comment || '',
        date: review.date ? review.date.toString() : ''
      })) : [],
      createdAt: book.createdAt ? book.createdAt.toISOString() : null,
      updatedAt: book.updatedAt ? book.updatedAt.toISOString() : null
    };
    
    // Find related books (same publisher or similar year)
    const relatedBooks = await Book.find({
      _id: { $ne: book._id },
      $or: [
        { publisher: book.publisher },
        { publishYear: { $gte: (book.publishYear || 2000) - 2, $lte: (book.publishYear || 2000) + 2 } }
      ]
    }).limit(3).lean();
    
    // Explicitly map related books to safe objects
    const safeRelatedBooks = relatedBooks.map(relatedBook => ({
      _id: relatedBook._id.toString(),
      title: relatedBook.title || '',
      coverImage: relatedBook.coverImage || '',
      publisher: relatedBook.publisher || '',
      publishYear: relatedBook.publishYear || null,
      price: relatedBook.price || 0
    }));
    
    // Pass the safely serialized data to the client component
    return <BookDetailClient 
      book={safeBook} 
      relatedBooks={safeRelatedBooks} 
    />;
  } catch (error) {
    console.error("Error in BookDetailPage:", error);
    return notFound();
  }
}