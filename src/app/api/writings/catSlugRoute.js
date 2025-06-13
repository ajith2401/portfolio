// src/app/api/category/[slug]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TechBlog, Writing, Project } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 12, 50);
    const skip = (page - 1) * limit;
    const type = searchParams.get('type') || 'all'; // all, blog, quill, devfolio

    if (!slug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    // Normalize category slug
    const category = slug.replace(/-/g, ' ').toLowerCase();
    
    let results = {
      category: category,
      categorySlug: slug,
      page,
      limit,
      totalItems: 0,
      totalPages: 0,
      items: []
    };

    // Fetch from different collections based on type
    if (type === 'all' || type === 'blog') {
      const blogQuery = { 
        status: 'published',
        category: { $regex: new RegExp(category, 'i') }
      };

      const [blogs, blogCount] = await Promise.all([
        TechBlog.find(blogQuery)
          .sort({ publishedAt: -1 })
          .skip(type === 'blog' ? skip : 0)
          .limit(type === 'blog' ? limit : Math.floor(limit / 3))
          .select('title slug excerpt category tags publishedAt readTime images performance.views averageRating author')
          .populate('author', 'name')
          .lean(),
        
        TechBlog.countDocuments(blogQuery)
      ]);

      const blogItems = blogs.map(blog => ({
        ...blog,
        type: 'blog',
        url: `/blog/${blog.slug || blog._id}`,
        readTimeText: `${blog.readTime || 5} min read`
      }));

      results.items.push(...blogItems);
      if (type === 'blog') {
        results.totalItems = blogCount;
      }
    }

    if (type === 'all' || type === 'quill') {
      const writingQuery = { 
        status: 'published',
        category: { $regex: new RegExp(category, 'i') }
      };

      const [writings, writingCount] = await Promise.all([
        Writing.find(writingQuery)
          .sort({ publishedAt: -1 })
          .skip(type === 'quill' ? skip : 0)
          .limit(type === 'quill' ? limit : Math.floor(limit / 3))
          .select('title slug excerpt category tags publishedAt readTime images performance.views averageRating language')
          .lean(),
        
        Writing.countDocuments(writingQuery)
      ]);

      const writingItems = writings.map(writing => ({
        ...writing,
        type: 'quill',
        url: `/quill/${writing.slug || writing._id}`,
        readTimeText: `${writing.readTime || 3} min read`
      }));

      results.items.push(...writingItems);
      if (type === 'quill') {
        results.totalItems = writingCount;
      }
    }

    if (type === 'all' || type === 'devfolio') {
      const projectQuery = { 
        status: 'published',
        category: { $regex: new RegExp(category, 'i') }
      };

      const [projects, projectCount] = await Promise.all([
        Project.find(projectQuery)
          .sort({ publishedAt: -1 })
          .skip(type === 'devfolio' ? skip : 0)
          .limit(type === 'devfolio' ? limit : Math.floor(limit / 3))
          .select('title slug shortDescription category technologies publishedAt images performance.views featured')
          .lean(),
        
        Project.countDocuments(projectQuery)
      ]);

      const projectItems = projects.map(project => ({
        ...project,
        type: 'devfolio',
        url: `/devfolio/${project.slug || project._id}`,
        excerpt: project.shortDescription
      }));

      results.items.push(...projectItems);
      if (type === 'devfolio') {
        results.totalItems = projectCount;
      }
    }

    // For 'all' type, calculate total from all collections
    if (type === 'all') {
      results.totalItems = results.items.length;
      
      // Sort all items by publication date
      results.items.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      
      // Apply pagination for combined results
      results.items = results.items.slice(skip, skip + limit);
    }

    results.totalPages = Math.ceil(results.totalItems / limit);
    results.hasNextPage = page < results.totalPages;
    results.hasPrevPage = page > 1;

    // Add metadata for SEO
    results.seo = {
      title: `${category.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')} - Category`,
      description: `Explore all content in the ${category} category. Find articles, tutorials, and insights on ${category}.`,
      canonicalUrl: `https://www.ajithkumarr.com/category/${slug}`,
      keywords: [category, 'Ajithkumar', 'blog', 'articles', 'tutorials'].join(', ')
    };

    // Add related categories
    const relatedCategories = await Promise.all([
      TechBlog.distinct('category', { status: 'published' }),
      Writing.distinct('category', { status: 'published' }),
      Project.distinct('category', { status: 'published' })
    ]).then(([blogCats, writingCats, projectCats]) => {
      const allCategories = [...new Set([...blogCats, ...writingCats, ...projectCats])]
        .filter(cat => cat && cat.toLowerCase() !== category.toLowerCase())
        .slice(0, 10);
      
      return allCategories.map(cat => ({
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, '-'),
        url: `/category/${cat.toLowerCase().replace(/\s+/g, '-')}`
      }));
    });

    results.relatedCategories = relatedCategories;

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('Category API error:', error);
    
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: 'Please try again in a moment'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch category content',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}