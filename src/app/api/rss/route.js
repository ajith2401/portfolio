import connectDB from "@/lib/db";
import { TechBlog, Writing } from "@/models";
import { NextResponse } from "next/server";
import { cdata, writingFeedItem } from "@/lib/public/feed";
import { escapeXml } from "@/lib/public/comments";

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();

  const [techBlogs, writings] = await Promise.all([
    TechBlog.find({ status: 'published' }).select('title slug subtitle content category publishedAt createdAt')
      .sort({ publishedAt: -1 }).limit(20).lean(),
    Writing.find({ status: 'published', slug: { $exists: true, $ne: '' } })
      .select('title slug excerpt body content contentFormat category tags publishedAt createdAt language')
      .sort({ publishedAt: -1 }).limit(20).lean(),
  ]);

  const baseUrl = 'https://www.ajithkumarr.com';
  const blogItems = techBlogs.filter((b) => b.slug).map((blog) => {
    const link = `${baseUrl}/blog/${encodeURIComponent(blog.slug)}`;
    return `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(blog.publishedAt || blog.createdAt).toUTCString()}</pubDate>
      <description>${cdata(blog.subtitle || String(blog.content || '').replace(/<[^>]*>/g, ' ').slice(0, 160))}</description>
      <category>${escapeXml(blog.category)}</category>
    </item>`;
  });
  const writingItems = writings.map((w) => writingFeedItem(w)).filter(Boolean).map((it) => `
    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${it.link}</link>
      <guid isPermaLink="true">${it.link}</guid>
      <pubDate>${it.pubDate}</pubDate>
      <description>${cdata(it.description)}</description>
      <category>${escapeXml(it.category)}</category>
    </item>`);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ajithkumar R</title>
    <link>${baseUrl}</link>
    <description>Tamil poetry, stories and writing by Ajithkumar R</description>
    <language>ta</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>${blogItems.join('')}${writingItems.join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
