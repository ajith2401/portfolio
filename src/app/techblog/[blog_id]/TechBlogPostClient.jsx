// src/app/techblog/[blog_id]/TechBlogPostClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import BlogSchema from '@/components/schema/BlogSchema';
import RatingForm from '@/components/ui/form/RatingForm';

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
  
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };
  
  const readTime = blog.readTime || calculateReadTime(blog.content);
  
  return (
    <div className="min-h-screen bg-background">
      <BlogSchema blog={blog} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/techblog" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tech Blog
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {blog.category.charAt(0).toUpperCase() + blog.category.slice(1).replace('-', ' ')}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
            {blog.title}
          </h1>
          
          {blog.subtitle && (
            <h2 className="text-xl text-gray-600 mb-6 font-normal leading-relaxed">
              {blog.subtitle}
            </h2>
          )}
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-6 mb-8">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{blog.author?.name || 'Ajithkumar'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{readTime} min read</span>
            </div>
          </div>
          
          {/* Featured Image */}
          {blog.images?.large && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
              <Image
                src={blog.images.large}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                priority
              />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="max-w-3xl mx-auto prose prose-lg prose-a:text-primary prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground mb-16">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Divider */}
        <div className="w-full border-b border-dashed border-gray-300 my-12 max-w-3xl mx-auto" />
        {comments && comments.length > 0 && (
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6">Reader Comments</h2>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{comment.name}</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          {i < comment.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating Form - Using the unified component */}
        <RatingForm contentType="TechBlog" contentId={blogId} />
        
        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto mb-16 mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <Link 
                  href={`/techblog/${post._id}`} 
                  key={post._id}
                  className="group"
                >
                  <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={post.images?.medium || '/placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 320px"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium">
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
                      </span>
                      <h3 className="font-medium text-lg mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.subtitle || post.content.substring(0, 100).replace(/<[^>]*>/g, '')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}