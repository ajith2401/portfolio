'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, CalendarIcon, SortAsc, SortDesc } from 'lucide-react';
import { useGetWritingsQuery } from '@/services/api';
import PersonSchema from '@/components/schema/PersonSchema';

// Safe localStorage access functions
const getLocalStorage = (key, fallback) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || fallback;
  }
  return fallback;
};

const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Date picker component
const DatePicker = ({ label, value, onChange, onClear }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-gray-300 rounded-md text-foreground text-sm"
        />
        {value && (
          <button 
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear date"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Client Component
const QuillClientPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  
  // Initial state placeholders
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Writings');
  const [sortBy, setSortBy] = useState('date');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize state from URL/localStorage only after component mounts
  useEffect(() => {
    // Get initial values from URL or localStorage
    const pageFromUrl = searchParams.get('page');
    const pageFromStorage = getLocalStorage('quillPage', '1');
    const initialPage = pageFromUrl ? parseInt(pageFromUrl) : parseInt(pageFromStorage);
    
    const initialCategory = searchParams.get('category') || getLocalStorage('quillCategory', 'All Writings');
    const initialSearch = searchParams.get('search') || getLocalStorage('quillSearch', '');
    const initialSortBy = searchParams.get('sortBy') || getLocalStorage('quillSortBy', 'date');
    const initialStartDate = searchParams.get('startDate') || getLocalStorage('quillStartDate', '');
    const initialEndDate = searchParams.get('endDate') || getLocalStorage('quillEndDate', '');

    setCurrentPage(isNaN(initialPage) ? 1 : initialPage);
    setSelectedCategory(initialCategory);
    setSearchQuery(initialSearch);
    setSortBy(initialSortBy);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setIsMounted(true);
    
    // Show filters if any are active
    if (initialStartDate || initialEndDate || initialSortBy !== 'date') {
      setShowFilters(true);
    }
    
    // Mark as initialized after setting initial values
    setIsInitialized(true);
  }, [searchParams]);

  // Use RTK Query hook
  const { data, error, isLoading } = useGetWritingsQuery({
    page: currentPage,
    category: selectedCategory !== 'All Writings' ? selectedCategory : '',
    search: searchQuery,
    sortBy,
    startDate,
    endDate
  }, { skip: !isMounted }); // Skip the query until mounted

  const writings = data?.writings || [];
  const totalPages = data?.pagination?.pages || 0;

  // Store current state in localStorage and URL when it changes
  useEffect(() => {
    if (!isInitialized || !isMounted) {
      return;
    }

    // Update localStorage
    setLocalStorage('quillPage', currentPage.toString());
    setLocalStorage('quillCategory', selectedCategory);
    setLocalStorage('quillSearch', searchQuery);
    setLocalStorage('quillSortBy', sortBy);
    setLocalStorage('quillStartDate', startDate);
    setLocalStorage('quillEndDate', endDate);

    // Update URL params without navigation
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      
      if (selectedCategory !== 'All Writings') {
        params.set('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.set('search', searchQuery);
      }
      
      if (sortBy !== 'date') {
        params.set('sortBy', sortBy);
      }
      
      if (startDate) {
        params.set('startDate', startDate);
      }
      
      if (endDate) {
        params.set('endDate', endDate);
      }

      // Replace state without reloading
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [currentPage, selectedCategory, searchQuery, sortBy, startDate, endDate, isInitialized, isMounted]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sort changes
  };
  
  // Handle date changes
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setCurrentPage(1);
  };
  
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setCurrentPage(1);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSortBy('date');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
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

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Writings...</h2>
          <p className="text-gray-500">Please wait while we fetch the content.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Add PersonSchema for writer identity */}
      <PersonSchema includeFullBio={true} />
      
      {/* SEO content for search engines */}
      <div className="sr-only">
        <h1>Ajithkumar - Published Tamil Writer & Poet</h1>
        <p>This page is my sanctuary for creativity, where emotions take shape and individuality finds its voice. Dive in, and explore the unfiltered me.</p>
        <p>Explore the literary works of Ajithkumar, a published Tamil writer with 5 poetry books exploring themes of feminism, social justice, and human emotions. Browse my collection of Tamil poetry, essays, and creative writings.</p>
        <p>As a published Tamil author, my works have been recognized for their authentic voice and thematic depth in addressing contemporary social issues through nuanced Tamil poetry.</p>
        <div>
          <h2>Published Tamil Poetry Books</h2>
          <ul>
          <li>1. அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும் Anbudaiyavalukkum Anbukkuriyavalukkum</li>
          <li> 2. சிப்பிக்குள் சிந்தா மழை || Sippikkul Sinthaa Mazhai</li>
          <li> 3. ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள் ||  Oru Paithiyakkaaranin Diary Kurippugal </li>
          <li> 4. முற்றிய பிரியத்தின் வற்றாத துளி || Mutriya Priyaththin Vatraadha Thuli</li>
          <li>5. ஆண்டெனா மீதமர்ந்த காக்கை || Antenna Meedhamarntha Kaakkai</li>
          </ul>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="w-full py-8 sm:py-12 lg:py-16 px-4 mb-4 sm:mb-6 lg:mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-custom-56 font-dm-sans font-semibold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
            A <span className="text-primary-500">Canvas</span> for My{' '}
            <span className="text-primary-500">Boundless</span> Expressions
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
        
        {/* Main Filter Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-auto flex flex-wrap gap-2 items-center">
            <select 
              className="w-full md:w-auto px-4 py-2 bg-background border border-gray-300 rounded-md text-foreground"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-background border border-gray-300 rounded-md text-foreground flex items-center gap-2"
            >
              <CalendarIcon size={16} />
              <span>Filters</span>
              {(startDate || endDate || sortBy !== 'date') && 
                <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full">!</span>
              }
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-background rounded-md text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
        
        {/* Advanced Filters Row */}
        {showFilters && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <DatePicker 
                  label="From Date" 
                  value={startDate} 
                  onChange={handleStartDateChange}
                  onClear={() => handleStartDateChange('')}
                />
                
                <DatePicker 
                  label="To Date" 
                  value={endDate} 
                  onChange={handleEndDateChange}
                  onClear={() => handleEndDateChange('')}
                />
                
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Sort By</label>
                  <div className="flex">
                    <button 
                      onClick={() => handleSortChange('date')}
                      className={`px-3 py-2 border ${sortBy === 'date' ? 'bg-red-600 text-white border-red-600' : 'bg-background border-gray-300 text-foreground'} rounded-l-md text-sm flex items-center gap-1`}
                    >
                      <SortDesc size={14} />
                      <span>Latest</span>
                    </button>
                    <button 
                      onClick={() => handleSortChange('rating')}
                      className={`px-3 py-2 border ${sortBy === 'rating' ? 'bg-red-600 text-white border-red-600' : 'bg-background border-gray-300 text-foreground'} rounded-r-md text-sm flex items-center gap-1`}
                    >
                      <SortAsc size={14} />
                      <span>Highest Rated</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-red-600 px-4 py-2 border border-gray-300 rounded-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error loading writings. Please try again later.
          </div>
        ) : writings.length === 0 ? (
          <div className="text-center py-12 text-foreground">
            No writings found matching your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 text-foreground">
            {writings.map((writing) => (
              <Link 
                href={`/quill/${writing._id}?returnPage=${currentPage}`} 
                key={writing._id}
                className="w-full md:w-[410.67px] group"
              >
                <div className="flex flex-col gap-6 p-4 rounded-lg transition-all duration-300 ease-in-out bg-background
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
                  
                  {/* Rating if available */}
                  {writing.averageRating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(writing.averageRating) ? (
                            '★'
                          ) : i < Math.ceil(writing.averageRating) && 
                             i >= Math.floor(writing.averageRating) ? (
                            '⯪'
                          ) : (
                            '☆'
                          )}
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({writing.totalRatings || 0})
                      </span>
                    </div>
                  )}

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

export default QuillClientPage;