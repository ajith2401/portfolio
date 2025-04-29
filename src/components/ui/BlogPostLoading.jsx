'use client';

import React from 'react';

const BlogPostLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className="h-4 bg-gray-200 rounded w-full"
                style={{ 
                  width: `${Math.random() * 20 + 80}%` 
                }}
              ></div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostLoading;