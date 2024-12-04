'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

const categoryImages = {
  philosophy: '/images/philosophy.jpg',
  poem: '/images/poem.jpg',
  article: '/images/article.jpg',
  'short story': '/images/story.jpg',
  'short writings': '/images/writings.jpg',
  politics: '/images/politics.jpg',
  cinema: '/images/cinema.jpg',
  letter: '/images/letter.jpg',
  joke: '/images/joke.jpg',
  default: '/images/default.jpg'
};

const QuillPage = () => {
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Writings');

  useEffect(() => {
    fetchWritings();
  }, [currentPage, selectedCategory]);

  const fetchWritings = async () => {
    try {
      const categoryParam = selectedCategory !== 'All Writings' ? `&category=${selectedCategory.toLowerCase()}` : '';
      const response = await fetch(`/api/writings?page=${currentPage}${categoryParam}`);
      const data = await response.json();
      setWritings(data.writings);
      setTotalPages(data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching writings:', error);
      setLoading(false);
    }
  };

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

  const truncateBody = (text) => {
    if (!text) return '';
    
    // Remove special characters and multiple spaces
    const cleanText = text
      .replace(/[!,.?":;]/g, '') // Remove special characters
      .replace(/\n/g, ' ') // Remove newlines
      .replace(/\s+/g, ' ') // Remove multiple spaces
      .trim(); // Remove leading/trailing spaces
  
    // Get first 5 words
    const words = cleanText.split(' ').slice(0, 3);
    
    // Only add ... if there are more words
    const hasMoreWords = cleanText.split(' ').length > 5;
    return `${words.join(' ')}${hasMoreWords ? ' ...' : ''}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return ( 
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="w-full py-8 sm:py-12 lg:py-16 px-4 mb-4 sm:mb-6 lg:mb-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-custom-56 font-dm-sans font-semibold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
          A <span className="text-red-600">Canvas</span> for My{' '}
          <span className="text-red-600">Boundless</span> Expressions
        </h1>
        <p className="w-full max-w-[874px] mx-auto px-4 sm:px-6 lg:px-8 
           text-center font-work-sans 
           text-base sm:text-lg lg:text-[22px] 
           leading-[20px] sm:leading-[24px] lg:leading-[26px] 
           font-normal text-secondary-600">
          This page is my sanctuary for creativity, where emotions take shape and individuality finds its voice. Dive in, and explore the unfiltered me.
        </p>
      </div>
    </div>

      <div className="w-full border-b border-dashed border-[#949494] opacity-50" />

      {/* Writings Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold-500 text-center font-poppins text-foreground mb-8">
          Uncover My Writings
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-auto">
            <select 
              className="w-full md:w-auto px-4 py-2 bg-background border border-gray-300 rounded-md text-foreground"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Writings</option>
              <option>Philosophy</option>
              <option>Poem</option>
              <option>Article</option>
              <option>Short Story</option>
              <option>Politics</option>
              <option>Cinema</option>
              <option>Letter</option>
              <option>Joke</option>
            </select>
          </div>

          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-background rounded-md text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 text-foreground">
            {writings.map((writing) => (
              <Link 
                href={`/quill/${writing._id}`} 
                key={writing._id}
                className="w-full md:w-[410.67px] group"
              >
                <div className="flex flex-col gap-6 p-4 rounded-lg transition-all duration-300 ease-in-out 
                  hover:shadow-[var(--card-hover-shadow)] 
                  hover:translate-y-[var(--card-hover-transform)] 
                  hover:bg-[var(--card-hover-bg)]"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-[231.38px] rounded-lg overflow-hidden">
                    <Image
                      src={writing.images?.small || '/placeholder.jpg'}
                      alt={writing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 410px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                      quality={75}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-work-sans text-lg font-medium leading-[21px] transition-colors duration-300 group-hover:text-primary">
                    {writing.title}
                  </h3>
                
                  <p className="font-merriweather text-sm text-foreground leading-[21px] mb-4">
                    {truncateBody(writing.body)}
                  </p>

                  {/* Category and Date Container */}
                  <div className="flex justify-between items-center">
                    {/* Category Tag */}
                    <div className="flex items-center justify-center px-2 py-1.5 bg-[rgba(140,140,140,0.1)] rounded transition-colors duration-300 group-hover:bg-[rgba(140,140,140,0.2)]">
                      <span className="font-work-sans text-xs font-medium leading-[14px] text-gray-400">
                        {writing.category}
                      </span>
                    </div>

                    {/* Date */}
                    <span className="font-work-sans text-xs font-medium leading-[14px] text-gray-400">
                      {formatDate(writing.createdAt)}
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div className="w-full border-b border-dashed border-[#949494] opacity-25" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
         <div className="flex justify-center items-center mt-8 md:mt-12">
            <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-lg bg-background">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={typeof page !== 'number'}
                    className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 flex items-center justify-center rounded-md text-sm sm:text-base transition-colors ${
                      currentPage === page
                        ? 'bg-red-600 text-white'
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Next page"
              >
                <span className="text-sm sm:text-base">→</span>
              </button>
            </div>
       </div>
      </section>
    </main>
  );
};

export default QuillPage;