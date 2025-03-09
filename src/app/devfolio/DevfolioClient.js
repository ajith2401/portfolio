// src/app/devfolio/DevfolioClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Search } from 'lucide-react';
import { useGetProjectsQuery } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';

const DevfolioClient = ({ initialProjects = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get pagination and filter state from URL or use defaults
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialCategory = searchParams.get('category') || 'All Projects';
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [categories, setCategories] = useState(['All Projects']);
  const [totalPages, setTotalPages] = useState(1);

  // Extract unique categories from projects on mount
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      const uniqueCategories = ['All Projects', ...new Set(initialProjects.map(project => project.category))];
      setCategories(uniqueCategories);
    }
  }, [initialProjects]);

  // Use RTK Query hook with appropriate parameters
  const { data, isLoading } = useGetProjectsQuery(
    { 
      page: currentPage,
      category: selectedCategory === 'All Projects' ? '' : selectedCategory, 
      search: searchQuery 
    },
    {
      // Skip the query only if we're on page 1, showing all projects, have no search query,
      // and have initialProjects
      skip: currentPage === 1 && selectedCategory === 'All Projects' && 
            searchQuery === '' && initialProjects.length > 0
    }
  );

  // Update URL when filter or pagination changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    if (selectedCategory !== 'All Projects') {
      params.set('category', selectedCategory);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/devfolio';
    
    // Use replaceState to avoid adding browser history entries for pagination changes
    window.history.replaceState({}, '', newUrl);
  }, [currentPage, selectedCategory, searchQuery]);

  // Extract projects and pagination data
  useEffect(() => {
    if (data) {
      setTotalPages(data.pagination?.pages || 1);
    }
  }, [data]);

  // Use the data from RTK Query or fall back to initial projects if needed
  const projects = (currentPage === 1 && selectedCategory === 'All Projects' && searchQuery === '' && !data)
    ? initialProjects
    : data?.projects || [];

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
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="w-full py-8 sm:py-12 lg:py-16 px-4 mb-4 sm:mb-6 lg:mb-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-custom-56 font-dm-sans font-semibold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
            My <span className="text-primary-500">Creative</span> Universe of{' '}
            <span className="text-primary-500">Projects</span>
          </h1>
          <p className="w-full max-w-[874px] mx-auto px-4 sm:px-6 lg:px-8 
             text-center font-work-sans 
             text-base sm:text-lg lg:text-[22px] 
             leading-[20px] sm:leading-[24px] lg:leading-[26px] 
             font-normal text-secondary-600">
            A showcase of my journey through code, featuring award-winning projects 
            and innovative solutions that make a real impact.
          </p>
        </div>
      </div>

      <div className="w-full border-b border-dashed border-decorative-line opacity-20" />

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-auto">
            <select 
              className="glass-input px-4 py-2 rounded-md w-full md:w-48"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              className="glass-input w-full pl-10 pr-4 py-2 rounded-md"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <article 
                key={project._id} 
                className="clean-container rounded-lg overflow-hidden group transition-all duration-300
                  hover:shadow-[var(--card-hover-shadow)] 
                  hover:translate-y-[var(--card-hover-transform)]
                  cursor-pointer"
              >
                <Link 
                  href={`/devfolio/${project._id}`}
                  className="block"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={project.images?.medium || '/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                      quality={75}
                    />
                    {project.createdAt && (
                      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-work-sans text-foreground">
                          {new Date(project.createdAt).getFullYear()}
                        </span>
                      </div>
                    )}
                  </div>
              
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full">
                          {project.category}
                        </span>
                        {project.achievement && (
                          <span className="text-sm text-secondary-500">{project.achievement}</span>
                        )}
                      </div>
                      <h3 className="font-work-sans text-lg font-medium text-foreground group-hover:text-primary-500 transition-colors">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-secondary-600 text-sm mt-1">{project.subtitle}</p>
                      )}
                    </div>
              
                    <p className="text-secondary-600 text-sm line-clamp-3">
                      {project.shortDescription}
                    </p>
              
                    <div className="flex flex-wrap gap-2">
                      {project.stack && project.stack.map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
              
                    {project.stats && Object.keys(project.stats).length > 0 && (
                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-dashed border-decorative-line opacity-20">
                        {Object.entries(project.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-primary-500 font-semibold">{value}</div>
                            <div className="text-xs text-secondary-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="flex justify-between items-center px-6 pb-6">
                  <div className="flex gap-4">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={16} />
                        <span className="text-sm">Code</span>
                      </a>
                    )}
                    {(project.links?.live || project.links?.demo) && (
                      <a
                        href={project.links.live || project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={16} />
                        <span className="text-sm">Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No results message */}
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-600">No projects found matching your criteria.</p>
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
                        ? 'bg-primary-500 text-white'
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
      </section>
    </main>
  );
};

export default DevfolioClient;