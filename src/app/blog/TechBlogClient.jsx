'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useGetTechBlogsQuery } from '@/services/api';

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
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use RTK Query hook without initialData
  const { data, isLoading } = useGetTechBlogsQuery(
    { 
      category: activeFilter === 'all' ? '' : activeFilter, 
      search: searchQuery 
    },
    {
      // Skip the query if we're showing all posts and have no search query
      skip: activeFilter === 'all' && searchQuery === ''
    }
  );
  
  // Use the data from RTK Query or fall back to initial posts
  const posts = (activeFilter === 'all' && searchQuery === '')
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-medium mb-6">
            A {' '}
            <span className="text-primary">Technical</span>
            {' '}Journey Through
            {' '}
            <span className="text-primary">Code</span>
          </h1>
          <p className="text-gray-600 text-lg">
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
                  onClick={() => setActiveFilter(category)}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
      </div>
    </div>
  );
}
