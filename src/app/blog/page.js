// src/app/blog/page.js
import { Suspense } from 'react';
import connectDB from '@/lib/db';
import { TechBlog } from '@/models';
import TechBlogClient from './TechBlogClient';
import DeveloperSchema from '@/components/SEO/DeveloperSchema';
import PageSEO from '@/components/SEO/PageSEO';
import { notFound } from 'next/navigation';

// Enhanced metadata for better SEO
export const metadata = {
  title: "Technical Blog - React.js, Next.js & MERN Stack Tutorials",
  description: "Comprehensive tutorials and insights on React.js, Next.js, Node.js, MongoDB, and full stack development by Ajithkumar - Tamil developer and writer.",
  keywords: [
    'React.js tutorials',
    'Next.js guide',
    'MERN stack development',
    'JavaScript best practices',
    'Node.js tutorials',
    'MongoDB optimization',
    'Full stack developer blog',
    'Tamil developer',
    'React hooks tutorial',
    'Express.js guide',
    'Web development tutorials',
    'Frontend development',
    'Backend development',
    'Database design',
    'API development',
    'Modern JavaScript'
  ],
  authors: [{ 
    name: 'Ajithkumar',
    url: 'https://www.ajithkumarr.com/about'
  }],
  openGraph: {
    title: "Technical Blog | Ajithkumar - Full Stack Developer",
    description: "Learn React.js, Next.js, Node.js, and MERN stack development through comprehensive tutorials and real-world examples.",
    url: 'https://www.ajithkumarr.com/blog',
    siteName: 'Ajithkumar',
    images: [
      {
        url: '/og-image-tech.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajithkumar Tech Blog - React.js & MERN Stack Tutorials'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Technical Blog | React.js & MERN Stack Tutorials",
    description: "Learn modern web development with React.js, Next.js, Node.js tutorials and best practices.",
    images: ['/twitter-image-tech.jpg'],
    creator: '@ajithkumarr'
  },
  alternates: {
    canonical: 'https://www.ajithkumarr.com/blog',
    types: {
      'application/rss+xml': [
        { url: '/blog/feed.xml', title: 'Tech Blog RSS Feed' }
      ]
    }
  },
  category: 'Technology',
  classification: 'Educational Content'
};

// Loading component for better UX
function BlogLoading() {
  return (
    <div className="min-h-screen">
      {/* SEO-friendly loading content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Technical Blog - Loading...
          </h1>
          <p className="text-xl text-gray-600">
            React.js, Next.js & MERN Stack Tutorials
          </p>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Server component for better SEO
export default async function TechBlogPage({ searchParams }) {
  try {
    await connectDB();
    
    // Get query parameters for filtering
    const page = parseInt(searchParams?.page) || 1;
    const category = searchParams?.category;
    const tag = searchParams?.tag;
    const search = searchParams?.search;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build query based on filters
    let query = { status: 'published' };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Fetch posts with proper sorting and pagination
    const [posts, totalPosts, categories, popularTags] = await Promise.all([
      TechBlog.find(query)
        .sort(search ? { score: { $meta: 'textScore' }, publishedAt: -1 } : { publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug excerpt category tags images publishedAt readTime performance.views averageRating author')
        .populate('author', 'name')
        .lean(),
      
      TechBlog.countDocuments(query),
      
      // Get all categories for navigation
      TechBlog.distinct('category', { status: 'published' }),
      
      // Get popular tags
      TechBlog.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ])
    ]);

    // Get featured posts for first page
    let featuredPosts = [];
    if (page === 1 && !category && !tag && !search) {
      featuredPosts = await TechBlog.getFeatured(3);
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Serialize data for client component
    const serializedData = {
      posts: JSON.parse(JSON.stringify(posts)),
      featuredPosts: JSON.parse(JSON.stringify(featuredPosts)),
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage,
        hasPrevPage,
        limit
      },
      filters: {
        categories,
        popularTags: popularTags.map(tag => ({
          name: tag._id,
          count: tag.count
        })),
        activeCategory: category,
        activeTag: tag,
        searchQuery: search
      }
    };

    return (
      <>
        {/* Enhanced SEO metadata */}
        <PageSEO
          title={`Technical Blog${category ? ` - ${category}` : ''}${tag ? ` - ${tag}` : ''}${search ? ` - ${search}` : ''}`}
          description={`${search ? `Search results for "${search}" in` : 'Explore'} React.js, Next.js, Node.js, and MERN stack tutorials. Learn modern web development through practical examples and best practices.`}
          canonicalPath="/blog"
          ogType="website"
          keywords={[
            'React.js tutorials',
            'Next.js guide', 
            'MERN stack',
            'JavaScript',
            'Node.js',
            'MongoDB',
            'Tamil developer',
            ...(category ? [category] : []),
            ...(tag ? [tag] : [])
          ]}
          category="Technology"
        />

        {/* Developer Schema for technical expertise */}
        <DeveloperSchema 
          includedSkills={[
            'JavaScript',
            'React.js',
            'Next.js',
            'Node.js',
            'Express.js',
            'MongoDB',
            'MERN Stack',
            'Full Stack Development',
            'RESTful APIs',
            'Web Development',
            'Frontend Development',
            'Backend Development',
            'Database Design',
            'TypeScript',
            'GraphQL',
            'AWS',
            'Docker'
          ]} 
        />
        
        {/* SEO content for search engines */}
        <div className="sr-only">
          <h1>Ajithkumar - Full Stack MERN Developer Technical Blog</h1>
          <p>
            Comprehensive technical tutorials and insights for JavaScript, React.js, Next.js, 
            Node.js, MongoDB, and MERN stack development. Learn from real-world projects 
            and best practices by Ajithkumar - an experienced Full Stack Developer and 
            Tamil writer specializing in modern web application development.
          </p>
          <div>
            <h2>Featured Technical Topics</h2>
            <ul>
              <li>React.js Development - Modern components, hooks, and state management patterns</li>
              <li>Next.js Framework - Server-side rendering, API routes, and performance optimization</li>
              <li>Node.js & Express.js - Backend development, REST APIs, and microservices</li>
              <li>MongoDB Database - NoSQL design, aggregation pipelines, and optimization techniques</li>
              <li>MERN Stack Projects - Full-stack application development from concept to deployment</li>
              <li>JavaScript Best Practices - ES6+ features, async programming, and code organization</li>
              <li>DevOps & Deployment - CI/CD, Docker, AWS, and production optimizations</li>
              <li>Performance Optimization - Core Web Vitals, bundle optimization, and caching strategies</li>
            </ul>
          </div>
          <div>
            <h2>About the Author</h2>
            <p>
              Ajithkumar is a full stack developer with expertise in the MERN stack (MongoDB, 
              Express.js, React.js, Node.js). He is also an award-winning Tamil writer and poet 
              with 5 published poetry books. His unique perspective combines technical expertise 
              with creative thinking, making complex development concepts accessible to developers 
              of all skill levels.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <Suspense fallback={<BlogLoading />}>
          <TechBlogClient 
            initialData={serializedData}
            searchParams={searchParams}
          />
        </Suspense>

        {/* Additional structured data for blog listing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "@id": "https://www.ajithkumarr.com/blog#blog",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.ajithkumarr.com/blog"
              },
              "name": "Ajithkumar Technical Blog",
              "description": "Technical blog covering React.js, Next.js, Node.js, and MERN stack development",
              "url": "https://www.ajithkumarr.com/blog",
              "author": {
                "@type": "Person",
                "@id": "https://www.ajithkumarr.com/#ajithkumar",
                "name": "Ajithkumar"
              },
              "publisher": {
                "@type": "Person",
                "@id": "https://www.ajithkumarr.com/#ajithkumar"
              },
              "inLanguage": "en-US",
              "keywords": "React.js, Next.js, Node.js, MERN stack, JavaScript, web development, Tamil developer",
              "blogPost": posts.slice(0, 5).map(post => ({
                "@type": "BlogPosting",
                "@id": `https://www.ajithkumarr.com/blog/${post.slug || post._id}`,
                "headline": post.title,
                "description": post.excerpt,
                "url": `https://www.ajithkumarr.com/blog/${post.slug || post._id}`,
                "datePublished": post.publishedAt,
                "author": {
                  "@type": "Person",
                  "name": post.author?.name || "Ajithkumar"
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://www.ajithkumarr.com/blog/${post.slug || post._id}`
                }
              }))
            })
          }}
        />
      </>
    );
  } catch (error) {
    console.error('Blog page error:', error);
    
    // Return not found for critical errors
    if (error.name === 'MongoNetworkError') {
      notFound();
    }
    
    // Fallback UI for other errors
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Technical Blog - Temporarily Unavailable
          </h1>
          <p className="text-gray-600 mb-8">
            We're experiencing technical difficulties. Please try again later.
          </p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }
}