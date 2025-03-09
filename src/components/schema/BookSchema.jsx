// src/components/schemas/BookSchema.jsx
'use client';

import React from 'react';

export default function BookSchema({ book }) {
  if (!book) return null;
  
  const bookData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title || "",
    "author": {
      "@type": "Person",
      "name": "Ajith Kumar"
    },
    "publisher": {
      "@type": "Organization",
      "name": book.publisher || ""
    },
    "inLanguage": "ta",
    "datePublished": book.publishYear ? `${book.publishYear}` : undefined,
    "image": book.coverImage || "",
    "description": book.description ? book.description.substring(0, 500) : "",
    "isbn": book.isbn || "",
    "numberOfPages": book.pageCount || "",
    "offers": {
      "@type": "Offer",
      "price": book.price || "",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(bookData)
      }}
    />
  );
}