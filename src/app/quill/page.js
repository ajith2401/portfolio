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
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
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
      <div className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            A <span className="text-red-600">Canvas</span> for My{' '}
            <span className="text-red-600">Boundless</span> Expressions
          </h1>
          <p className="text-foreground text-lg">
            This page is my sanctuary for creativity, where emotions take shape and
            individuality finds its voice. Dive in, and explore the unfiltered me.
          </p>
        </div>
      </div>

      {/* Writings Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
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
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-background border border-gray-300 rounded-md text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writings.map((writing) => (
              <Link 
                  href={`/quill/${writing._id}`} 
                  key={writing._id}
                  className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
              <div
                key={writing._id}
                className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={writing.images.medium || categoryImages.default}
                    alt={writing.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                    quality={75}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {writing.title}
                  </h3>
                  <p className="text-foreground text-sm mb-4 line-clamp-3">
                    {writing.body}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground/60 capitalize px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                      {writing.category}
                    </span>
                    <span className="text-foreground">
                      {formatDate(writing.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-12 gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 text-foreground"
          >
            ←
          </button>
          
          {generatePaginationArray().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? 'bg-red-600 text-white'
                  : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 text-foreground"
          >
            →
          </button>
        </div>
      </section>
    </main>
  );
};

export default QuillPage;