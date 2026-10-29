// src/components/MarkdownRenderer.js
'use client';

import Image from 'next/image';
import React from 'react';

/**
 * Escape HTML special characters to prevent XSS when injecting into innerHTML.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * A lightweight, sanitised Markdown → HTML converter.
 * All user content is HTML-escaped before any inline HTML is re-added
 * by the renderer itself, preventing XSS injection.
 */
function processMarkdown(mdContent) {
  // 1. Protect code blocks first — escape their contents entirely
  const codeBlocks = [];
  let html = mdContent.toString().replace(/```([\s\S]*?)```/g, (_, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="bg-gray-100 p-3 my-3 rounded overflow-x-auto"><code>${escapeHtml(code)}</code></pre>`);
    return `\x00CODE${idx}\x00`;
  });

  // 2. Inline code
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code class="bg-gray-100 px-1 rounded font-mono text-sm">${escapeHtml(code)}</code>`);
    return `\x00INLINE${idx}\x00`;
  });

  // 3. Headings (applied before escaping paragraphs)
  html = html.replace(/^# (.*)$/gm, (_, t) => `<h1 class="text-2xl font-bold mt-6 mb-3">${escapeHtml(t)}</h1>`);
  html = html.replace(/^## (.*)$/gm, (_, t) => `<h2 class="text-xl font-bold mt-5 mb-2">${escapeHtml(t)}</h2>`);
  html = html.replace(/^### (.*)$/gm, (_, t) => `<h3 class="text-lg font-bold mt-4 mb-2">${escapeHtml(t)}</h3>`);

  // 4. Blockquotes
  html = html.replace(/^> (.*)$/gm, (_, t) =>
    `<blockquote class="border-l-4 border-gray-300 pl-4 py-1 my-4 italic text-gray-700">${escapeHtml(t)}</blockquote>`
  );

  // 5. Ordered lists
  html = html.replace(/^(\d+)\. (.*)(?:\n^\d+\. (.*))*$/gm, (match) => {
    const items = match
      .split('\n')
      .map((line) => {
        const m = line.match(/^\d+\. (.*)$/);
        return m ? `<li>${escapeHtml(m[1])}</li>` : '';
      })
      .join('');
    return `<ol class="list-decimal pl-6 my-4">${items}</ol>`;
  });

  // 6. Unordered lists
  html = html.replace(/^- (.*)(?:\n^- (.*))*$/gm, (match) => {
    const items = match
      .split('\n')
      .map((line) => {
        const m = line.match(/^- (.*)$/);
        return m ? `<li>${escapeHtml(m[1])}</li>` : '';
      })
      .join('');
    return `<ul class="list-disc pl-6 my-4">${items}</ul>`;
  });

  // 7. Bold / italic / strikethrough
  html = html.replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong>${escapeHtml(t)}</strong>`);
  html = html.replace(/\*([^*]+)\*/g, (_, t) => `<em>${escapeHtml(t)}</em>`);
  html = html.replace(/~~([^~]+)~~/g, (_, t) => `<del>${escapeHtml(t)}</del>`);

  // 8. Links — URL is validated to only allow http/https
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const safeHref = /^https?:\/\//i.test(href) ? href : '#';
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${escapeHtml(label)}</a>`;
  });

  // 9. Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-6 border-t border-gray-300" />');

  // 10. Paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map((para) => {
      if (
        para.startsWith('<h1') ||
        para.startsWith('<h2') ||
        para.startsWith('<h3') ||
        para.startsWith('<ul') ||
        para.startsWith('<ol') ||
        para.startsWith('<blockquote') ||
        para.startsWith('<pre') ||
        para.startsWith('<hr') ||
        para.startsWith('\x00CODE')
      ) {
        return para;
      }
      const withBreaks = para.replace(/\n/g, '<br>');
      return `<p class="my-3">${withBreaks}</p>`;
    })
    .join('\n\n');

  // 11. Restore code block placeholders
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`\x00CODE${idx}\x00`, block);
  });
  inlineCodes.forEach((block, idx) => {
    html = html.replace(`\x00INLINE${idx}\x00`, block);
  });

  return html;
}

export const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const safeContent = String(content);

  // Extract images separately so we can use Next.js <Image>
  const imagePattern = /!\[(.*?)\]\((https?:\/\/[^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = imagePattern.exec(safeContent)) !== null) {
    if (match.index > lastIndex) {
      const segment = safeContent.substring(lastIndex, match.index);
      if (segment.trim()) {
        parts.push(
          <span
            key={`text-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: processMarkdown(segment) }}
          />
        );
      }
    }

    const [, altText, imageUrl] = match;
    parts.push(
      <div key={`img-${match.index}`} className="my-4 text-center relative w-full" style={{ minHeight: 200 }}>
        <Image
          src={imageUrl}
          alt={altText || 'Image'}
          fill
          className="object-contain rounded"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < safeContent.length) {
    const remaining = safeContent.substring(lastIndex);
    if (remaining.trim()) {
      parts.push(
        <span
          key={`text-${lastIndex}`}
          dangerouslySetInnerHTML={{ __html: processMarkdown(remaining) }}
        />
      );
    }
  }

  if (parts.length === 0) {
    return (
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: processMarkdown(safeContent) }}
      />
    );
  }

  return <div className="prose prose-lg max-w-none">{parts}</div>;
};

export default MarkdownRenderer;
