// src/app/api/feed/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TechBlog, Writing } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to escape XML characters
function escapeXML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Helper function to format date for RSS
function formatRSSDate(date) {
  return new Date(date).toUTCString();
}

// Helper function to clean HTML content
function cleanContent(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 500) + '...'; // Limit length
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, blog, quill
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 50);

    let items = [];
    const baseUrl = 'https://www.ajithkumarr.com';

    // Fetch content based on type
    if (type === 'all' || type === 'blog') {
      const blogs = await TechBlog.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(type === 'blog' ? limit : Math.floor(limit / 2))
        .select('title slug content excerpt category tags publishedAt images author')
        .lean();

      const blogItems = blogs.map(blog => ({
        title: blog.title,
        link: `${baseUrl}/blog/${blog.slug || blog._id}`,
        description: blog.excerpt || cleanContent(blog.content),
        content: blog.content,
        pubDate: formatRSSDate(blog.publishedAt),
        category: blog.category,
        tags: blog.tags || [],
        author: blog.author?.name || 'Ajithkumar',
        guid: `${baseUrl}/blog/${blog.slug || blog._id}`,
        type: 'blog'
      }));

      items.push(...blogItems);
    }

    if (type === 'all' || type === 'quill') {
      const writings = await Writing.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(type === 'quill' ? limit : Math.floor(limit / 2))
        .select('title slug body excerpt category tags publishedAt images language')
        .lean();

      const writingItems = writings.map(writing => ({
        title: writing.title,
        link: `${baseUrl}/quill/${writing.slug || writing._id}`,
        description: writing.excerpt || cleanContent(writing.body),
        content: writing.body,
        pubDate: formatRSSDate(writing.publishedAt),
        category: writing.category,
        tags: writing.tags || [],
        author: 'Ajithkumar',
        guid: `${baseUrl}/quill/${writing.slug || writing._id}`,
        language: writing.language || 'tamil',
        type: 'writing'
      }));

      items.push(...writingItems);
    }

    // Sort all items by publication date
    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    items = items.slice(0, limit);

    // Generate RSS XML
    const rssTitle = type === 'blog' ? 'Ajithkumar - Technical Blog' :
                    type === 'quill' ? 'Ajithkumar - Tamil Poetry & Writings' :
                    'Ajithkumar - Blog & Writings';

    const rssDescription = type === 'blog' ? 'Latest tutorials on React.js, Next.js, Node.js, and MERN stack development' :
                          type === 'quill' ? 'Latest Tamil poetry, philosophy, and creative writings' :
                          'Latest blog posts and creative writings by Ajithkumar';

    const rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>${escapeXML(rssTitle)}</title>
    <description>${escapeXML(rssDescription)}</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${formatRSSDate(new Date())}</lastBuildDate>
    <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
    <generator>Ajithkumar Website</generator>
    <managingEditor>contact@ajithkumarr.com (Ajithkumar)</managingEditor>
    <webMaster>contact@ajithkumarr.com (Ajithkumar)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/images/logo.png</url>
      <title>${escapeXML(rssTitle)}</title>
      <link>${baseUrl}</link>
      <width>200</width>
      <height>60</height>
    </image>
    <atom:link href="${baseUrl}/api/feed${type !== 'all' ? `?type=${type}` : ''}" rel="self" type="application/rss+xml" />
    
    ${items.map(item => `
    <item>
      <title>${escapeXML(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXML(item.description)}</description>
      <content:encoded><![CDATA[${item.content || item.description}]]></content:encoded>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
      <dc:creator>${escapeXML(item.author)}</dc:creator>
      <category>${escapeXML(item.category)}</category>
      ${item.tags.map(tag => `<category>${escapeXML(tag)}</category>`).join('\n      ')}
      ${item.type === 'writing' && item.language === 'tamil' ? '<category>Tamil</category>' : ''}
      ${item.type === 'blog' ? '<category>Technology</category>' : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(rssXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex' // Don't index RSS feeds
      }
    });

  } catch (error) {
    console.error('RSS Feed generation error:', error);
    
    // Return a minimal valid RSS feed on error
    const errorRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ajithkumar - Feed Temporarily Unavailable</title>
    <description>RSS feed is temporarily unavailable. Please try again later.</description>
    <link>https://www.ajithkumarr.com</link>
    <language>en-us</language>
    <lastBuildDate>${formatRSSDate(new Date())}</lastBuildDate>
  </channel>
</rss>`;

    return new NextResponse(errorRSS, {
      status: 503,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache error for 5 minutes
        'Retry-After': '300'
      }
    });
  }
}