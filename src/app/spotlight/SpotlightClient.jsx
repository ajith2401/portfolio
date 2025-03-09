'use client'
// src/app/spotlight/SpotlightClient.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Book, Music, ChevronRight, ShoppingCart, X } from 'lucide-react';
import { useGetBooksQuery } from '@/services/api';

const SpotlightClient = ({ initialBooks = [], musicVideos = [] }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Use RTK Query to fetch books (will use initialBooks if available)
  const { data: books = initialBooks, isLoading, error } = useGetBooksQuery(undefined, {
    // Skip the query if we already have initial books
    skip: initialBooks.length > 0
  });

  // Ensure all data is valid before rendering
  const validBooks = Array.isArray(books) ? books : [];
  const validMusicVideos = Array.isArray(musicVideos) ? musicVideos : [];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="w-full py-8 sm:py-12 lg:py-16 px-4 mb-4 sm:mb-6 lg:mb-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-custom-56 font-dm-sans font-semibold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
          Tamil <span className="text-primary-500">Poetry</span> Books
        </h1>
        <p className="w-full max-w-[874px] mx-auto px-4 sm:px-6 lg:px-8 
           text-center font-work-sans 
           text-base sm:text-lg lg:text-[22px] 
           leading-[20px] sm:leading-[24px] lg:leading-[26px] 
           font-normal text-secondary-600">
          Exploring themes of feminism, social justice, and love through nuanced Tamil poetry that speaks to the heart and mind.
        </p>
      </div>
    </div>

      {/* Publications Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Book className="w-8 h-8 text-primary-500" />
            <h2 className="text-3xl font-bold text-foreground">Published Books</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Failed to load books. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {validBooks.map((book) => (
                <article 
                  key={book._id}
                  className="group clean-container p-6 rounded-xl hover:shadow-lg transition-all duration-300
                    hover:translate-y-[-4px] cursor-pointer flex flex-col"
                >
                  <div 
                    className="flex-grow"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="relative h-80 mb-6 overflow-hidden rounded-lg">
                      <Image
                        src={book.coverImage || '/images/fallback-cover.jpg'}
                        alt={book.title || 'Book cover'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          console.error(`Failed to load image: ${book.coverImage}`);
                          e.target.src = '/images/fallback-cover.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white text-sm">Click to view details</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                      {book.title || 'Untitled Book'}
                    </h3>
                    <div className="space-y-2 text-secondary-600">
                      <p><span className="font-medium">Publisher:</span> {book.publisher || 'Unknown'}</p>
                      <p><span className="font-medium">Price:</span> ₹{book.price || '—'}</p>
                      {book.publishYear && (
                        <p><span className="font-medium">Year:</span> {book.publishYear}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-secondary-200">
                    <Link
                      href={`/spotlight/${book._id}`}
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Music & Videos Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Music className="w-8 h-8 text-primary-500" />
            <h2 className="text-3xl font-bold text-foreground">Lyrics & Direction</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {validMusicVideos.map((video, index) => (
              <a
                key={index}
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl aspect-video clean-container"
              >
                <Image
                  src={video.thumbnail || '/images/fallback-thumbnail.jpg'}
                  alt={video.title || 'Music video thumbnail'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load image: ${video.thumbnail}`);
                    e.target.src = '/images/fallback-thumbnail.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/10 
                  flex items-end p-4">
                  <div className="w-full">
                    <h3 className="text-white font-medium mb-2 text-shadow">{video.title || 'Untitled'}</h3>
                    <div className="flex items-center text-white text-sm bg-primary-500/80 px-2 py-1 rounded-md inline-flex">
                      <span>Watch on YouTube</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Book Details Modal */}
      {selectedBook && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedBook(null)}
        >
          <div 
            className="clean-container rounded-2xl max-w-5xl w-full my-8 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 hover:bg-background/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
              {/* Book Image */}
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={selectedBook.coverImage || '/images/fallback-cover.jpg'}
                  alt={selectedBook.title || 'Book cover'}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                    {selectedBook.title || 'Untitled Book'}
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-xl font-semibold text-primary-600">
                      ₹{selectedBook.price || '—'}
                    </span>
                    <span className="text-secondary-600">
                      • {selectedBook.publisher || 'Unknown Publisher'}
                    </span>
                    {selectedBook.publishYear && (
                      <span className="text-secondary-600">
                        • {selectedBook.publishYear}
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose prose-secondary max-w-full">
                  <p className="text-secondary-700 line-clamp-4">
                    {selectedBook.description || 'No description available.'}
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href={`/spotlight/${selectedBook._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <span>Read More</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {selectedBook.purchaseLinks && (
                  <div className="pt-4 border-t border-secondary-200">
                    <p className="text-sm font-medium text-secondary-600 mb-3">
                      Available for Purchase:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedBook.purchaseLinks.amazon && (
                        <a
                          href={selectedBook.purchaseLinks.amazon}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 
                            bg-primary-50 text-primary-700 rounded-full
                            hover:bg-primary-100 transition-colors text-sm
                            shadow-sm hover:shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Amazon
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {selectedBook.purchaseLinks.flipkart && (
                        <a
                          href={selectedBook.purchaseLinks.flipkart}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 
                            bg-primary-50 text-primary-700 rounded-full
                            hover:bg-primary-100 transition-colors text-sm
                            shadow-sm hover:shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Flipkart
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {selectedBook.purchaseLinks.other && (
                        <a
                          href={selectedBook.purchaseLinks.other}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 
                            bg-primary-50 text-primary-700 rounded-full
                            hover:bg-primary-100 transition-colors text-sm
                            shadow-sm hover:shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Online
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SpotlightClient;