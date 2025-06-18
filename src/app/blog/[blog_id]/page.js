// src/app/blog/[blog_id]/page.js
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import { TechBlog } from '@/models';
import TechBlogPostClient from './TechBlogPostClient';
import PageSEO from '@/components/SEO/PageSEO';
import InternalLinks from '@/components/SEO/InternalLinks';
import ErrorBoundary from '@/components/ErrorBoundary';
// Helper functions
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    await connectDB();
    
    const { blog_id } = params;
    
    if (!blog_id || (!isValidObjectId(blog_id) && !isValidSlug(blog_id))) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
        robots: 'noindex,nofollow'
      };
    }

    let blog;
    
    // Find by slug first (preferred), then by ObjectId (fallback)
    if (isValidSlug(blog_id)) {
      blog = await TechBlog.findOne({ 
        slug: blog_id, 
        status: 'published' 
      }).select('title metaDescription excerpt content category tags publishedAt updatedAt images author readTime wordCount').lean();
    } else if (isValidObjectId(blog_id)) {
      blog = await TechBlog.findOne({ 
        _id: blog_id, 
        status: 'published' 
      }).select('title metaDescription excerpt content category tags publishedAt updatedAt images author readTime wordCount').lean();
    }

    if (!blog) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
        robots: 'noindex,nofollow'
      };
    }

    // Generate optimized description
    const description = blog.metaDescription || 
      blog.excerpt || 
      (blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 160).replace(/[\r\n]+/g, ' ').trim() + '...' : '');
    
    // Generate keywords
    const keywords = [
      ...(blog.tags || []), 
      blog.category, 
      'web development',
      'React.js',
      'Next.js',
      'JavaScript',
      'MERN stack',
      'Tamil developer',
      'Ajithkumar'
    ].filter(Boolean);
    
    // Safe date formatting
    const safeISODate = (dateValue) => {
      if (!dateValue) return undefined;
      try {
        return dateValue instanceof Date 
          ? dateValue.toISOString() 
          : new Date(dateValue).toISOString();
      } catch (error) {
        console.error("Date conversion error:", error);
        return undefined;
      }
    };
    
    const publishedTime = safeISODate(blog.publishedAt);
    const modifiedTime = safeISODate(blog.updatedAt);
    const canonicalUrl = `https://www.ajithkumarr.com/blog/${blog.slug || blog_id}`;

    return {
      title: `${blog.title} | Ajithkumar - Technical Blog`,
      description: description,
      keywords: keywords.join(', '),
      authors: [{ 
        name: blog.author?.name || 'Ajithkumar',
        url: 'https://www.ajithkumarr.com/about'
      }],
      category: blog.category,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: blog.title,
        description: description,
        url: canonicalUrl,
        type: 'article',
        publishedTime,
        modifiedTime,
        authors: [blog.author?.name || 'Ajithkumar'],
        section: blog.category,
        tags: blog.tags,
        images: [
          {
            url: blog.images?.large || blog.images?.medium || '/og-image-tech.jpg',
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        siteName: 'Ajithkumar',
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: description,
        images: [blog.images?.large || blog.images?.medium || '/twitter-image-tech.jpg'],
        creator: '@ajithkumarr'
      },
      other: {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime,
        'article:author': blog.author?.name || 'Ajithkumar',
        'article:section': blog.category,
        ...(blog.tags && blog.tags.reduce((acc, tag, index) => {
          acc[`article:tag${index > 0 ? index : ''}`] = tag;
          return acc;
        }, {}))
      }
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: 'Technical Blog | Ajithkumar',
      description: 'Learn React.js, Next.js, and MERN stack development through comprehensive tutorials.',
      robots: 'noindex,nofollow'
    };
  }
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    await connectDB();
    
    // Get recent published blogs for static generation
    const blogs = await TechBlog.find({ status: 'published' })
      .select('_id slug')
      .sort({ publishedAt: -1 })
      .limit(50) // Limit to most recent/popular posts
      .lean();

    return blogs.map((blog) => ({
      blog_id: blog.slug || blog._id.toString(),
    }));
  } catch (error) {
    console.error("Static params generation error:", error);
    return [];
  }
}

// Loading component for better UX
function BlogPostLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-6 mb-8">
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" 
                 style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main component
export default async function TechBlogPostPage({ params }) {
  try {
    await connectDB();
    
    const { blog_id } = params;
 
    
    if (!blog_id || (!isValidObjectId(blog_id) && !isValidSlug(blog_id))) {
      notFound();
    }

    let blog;
    
    // First, let's check if the blog exists at all (without status filter)
    if (isValidObjectId(blog_id)) {
     
      
      // Check if blog exists without status filter
      const anyBlog = await TechBlog.findById(blog_id).lean();
     
      if (anyBlog) {
       
      }
      
      // Now try with status filter
      blog = await TechBlog.findOne({ 
        _id: blog_id, 
        status: 'published' 
      }).populate('author', 'name email bio').lean();
      
     
      
    } else if (isValidSlug(blog_id)) {
     
      
      // Check if blog exists by slug without status filter
      const anyBlog = await TechBlog.findOne({ slug: blog_id }).lean();
    
      if (anyBlog) {
        
      }
      
      blog = await TechBlog.findOne({ 
        slug: blog_id, 
        status: 'published' 
      }).populate('author', 'name email bio').lean();
      
    }
    
    if (!blog) {

      notFound();
    }


    // Increment view count asynchronously (don't wait)
    if (blog._id) {
      TechBlog.findByIdAndUpdate(
        blog._id, 
        { $inc: { 'performance.views': 1 } },
        { new: false }
      ).catch(err => console.error('Error incrementing views:', err));
    }

    // Safe serialization
    const serializeBlog = (blogData) => {
      try {
        return JSON.parse(JSON.stringify(blogData));
      } catch (error) {
        console.error("Blog serialization error:", error);
        return {
          ...blogData,
          _id: blogData._id?.toString(),
          createdAt: blogData.createdAt?.toISOString(),
          updatedAt: blogData.updatedAt?.toISOString(),
          publishedAt: blogData.publishedAt?.toISOString()
        };
      }
    };

    const serializedBlog = serializeBlog(blog);
    const canonicalUrl = `https://www.ajithkumarr.com/blog/${blog.slug || blog_id}`;

    return (
      <>
        {/* Enhanced SEO */}
        <PageSEO
          title={blog.title}
          description={blog.metaDescription || blog.excerpt}
          canonicalPath={`/blog/${blog.slug || blog_id}`}
          ogType="article"
          publishedAt={blog.publishedAt?.toISOString()}
          updatedAt={blog.updatedAt?.toISOString()}
          author={blog.author?.name || 'Ajithkumar'}
          keywords={blog.tags || []}
          category={blog.category}
          tags={blog.tags || []}
          readTime={blog.readTime}
          wordCount={blog.wordCount}
        />

        {/* Main content wrapper */}
        <ErrorBoundary>
          <Suspense fallback={<BlogPostLoading />}>
            <TechBlogPostClient 
              blog={serializedBlog} 
              blogId={blog_id}
              canonicalUrl={canonicalUrl}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Related content for internal linking 
        <div className="container mx-auto px-4 max-w-4xl">
          <InternalLinks
            currentId={blog._id?.toString()}
            category={blog.category}
            tags={blog.tags || []}
            type="blog"
            title="Related Articles"
            limit={5}
            showImages={true}
            layout="grid"
          />
        </div>
*/}
        {/* Enhanced structured data for article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "@id": canonicalUrl,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonicalUrl
              },
              "headline": blog.title,
              "description": blog.metaDescription || blog.excerpt,
              "image": {
                "@type": "ImageObject",
                "url": blog.images?.large || blog.images?.medium || "https://www.ajithkumarr.com/og-image-tech.jpg",
                "width": 1200,
                "height": 630
              },
              "author": {
                "@type": "Person",
                "@id": "https://www.ajithkumarr.com/#ajithkumar",
                "name": blog.author?.name || "Ajithkumar",
                "url": "https://www.ajithkumarr.com/about",
                "image": "https://www.ajithkumarr.com/images/ajithkumar-portrait.jpg",
                "sameAs": [
                  "https://twitter.com/ajithkumarr",
                  "https://github.com/ajith2401"
                ],
                "jobTitle": ["Full Stack Developer", "Tamil Writer"],
                "knowsLanguage": ["Tamil", "English"]
              },
              "publisher": {
                "@type": "Person",
                "@id": "https://www.ajithkumarr.com/#ajithkumar",
                "name": "Ajithkumar",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.ajithkumarr.com/images/logo.png",
                  "width": 200,
                  "height": 60
                }
              },
              "datePublished": blog.publishedAt,
              "dateModified": blog.updatedAt || blog.publishedAt,
              "articleSection": blog.category,
              "articleBody": blog.content?.replace(/<[^>]*>/g, '').substring(0, 5000),
              "wordCount": blog.wordCount,
              "timeRequired": `PT${blog.readTime || 5}M`,
              "keywords": (blog.tags || []).join(', '),
              "inLanguage": "en-US",
              "url": canonicalUrl,
              "isPartOf": {
                "@type": "Blog",
                "@id": "https://www.ajithkumarr.com/blog#blog",
                "name": "Ajithkumar Technical Blog",
                "url": "https://www.ajithkumarr.com/blog"
              },
              "aggregateRating": blog.averageRating > 0 ? {
                "@type": "AggregateRating",
                "ratingValue": blog.averageRating,
                "ratingCount": blog.totalRatings,
                "bestRating": 5,
                "worstRating": 1
              } : undefined,
              "interactionStatistic": [
                {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/ReadAction",
                  "userInteractionCount": blog.performance?.views || 0
                },
                {
                  "@type": "InteractionCounter", 
                  "interactionType": "https://schema.org/CommentAction",
                  "userInteractionCount": blog.performance?.comments || 0
                }
              ]
            })
          }}
        />

        {/* FAQ Schema if the article contains FAQ content */}
        {blog.content?.includes('Q:') || blog.content?.includes('FAQ') ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": `How to learn ${blog.category}?`,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": blog.excerpt || "Check out this comprehensive tutorial for detailed explanations and practical examples."
                    }
                  }
                ]
              })
            }}
          />
        ) : null}
      </>
    );

  } catch (error) {
    console.error("Blog post page error:", error);
    
    // Handle specific errors
    if (error.name === 'CastError' || error.message.includes('ObjectId')) {
      console.log('❌ Debug - CastError or ObjectId error, calling notFound()');
      notFound();
    }
    
    // For other errors, show error page
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Blog Post
          </h1>
          <p className="text-gray-600 mb-8">
            We encountered an error while loading this blog post. Please try again later.
          </p>
          <div className="space-y-4">
            <a 
              href="/blog" 
              className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Articles
            </a>
            <a 
              href="/" 
              className="block text-blue-600 hover:text-blue-800 transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
}