// src/components/layout/SharedContentHeader.jsx
'use client';
import Image from 'next/image';
import ShareButtons from './ShareButtons';

const SharedContentHeader = ({ content, contentType }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }); 
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Get appropriate content values based on content type
  const title = content?.title || "Title";
  const category = contentType === 'TechBlog' 
    ? (content?.category ? content.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'TechBlog')
    : (content?.category ? content.category.charAt(0).toUpperCase() + content.category.slice(1) : 'Article');
  const imageUrl = content?.images?.large || content?.images?.medium || '/placeholder.jpg';
  const publishDate = formatDate(content?.publishedAt || content?.createdAt);

  return (
    <div className="flex flex-col text-foreground lg:flex-row items-center gap-6 sm:gap-8 lg:gap-20 mt-6 sm:mt-8 lg:mt-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Left Content */}
      <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 w-full lg:w-[560px]">
        {/* Top Section */}
        <div className="flex flex-col gap-3 sm:gap-5">
          {/* Category and Date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
            <span className="flex items-center justify-center px-3 py-1.5 sm:py-2 bg-[rgba(140,140,140,0.1)] rounded">
              <p className="font-work-sans text-gray-400 text-sm sm:text-base font-medium">
                {category}
              </p>
            </span>
            <p className="font-work-sans text-gray-400 text-sm sm:text-base font-normal">
              {publishDate}
            </p>
          </div>

          {/* Title */}
          <h1 className="font-dm-sans text-3xl sm:text-4xl lg:text-[52px] leading-tight sm:leading-snug lg:leading-[68px] font-medium">
            {title}
          </h1>
          
          {/* Subtitle for TechBlog */}
          {contentType === 'TechBlog' && content?.subtitle && (
            <h2 className="font-work-sans text-lg text-gray-600 font-normal leading-relaxed">
              {content.subtitle}
            </h2>
          )}
          
          {/* Author and read time for TechBlog */}
          {contentType === 'TechBlog' && (
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mt-2">
              {content?.author?.name && (
                <div className="flex items-center">
                  <span className="font-work-sans">{content.author.name}</span>
                </div>
              )}
              
              {content?.readTime && (
                <div className="flex items-center">
                  <span className="font-work-sans">{content.readTime} min read</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Share Section - Using the separated ShareButtons component */}
        <ShareButtons />
      </div>

      {/* Right Content - Image */}
      <div className="w-full h-[250px] sm:h-[350px] lg:h-[494px] lg:w-[640px] rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={640}
          height={494}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
};

export default SharedContentHeader;