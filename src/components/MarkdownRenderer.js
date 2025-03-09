// src/components/MarkdownRenderer.jsx
'use client';

import React from 'react';

export const MarkdownRenderer = ({ content }) => {
  // Return null for empty content
  if (!content) return null;

  // Process markdown content with safeguards against recursion
  const processMarkdown = (mdContent) => {
    // Create a new string instead of modifying in place to avoid recursive replacements
    let html = mdContent.toString();

    // Process code blocks first
    html = html.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
      return `<pre class="bg-gray-100 p-3 my-3 rounded overflow-x-auto"><code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>');
    
    // Process headings (match at line beginning)
    html = html.replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
    html = html.replace(/^## (.*)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>');
    html = html.replace(/^### (.*)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    
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
    
    // Process text formatting - using non-recursive replacements
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    
    // Process links with styling - limit depth to avoid recursion
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>');
    
    // Process horizontal rule
    html = html.replace(/^---$/gm, '<hr class="my-6 border-t border-gray-300" />');
    
    // Split into paragraphs on double newlines
    const paragraphs = html.split(/\n\n+/);
    
    // Handle paragraphs and line breaks
    return paragraphs.map(para => {
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
      
      // Regular paragraph handling - replace line breaks with <br>
      const withLineBreaks = para.replace(/\n/g, '<br>');
      return `<p class="my-3">${withLineBreaks}</p>`;
    }).join('\n\n');
  };

  // Handle images to avoid problems with dangerouslySetInnerHTML
  const renderContent = () => {
    // For safety, create a copy of the content
    const safeContent = String(content);
    
    // Extract image patterns
    const imagePattern = /!\[(.*?)\]\((https?:\/\/[^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    // Find all images in the content
    while ((match = imagePattern.exec(safeContent)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        const textSegment = safeContent.substring(lastIndex, match.index);
        // Only process non-empty text
        if (textSegment.trim()) {
          parts.push(
            <span 
              key={`text-${lastIndex}`} 
              dangerouslySetInnerHTML={{ 
                __html: processMarkdown(textSegment) 
              }} 
            />
          );
        }
      }
      
      // Extract image info and add image component
      const [, altText, imageUrl] = match;
      parts.push(
        <div key={`img-${match.index}`} className="my-4 text-center">
          <img 
            src={imageUrl} 
            alt={altText || 'Image'} 
            className="max-w-full h-auto rounded mx-auto" 
            style={{ display: 'block' }}
          />
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining content after the last image
    if (lastIndex < safeContent.length) {
      const remainingText = safeContent.substring(lastIndex);
      if (remainingText.trim()) {
        parts.push(
          <span 
            key={`text-${lastIndex}`} 
            dangerouslySetInnerHTML={{ 
              __html: processMarkdown(remainingText) 
            }} 
          />
        );
      }
    }
    
    // If no images found, just process the entire content
    if (parts.length === 0) {
      try {
        return <div dangerouslySetInnerHTML={{ __html: processMarkdown(safeContent) }} />;
      } catch (error) {
        console.error("Error processing markdown:", error);
        return <div className="text-red-500">Error processing content: {error.message}</div>;
      }
    }
    
    return parts;
  };
  
  try {
    return (
      <div className="prose prose-lg max-w-none">
        {renderContent()}
      </div>
    );
  } catch (error) {
    console.error("Error rendering markdown:", error);
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-md">
        <p>Error rendering content: {error.message}</p>
        <pre className="mt-2 p-2 bg-red-50 rounded text-sm overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
};

export default MarkdownRenderer;