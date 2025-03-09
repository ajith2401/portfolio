// src/app/blog/TechBlogClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useGetTechBlogsQuery } from '@/services/api';
import { useSearchParams } from 'next/navigation';

const TechBlogCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post._id}`} className="group">
      <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-background">
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={post.images?.medium || '/placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <span className="text-sm text-primary font-work-sans">
            {post.category}
          </span>
          <h3 className="font-dm-sans text-xl mt-2 mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 font-merriweather">
            {post.subtitle || post.content?.substring(0, 150)}
          </p>
          <div className="mt-4 text-sm text-gray-500 font-work-sans">
            {formatDate(post.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function TechBlogClient({ initialPosts }) {
  const searchParams = useSearchParams();
  
  // Get pagination and filter state from URL or use defaults
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [totalPages, setTotalPages] = useState(1);
  
  // Use RTK Query hook for fetching tech blogs
  const { data, isLoading } = useGetTechBlogsQuery(
    { 
      page: currentPage,
      category: activeFilter === 'all' ? '' : activeFilter, 
      search: searchQuery 
    },
    {
      // Skip the query only if we're on page 1, showing all posts, have no search query,
      // and have initialPosts
      skip: currentPage === 1 && activeFilter === 'all' && 
            searchQuery === '' && initialPosts?.length > 0
    }
  );

  // Update URL when filter or pagination changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    if (activeFilter !== 'all') {
      params.set('category', activeFilter);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/blog';
    
    // Use replaceState to avoid adding browser history entries for pagination changes
    window.history.replaceState({}, '', newUrl);
  }, [currentPage, activeFilter, searchQuery]);

  // Extract posts and pagination data
  useEffect(() => {
    if (data) {
      setTotalPages(data.pagination?.pages || 1);
    }
  }, [data]);

  // Use the data from RTK Query or fall back to initial posts
  const posts = (currentPage === 1 && activeFilter === 'all' && searchQuery === '' && !data)
    ? initialPosts
    : data?.techBlogs || [];

  const categories = [
    'all',
    'web-development',
    'javascript',
    'react',
    'backend',
    'devops',
    'cloud'
  ];

  // Generate pagination array for rendering
  const generatePaginationArray = () => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots and numbers
    let prev = 0;
    for (const i of range) {
      if (prev > 0) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setActiveFilter(category);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-custom-56 font-dm-sans font-semibold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
            A <span className="text-primary-500">Technical</span> Journey Through{' '}
            <span className="text-primary-500">Code</span>
          </h1>
          <p className="w-full max-w-[874px] mx-auto px-4 sm:px-6 lg:px-8 
            text-center font-work-sans 
            text-base sm:text-lg lg:text-[22px] 
            leading-[20px] sm:leading-[24px] lg:leading-[26px] 
            font-normal text-secondary-600">
            Deep dives into software development, architecture patterns, and engineering best practices.
            Join me in exploring the ever-evolving world of technology.
          </p>
        </div>
 
        {/* Filters and Search */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
            <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all font-work-sans
                    ${activeFilter === category 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>

        {/* Grid of Posts */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-foreground">
            {posts.map(post => (
              <TechBlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 md:mt-12">
            <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-lg bg-background">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Previous page"
              >
                <span className="text-sm sm:text-base">←</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 sm:gap-2">
                {generatePaginationArray().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={typeof page !== 'number'}
                    className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 flex items-center justify-center rounded-md text-sm sm:text-base transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : typeof page === 'number'
                        ? 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-gray-500 cursor-default'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Next page"
              >
                <span className="text-sm sm:text-base">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}