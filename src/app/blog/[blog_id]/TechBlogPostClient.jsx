// src/app/blog/[blog_id]/blogPostClient.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SharedContentHeader from '@/components/layout/QuillPageHeader';
import DecorativeLine from '@/components/ui/DecorativeLine';
import BlogSchema from '@/components/schema/BlogSchema';
import RatingForm from '@/components/ui/form/RatingForm';
import WordCard from '@/components/ui/card/WordCard'; 
import { 
  useGetRelatedTechBlogsQuery,
  useGetCommentsQuery
} from '@/services/api';

const MarkdownRenderer = ({ content }) => {
  // Only process if we have content
  if (!content) return null;

  // Fix broken image markdown syntax (handles line breaks)
  const fixBrokenImageMarkdown = (text) => {
    // Fix common issue: line breaks between [] and ()
    let fixed = text.replace(/!\[(.*?)\][ \t\r\n]*\([ \t\r\n]*(https?:\/\/[^)]+)[ \t\r\n]*\)/g, '![$1]($2)');
    
    // Fix extra closing parenthesis on separate line
    fixed = fixed.replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\n\)/g, '![$1]($2)');
    
    // Convert bare image URLs to proper markdown
    fixed = fixed.replace(/^(https?:\/\/\S+\.(jpg|jpeg|png|gif|webp))$/gim, '![Image]($1)');
    
    return fixed;
  };
  
  // Process markdown content
  const processMarkdown = (mdContent) => {
    // First fix any broken image markdown
    let processedContent = fixBrokenImageMarkdown(mdContent);
    
    let html = processedContent;
    
    // Process code blocks first to avoid conflicts with other formatting
    html = html.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
      return `<pre class="bg-gray-500 p-3 my-3 rounded overflow-x-auto"><code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>');
    
    // Process headings (match at line beginning)
    html = html.replace(/^# (.*)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>');
    html = html.replace(/^## (.*)$/gm, '<h2 class="text-2xl font-bold mt-5 mb-2">$1</h2>');
    html = html.replace(/^### (.*)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
    
    // Process blockquotes - handle multi-line blockquotes
    html = html.replace(/^> (.*)(?:\n^> (.*))*$/gm, (match) => {
      const content = match.split('\n')
        .map(line => line.replace(/^> (.*)$/, '$1'))
        .join('<br>');
      return `<blockquote class="border-l-4 border-gray-300 pl-4 py-1 my-4 italic text-gray-700">${content}</blockquote>`;
    });
    
    // Process ordered lists - match consecutive numbered lines
    html = html.replace(/^(\d+)\. (.*)(?:\n^(\d+)\. (.*))*$/gm, (match) => {
      const items = match.split('\n')
        .map(line => {
          const itemMatch = line.match(/^(\d+)\. (.*)$/);
          return itemMatch ? `<li>${itemMatch[2]}</li>` : line;
        })
        .join('');
      return `<ol class="list-decimal pl-6 my-4">${items}</ol>`;
    });
    
    // Process unordered lists - match consecutive bulleted lines
    html = html.replace(/^- (.*)(?:\n^- (.*))*$/gm, (match) => {
      const items = match.split('\n')
        .map(line => {
          const itemMatch = line.match(/^- (.*)$/);
          return itemMatch ? `<li>${itemMatch[1]}</li>` : line;
        })
        .join('');
      return `<ul class="list-disc pl-6 my-4">${items}</ul>`;
    });
    
    // Process text formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Process links with styling
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>');
    
    // Process horizontal rule
    html = html.replace(/^---$/gm, '<hr class="my-6 border-t border-gray-300" />');
    
    // Process paragraphs and line breaks
    // Split into paragraphs on double newlines
    const paragraphs = html.split(/\n\n+/);
    
    html = paragraphs.map(para => {
      // Skip wrapping if paragraph already contains block-level HTML
      if (
        para.startsWith('<h1') || 
        para.startsWith('<h2') || 
        para.startsWith('<h3') || 
        para.startsWith('<ul') || 
        para.startsWith('<ol') || 
        para.startsWith('<blockquote') || 
        para.startsWith('<pre') ||
        para.startsWith('<hr')
      ) {
        return para;
      }
      
      // Regular paragraph handling
      const withLineBreaks = para.replace(/\n/g, '<br>');
      return `<p class="my-3">${withLineBreaks}</p>`;
    }).join('\n\n');
    
    return html;
  };
  
  // We need to detect URLs and render them as images directly
  const renderContent = () => {
    // Process the markdown to HTML
    const processedHtml = processMarkdown(content);
    
    // Replace image markdown with actual image tags
    // This is a safer approach than using dangerouslySetInnerHTML
    const parts = [];
    const regex = /!\[(.*?)\]\((https?:\/\/[^)]+)\)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // Add the text before the image
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ 
            __html: processMarkdown(content.substring(lastIndex, match.index)) 
          }} />
        );
      }
      
      // Extract the alt text and image URL
      const [, altText, imageUrl] = match;
      
      // Add the image component
      parts.push(
        <div key={`img-${match.index}`} className="my-4 text-center">
          <img 
            src={imageUrl} 
            alt={altText} 
            className="max-w-full h-auto rounded mx-auto" 
            style={{ display: 'block' }}
          />
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining content after the last image
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ 
          __html: processMarkdown(content.substring(lastIndex)) 
        }} />
      );
    }
    
    // If no images were found, just render the processed HTML
    if (parts.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />;
    }
    
    return parts;
  };
  
  return (
    <div className="prose prose-lg max-w-none font-merriweather text-base sm:text-lg leading-[34px] text-foreground">
      {renderContent()}
    </div>
  );
};

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
  console.log({ blog, blogId })
  // Initialize with server-fetched blog
  const [blogPost] = useState(blog);
  
  // Use RTK Query hooks for comments and related posts
  const { data: comments = [] } = useGetCommentsQuery({
    contentType: 'TechBlog',
    contentId: blogId
  });
  
  const { data: relatedPosts = [] } = useGetRelatedTechBlogsQuery(blogId);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (!blogPost) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen text-foreground">
      <BlogSchema blog={blogPost} />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <div className="py-4 sm:py-6 md:py-8">
          <Link href="/blog" className="inline-flex items-center text-xs sm:text-sm hover:text-primary">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back
          </Link>
        </div>
        
        {/* Header Section */}
        <SharedContentHeader content={blogPost} contentType="TechBlog" />
        
        {/* Decorative Line */}
        <div className="w-full mx-auto mt-4 md:mt-8 mb-8 sm:mb-12 md:mb-16">
          <DecorativeLine />
        </div>
        
        {/* Content Section */}
        <div className="w-full max-w-[1064px] mx-auto mb-16 md:mb-36 px-4 sm:px-6 relative">
          {/* Keep your MarkdownRenderer component */}
          <MarkdownRenderer content={blogPost.content} />
        </div>
        
        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="max-w-[1064px] mx-auto mb-8">
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag, index) => (
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
                key={comment._id || comment.id}
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
                  href={`/blog/${post._id}`} 
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