// src/components/schema/BookSchema.jsx
'use client';

import React from 'react';

export default function BookSchema({ book }) {
  if (!book) return null;
  
  // Format date safely
  const formatDate = (year) => {
    if (!year) return undefined;
    
    try {
      // If it's just a year, format as YYYY
      if (typeof year === 'number' || /^\d{4}$/.test(year)) {
        return `${year}`;
      }
      
      // Otherwise attempt to format as ISO date
      return new Date(year).toISOString().split('T')[0];
    } catch (error) {
      console.error("Date formatting error in BookSchema:", error);
      return undefined;
    }
  };
  
  // Calculate average rating if available
  const calculateRating = () => {
    if (!book.reviews || book.reviews.length === 0) return undefined;
    
    const sum = book.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    const avg = sum / book.reviews.length;
    
    return {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(avg.toFixed(1)),
      "reviewCount": book.reviews.length,
      "bestRating": 5,
      "worstRating": 1
    };
  };
  
  // Prepare the book schema data
  const bookData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `https://ajithkumarr.com/spotlight/${book._id}#book`,
    "name": book.title || "Tamil Poetry Book",
    "headline": book.title || "Tamil Poetry Book",
    "author": {
      "@type": "Person",
      "@id": "https://ajithkumarr.com/#ajithkumar",
      "name": "Ajithkumar",
      "description": "Tamil writer and poet with 5 published books, exploring themes of feminism, social justice, and human emotions through captivating poetry.",
      "url": "https://ajithkumarr.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": book.publisher || "Ajithkumar Publications",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ajithkumarr.com/images/logo.png"
      }
    },
    "inLanguage": "ta",
    "datePublished": formatDate(book.publishYear),
    "image": book.coverImage || "https://ajithkumarr.com/opengraph-image.jpg",
    "description": book.description ? book.description.substring(0, 500).replace(/[\r\n]+/g, ' ') : "Tamil poetry book by Ajithkumar exploring themes of feminism, social justice, and human emotions",
    "isbn": book.isbn || "",
    "numberOfPages": book.pageCount || "",
    "bookFormat": "Paperback",
    "potentialAction": {
      "@type": "ReadAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://ajithkumarr.com/spotlight/${book._id}`
      }
    },
    "aggregateRating": calculateRating(),
    "offers": book.price ? {
      "@type": "Offer",
      "price": book.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": book.purchaseLinks?.amazon || book.purchaseLinks?.flipkart || book.purchaseLinks?.other || `https://ajithkumarr.com/spotlight/${book._id}`
    } : undefined,
    "isPartOf": {
      "@type": "Collection",
      "name": "Tamil Poetry Books by Ajithkumar",
      "description": "Collection of 5 published Tamil poetry books by Ajithkumar, exploring themes of feminism, social justice and human emotions",
      "keywords": "Tamil poetry, Ajithkumar writer, Tamil literature, feminist poetry, social justice poetry"
    }
  };
  
  // Add review data if available
  if (book.reviews && book.reviews.length > 0) {
    bookData.review = book.reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name || "Reader"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating || 5,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.comment || "",
      "datePublished": review.date ? new Date(review.date).toISOString().split('T')[0] : undefined
    }));
  }
  
  // Add sample poems as content snippets if available
  if (book.poems && book.poems.length > 0) {
    bookData.workExample = book.poems.slice(0, 3).map(poem => ({
      "@type": "CreativeWork",
      "name": poem.title || "Tamil Poem",
      "text": poem.content ? poem.content.substring(0, 200).replace(/[\r\n]+/g, ' ') + '...' : "",
      "inLanguage": "ta",
      "isPartOf": {
        "@type": "Book",
        "@id": `https://ajithkumarr.com/spotlight/${book._id}#book`
      }
    }));
  }
  
  // Clean up undefined properties
  const cleanBookData = JSON.parse(JSON.stringify(bookData));
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanBookData)
      }}
    />
  );
}