// src/app/techblog/[blog_id]/TechBlogPostClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SharedContentHeader from '@/components/layout/QuillPageHeader';
import DecorativeLine from '@/components/ui/DecorativeLine';
import BlogSchema from '@/components/schema/BlogSchema';
import RatingForm from '@/components/ui/form/RatingForm';
import WordCard from '@/components/ui/card/WordCard'; 

const truncateBody = (text) => {
  if (!text) return '';
  
  // Remove special characters and multiple spaces
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[!,.?":;]/g, '') // Remove special characters
    .replace(/\n/g, ' ') // Remove newlines
    .replace(/\s+/g, ' ') // Remove multiple spaces
    .trim(); // Remove leading/trailing spaces

  // Get first few words
  const words = cleanText.split(' ').slice(0, 3);
  
  // Only add ... if there are more words
  const hasMoreWords = cleanText.split(' ').length > 5;
  return `${words.join(' ')}${hasMoreWords ? ' ...' : ''}`;
};

export default function TechBlogPostClient({ blog, blogId }) {
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  useEffect(() => {
    // Fetch comments using the unified API
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments/TechBlog/${blogId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    
    // Fetch related tech blogs
    async function fetchRelatedPosts() {
      try {
        const res = await fetch(`/api/tech-blog/${blogId}/related`);
        if (res.ok) {
          const data = await res.json();
          setRelatedPosts(data);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    }
    
    fetchComments();
    fetchRelatedPosts();
  }, [blogId]);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen text-foreground">
      <BlogSchema blog={blog} />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <div className="py-4 sm:py-6 md:py-8">
          <Link href="/techblog" className="inline-flex items-center text-xs sm:text-sm hover:text-primary">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back
          </Link>
        </div>
        
        {/* Header Section */}
        <SharedContentHeader content={blog} contentType="TechBlog" />
        
        {/* Decorative Line */}
        <div className="w-full mx-auto mt-4 md:mt-8 mb-8 sm:mb-12 md:mb-16">
          <DecorativeLine />
        </div>
        
        {/* Content Section */}
        <div className="w-full max-w-[1064px] mx-auto mb-16 md:mb-36 px-4 sm:px-6 relative">
          <div className="prose prose-lg max-w-none">
            <div 
              className="font-merriweather text-base sm:text-lg leading-[34px] text-foreground"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>
        </div>
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="max-w-[1064px] mx-auto mb-8">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-[rgba(140,140,140,0.1)] rounded-full text-sm text-gray-400 font-work-sans">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="w-full border-b border-dashed border-[#949494] opacity-50 my-8 md:my-12" />
        
        {/* Comments Section */}
        <section className="mb-8 md:mb-14 mt-16 md:mt-36">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">Reader Comments</h2>
            <div className="flex gap-2">
              <button className="p-1.5 sm:p-2 rounded-full border border-gray-700">&larr;</button>
              <button className="p-1.5 sm:p-2 rounded-full border border-gray-700">&rarr;</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {comments && comments.length > 0 ? comments.slice(0, 3).map((comment) => (
              <WordCard
                key={comment._id}
                author={comment.name}
                content={comment.comment}
                rating={comment.rating || 5}
                date={formatDate(comment.createdAt)}
              />
            )) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </section>

        {/* Rating Form */}
        <RatingForm contentType="TechBlog" contentId={blogId} />
        
        <div className="w-full border-b border-dashed border-[#949494] opacity-50 my-8 md:my-12" />
        
        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mb-8 md:mb-16 mt-16 md:mt-28">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map((post) => (
                <Link 
                  href={`/techblog/${post._id}`} 
                  key={post._id}
                  className="w-full group"
                >
                  <div className="flex flex-col gap-4 sm:gap-6 p-4 rounded-lg transition-all duration-300 ease-in-out 
                    hover:shadow-[var(--card-hover-shadow)] 
                    hover:translate-y-[var(--card-hover-transform)] 
                    hover:bg-[var(--card-hover-bg)]"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-[16/9] sm:h-[231.38px] rounded-lg overflow-hidden">
                      <Image
                        src={post.images?.medium || '/placeholder.jpg'}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                        quality={75}
                      />
                    </div>

                    <h3 className="font-work-sans text-base sm:text-lg font-medium leading-tight sm:leading-[21px] transition-colors duration-300 group-hover:text-primary">
                      {post.title}
                    </h3>
                  
                    <p className="font-merriweather text-sm text-foreground leading-relaxed sm:leading-[21px]">
                      {truncateBody(post.content)}
                    </p>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center justify-center px-2 py-1.5 bg-[rgba(140,140,140,0.1)] rounded transition-colors duration-300 group-hover:bg-[rgba(140,140,140,0.2)]">
                        <span className="font-work-sans text-xs font-medium leading-[14px] text-gray-400">
                          {post.category.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>

                      <span className="font-work-sans text-xs font-medium leading-[14px] text-gray-400">
                        {formatDate(post.publishedAt || post.createdAt)}
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