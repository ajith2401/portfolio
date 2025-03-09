'use client';
// src/app/spotlight/[id]/BookDetailClient.jsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ShoppingCart, ArrowLeft, Star, BookOpen, Clock, Tag, Share2 } from 'lucide-react';
import { useGetBookByIdQuery } from '@/services/api';
import BookSchema from '@/components/schema/BookSchema';
import DecorativeLine from '@/components/ui/DecorativeLine';
import ShareButtons from '@/components/layout/ShareButtons';

// Markdown Renderer Component
const MarkdownRenderer = ({ content }) => {
  // Return null for empty content
  if (!content) return null;

  // Fix broken image markdown syntax (handles line breaks)
  const fixBrokenImageMarkdown = (text) => {
    // Fix common issue: line breaks between [] and ()
    let fixed = text.replace(/!\[(.*?)\][ \t\r\n]*\([ \t\r\n]*(https?:\/\/[^)]+)[ \t\r\n]*\)/g, '![$1]($2)');
    
    // Fix extra closing parenthesis on separate line
    fixed = fixed.replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\n\)/g, '![$1]($2)');
    
    // Convert bare image URLs to proper markdown
    fixed = fixed.replace(/^(https?:\/\/\S+\.(jpg|jpeg|png|gif|webp))$/gim, '![Image]($1)');
    
    return fixed;
  };
  
  // Process markdown content
  const processMarkdown = (mdContent) => {
    // First fix any broken image markdown
    let processedContent = fixBrokenImageMarkdown(mdContent);
    
    let html = processedContent;
    
    // Process code blocks first to avoid conflicts with other formatting
    html = html.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
      return `<pre class="bg-gray-100 p-3 my-3 rounded overflow-x-auto"><code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>');
    
    // Process headings (match at line beginning)
    html = html.replace(/^# (.*)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>');
    html = html.replace(/^## (.*)$/gm, '<h2 class="text-2xl font-bold mt-5 mb-2">$1</h2>');
    html = html.replace(/^### (.*)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
    
    // Process blockquotes - handle multi-line blockquotes
    html = html.replace(/^> (.*)(?:\n^> (.*))*$/gm, (match) => {
      const content = match.split('\n')
        .map(line => line.replace(/^> (.*)$/, '$1'))
        .join('<br>');
      return `<blockquote class="border-l-4 border-gray-300 pl-4 py-1 my-4 italic text-gray-700">${content}</blockquote>`;
    });
    
    // Process ordered lists - match consecutive numbered lines
    html = html.replace(/^(\d+)\. (.*)(?:\n^(\d+)\. (.*))*$/gm, (match) => {
      const items = match.split('\n')
        .map(line => {
          const itemMatch = line.match(/^(\d+)\. (.*)$/);
          return itemMatch ? `<li>${itemMatch[2]}</li>` : line;
        })
        .join('');
      return `<ol class="list-decimal pl-6 my-4">${items}</ol>`;
    });
    
    // Process unordered lists - match consecutive bulleted lines
    html = html.replace(/^- (.*)(?:\n^- (.*))*$/gm, (match) => {
      const items = match.split('\n')
        .map(line => {
          const itemMatch = line.match(/^- (.*)$/);
          return itemMatch ? `<li>${itemMatch[1]}</li>` : line;
        })
        .join('');
      return `<ul class="list-disc pl-6 my-4">${items}</ul>`;
    });
    
    // Process text formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Process links with styling
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>');
    
    // Process horizontal rule
    html = html.replace(/^---$/gm, '<hr class="my-6 border-t border-gray-300" />');
    
    // Process paragraphs and line breaks
    // Split into paragraphs on double newlines
    const paragraphs = html.split(/\n\n+/);
    
    html = paragraphs.map(para => {
      // Skip wrapping if paragraph already contains block-level HTML
      if (
        para.startsWith('<h1') || 
        para.startsWith('<h2') || 
        para.startsWith('<h3') || 
        para.startsWith('<ul') || 
        para.startsWith('<ol') || 
        para.startsWith('<blockquote') || 
        para.startsWith('<pre') ||
        para.startsWith('<hr')
      ) {
        return para;
      }
      
      // Regular paragraph handling
      const withLineBreaks = para.replace(/\n/g, '<br>');
      return `<p class="my-3">${withLineBreaks}</p>`;
    }).join('\n\n');
    
    return html;
  };
  
  // We need to detect URLs and render them as images directly
  const renderContent = () => {
    // Process the markdown to HTML
    const processedHtml = processMarkdown(content);
    
    // Replace image markdown with actual image tags
    // This is a safer approach than using dangerouslySetInnerHTML
    const parts = [];
    const regex = /!\[(.*?)\]\((https?:\/\/[^)]+)\)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // Add the text before the image
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ 
            __html: processMarkdown(content.substring(lastIndex, match.index)) 
          }} />
        );
      }
      
      // Extract the alt text and image URL
      const [, altText, imageUrl] = match;
      
      // Add the image component
      parts.push(
        <div key={`img-${match.index}`} className="my-4 text-center">
          <img 
            src={imageUrl} 
            alt={altText} 
            className="max-w-full h-auto rounded mx-auto" 
            style={{ display: 'block' }}
          />
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining content after the last image
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ 
          __html: processMarkdown(content.substring(lastIndex)) 
        }} />
      );
    }
    
    // If no images were found, just render the processed HTML
    if (parts.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />;
    }
    
    return parts;
  };
  
  return (
    <div className="prose prose-lg max-w-none font-merriweather text-base sm:text-lg leading-[34px] text-foreground">
      {renderContent()}
    </div>
  );
};

// Function to format date 
const formatDate = (dateString) => { 
  if (!dateString) return '';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }); 
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export default function BookDetailClient({ book: initialBook, relatedBooks = [] }) {
  const [activeTab, setActiveTab] = useState('description');
  const [isMounted, setIsMounted] = useState(false);
  
  // Mount check to ensure we're running in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use RTK Query to fetch book details (will use initialBook if available)
  const { data: book = initialBook, isLoading } = useGetBookByIdQuery(initialBook?._id, {
    // Skip the query if we already have initial book data
    skip: !!initialBook
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Ensure book data is valid
  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Book Not Found</h1>
        <Link href="/spotlight" className="text-primary-600 hover:underline">
          Back to Books
        </Link>
      </div>
    );
  }

  // Format purchase links for display
  const purchaseLinks = [];
  if (book.purchaseLinks) {
    if (book.purchaseLinks.amazon) {
      purchaseLinks.push({ name: 'Amazon', url: book.purchaseLinks.amazon });
    }
    if (book.purchaseLinks.flipkart) {
      purchaseLinks.push({ name: 'Flipkart', url: book.purchaseLinks.flipkart });
    }
    if (book.purchaseLinks.other) {
      purchaseLinks.push({ name: 'Buy Online', url: book.purchaseLinks.other });
    }
  }

  // Ensure related books array is safe
  const safeRelatedBooks = Array.isArray(relatedBooks) ? relatedBooks : [];

  return (
    <div className="min-h-screen text-foreground">
      <BookSchema book={book} />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <div className="py-4 sm:py-6 md:py-8">
          <Link href="/spotlight" className="inline-flex items-center text-xs sm:text-sm hover:text-primary-500 transition-colors">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back to Books
          </Link>
        </div>
        
{/* Book Header */}
<div className="w-full max-w-[1064px] mx-auto mb-8 sm:mb-10">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
    {/* Book Cover */}
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={book.coverImage || '/images/fallback-cover.jpg'}
          alt={book.title || 'Book cover'}
          className="w-full h-auto object-contain"
          style={{ maxHeight: '600px', display: 'block' }}
          onError={(e) => {
            console.error(`Failed to load image: ${book.coverImage}`);
            e.target.src = '/images/fallback-cover.jpg';
          }}
        />
      </div>
    </div>

    {/* Book Details */}
    <div className="flex flex-col justify-between">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">{book.title || 'Untitled Book'}</h1>
        
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="flex items-center gap-1 text-secondary-600">
            <BookOpen className="w-4 h-4" />
            <span>{book.pageCount || '—'} pages</span>
          </span>
          
          {book.publishYear && (
            <span className="flex items-center gap-1 text-secondary-600">
              <Clock className="w-4 h-4" />
              <span>{book.publishYear}</span>
            </span>
          )}
          
          <span className="flex items-center gap-1 text-secondary-600">
            <Tag className="w-4 h-4" />
            <span>{book.publisher || 'Unknown Publisher'}</span>
          </span>
        </div>
        
        <div className="mb-6">
          <div className="text-2xl font-bold text-primary-600 mb-2">₹{book.price || '—'}</div>
        </div>
        
        {/* Purchase Links */}
        {purchaseLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Available at:</h3>
            <div className="flex flex-wrap gap-3">
              {purchaseLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 
                    bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{link.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Share buttons */}
      <ShareButtons />
    </div>
  </div>
</div>
        
        {/* Decorative Line */}
        <div className="w-full mx-auto md:mt-8 mb-8 sm:mb-12 md:mb-16">
          <DecorativeLine />
        </div>
        
        {/* Content Tabs */}
        <div className="w-full max-w-[1064px] mx-auto mb-16 md:mb-36 px-4 sm:px-6 relative">
          <div className="border-b border-gray-200 mb-8">
            <div className="flex overflow-x-auto">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'description'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              {book.poems && book.poems.length > 0 && (
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'poems'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                  onClick={() => setActiveTab('poems')}
                >
                  Sample Poems
                </button>
              )}
              {book.reviews && book.reviews.length > 0 && (
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              )}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="clean-container p-6 sm:p-8 rounded-lg">
            {activeTab === 'description' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">About the Book</h2>
                {book.description ? (
                  <div className="prose max-w-none">
                    <MarkdownRenderer content={book.description} />
                  </div>
                ) : (
                  <p className="text-secondary-600">No description available.</p>
                )}
              </div>
            )}
            
            {activeTab === 'poems' && book.poems && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Sample Poems</h2>
                {book.poems.length > 0 ? (
                  <div className="space-y-8">
                    {book.poems.map((poem, index) => (
                      <div key={index} className="border-b border-dashed border-gray-200 pb-8 last:border-b-0">
                        <h3 className="text-xl font-semibold text-primary-600 mb-4">{poem.title || 'Untitled Poem'}</h3>
                        <div className="prose max-w-none">
                          <MarkdownRenderer content={poem.content} />
                        </div>
                        {poem.translation && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-secondary-600 mb-2">Translation</h4>
                            <p className="text-secondary-700 italic">{poem.translation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-600">No sample poems available.</p>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && book.reviews && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                {book.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {book.reviews.map((review, index) => (
                      <div key={index} className="border-b border-dashed border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{review.name || 'Anonymous'}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-secondary-600">{review.comment || 'No comment'}</p>
                        {review.date && (
                          <p className="text-xs text-secondary-500 mt-2">
                            {formatDate(review.date)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-600">No reviews available.</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full border-b border-dashed border-[#949494] opacity-50 my-8 md:my-12" />
        
        {/* Related Books */}
        {safeRelatedBooks.length > 0 && (
          <section className="mb-8 md:mb-16 mt-16 md:mt-28">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {safeRelatedBooks.map((relatedBook) => (
                <Link 
                  href={`/spotlight/${relatedBook._id}`} 
                  key={relatedBook._id}
                  className="w-full group"
                >
                  <div className="flex flex-col gap-4 sm:gap-6 p-4 rounded-lg transition-all duration-300 ease-in-out 
                    hover:shadow-[var(--card-hover-shadow)] 
                    hover:translate-y-[var(--card-hover-transform)] 
                    hover:bg-[var(--card-hover-bg)]"
                  >
                    {/* Image Container */}
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                      <img
                        src={relatedBook.coverImage || '/images/fallback-cover.jpg'}
                        alt={relatedBook.title || 'Book cover'}
                        className="w-auto h-full max-w-full max-h-full object-contain mx-auto"
                        onError={(e) => {
                          console.error(`Failed to load image: ${relatedBook.coverImage}`);
                          e.target.src = '/images/fallback-cover.jpg';
                        }}
                      />
                    </div>

                    <h3 className="font-work-sans text-base sm:text-lg font-medium leading-tight sm:leading-[21px] transition-colors duration-300 group-hover:text-primary-500">
                      {relatedBook.title || 'Untitled Book'}
                    </h3>
                  
                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-work-sans text-sm text-secondary-600">
                        {relatedBook.publisher || 'Unknown Publisher'}
                      </span>
                      <span className="text-primary-600 font-medium text-sm">
                        ₹{relatedBook.price || '—'}
                      </span>
                    </div>

                    <div className="w-full border-b border-dashed border-[#949494] opacity-25" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}