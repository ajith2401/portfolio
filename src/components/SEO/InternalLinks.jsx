// src/components/SEO/InternalLinks.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Star, ArrowRight, BookOpen, Code, PenTool } from 'lucide-react';
import { getSafeUrl } from '@/utils/slugGenerator';

export default function InternalLinks({ 
  currentId, 
  category, 
  tags = [], 
  type = 'blog',
  title = 'Related Content',
  limit = 5,
  showImages = true,
  layout = 'grid' // 'grid', 'list', 'carousel'
}) {
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRelatedContent() {
      if (!currentId) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `/api/${type}/${currentId}/related?limit=${limit}`,
          {
            headers: {
              'Cache-Control': 'max-age=300' // Cache for 5 minutes
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRelatedContent(data.relatedPosts || []);
      } catch (error) {
        console.error('Error fetching related content:', error);
        setError(error.message);
        
        // Fallback: try to get some content from the same category
        try {
          const fallbackResponse = await fetch(
            `/api/${type}?category=${encodeURIComponent(category)}&limit=${limit}&exclude=${currentId}`
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setRelatedContent(fallbackData.posts?.slice(0, limit) || []);
          }
        } catch (fallbackError) {
          console.error('Fallback request failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchRelatedContent();
  }, [currentId, category, type, limit]);

  // Get icon based on content type
  const getTypeIcon = (contentType) => {
    switch (contentType) {
      case 'blog':
        return <Code className="w-4 h-4" />;
      case 'quill':
        return <PenTool className="w-4 h-4" />;
      case 'devfolio':
        return <Code className="w-4 h-4" />;
      case 'spotlight':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex gap-4">
            {showImages && (
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0"></div>
            )}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error fallback component
  const ErrorFallback = () => (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">
        Unable to load related content at the moment.
      </p>
      <Link 
        href={`/${type}`}
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        Browse all {type === 'blog' ? 'articles' : type === 'quill' ? 'writings' : 'content'} →
      </Link>
    </div>
  );

  if (loading) {
    return (
      <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          {getTypeIcon(type)}
          {title}
        </h3>
        <LoadingSkeleton />
      </section>
    );
  }

  if (error && relatedContent.length === 0) {
    return (
      <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          {getTypeIcon(type)}
          {title}
        </h3>
        <ErrorFallback />
      </section>
    );
  }

  if (relatedContent.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        {getTypeIcon(type)}
        {title}
      </h3>
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedContent.map((item) => (
            <Link 
              key={item._id} 
              href={getSafeUrl(item, type)}
              className="group block p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              <article>
                {showImages && item.images?.thumbnail && (
                  <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={item.images.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h4>
                
                {item.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                    {item.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    {item.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTime}m read
                      </span>
                    )}
                    
                    {item.views > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </span>
                    )}
                    
                    {item.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {item.rating}
                      </span>
                    )}
                  </div>
                  
                  {item.category && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                      {item.category}
                    </span>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {relatedContent.map((item) => (
            <Link 
              key={item._id} 
              href={getSafeUrl(item, type)}
              className="group flex gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              {showImages && item.images?.thumbnail && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.images.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {item.title}
                </h4>
                
                {item.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-1 mb-2">
                    {item.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {item.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}m
                    </span>
                  )}
                  
                  {item.category && (
                    <span className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
              
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 self-center" />
            </Link>
          ))}
        </div>
      )}
      
      {/* View more link */}
      <div className="mt-6 text-center">
        <Link 
          href={`/${type}${category ? `?category=${encodeURIComponent(category)}` : ''}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          View more {type === 'blog' ? 'articles' : type === 'quill' ? 'writings' : 'content'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Schema markup for related content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `Related ${title}`,
            "description": `Content related to the current ${type}`,
            "numberOfItems": relatedContent.length,
            "itemListElement": relatedContent.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://www.ajithkumarr.com${getSafeUrl(item, type)}`,
              "name": item.title,
              "description": item.excerpt
            }))
          })
        }}
      />
    </section>
  );
}