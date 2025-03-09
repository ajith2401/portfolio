// src/app/devfolio/DevfolioClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Search } from 'lucide-react';
import { useGetProjectsQuery } from '@/services/api';

const DevfolioClient = ({ initialProjects = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['All Projects']);

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
      category: selectedCategory === 'All Projects' ? '' : selectedCategory, 
      search: searchQuery 
    },
    {
      // Skip the query if we're showing all projects and have no search query
      skip: selectedCategory === 'All Projects' && searchQuery === ''
    }
  );

  // Use the data from RTK Query or fall back to initial projects if needed
  const projects = (selectedCategory === 'All Projects' && searchQuery === '')
    ? initialProjects
    : data || [];

  // Filter projects client-side
  const filteredProjects = projects.filter(project => {
    // If search query is empty, just filter by category (which is already done by the API)
    if (!searchQuery) {
      return true;
    }
    
    // If we have a search query, filter locally too
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.shortDescription.toLowerCase().includes(query) ||
      (project.stack && project.stack.some(tech => tech.toLowerCase().includes(query))) ||
      project.category.toLowerCase().includes(query)
    );
  });

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
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredProjects.map((project) => (
              <article 
                key={project._id} 
                className="clean-container rounded-lg overflow-hidden group transition-all duration-300
                  hover:shadow-[var(--card-hover-shadow)] 
                  hover:translate-y-[var(--card-hover-transform)]
                  cursor-pointer"
              >
                <Link href={`/devfolio/${project._id}`} className="block">
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
        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-600">No projects found matching your criteria.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default DevfolioClient;