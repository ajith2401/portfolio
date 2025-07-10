// src/app/api/search/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TechBlog, Writing, Project, Book } from '@/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to clean and prepare search query
function prepareSearchQuery(query) {
  if (!query) return '';
  
  // Remove special characters but keep Tamil characters
  return query
    .trim()
    .replace(/[^\w\s\u0B80-\u0BFF]/g, ' ') // Keep alphanumeric, spaces, and Tamil
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Helper function to highlight search terms in text
function highlightSearchTerms(text, searchTerms) {
  if (!text || !searchTerms) return text;
  
  const terms = searchTerms.split(' ').filter(term => term.length > 2);
  if (terms.length === 0) return text;
  
  let highlightedText = text;
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
}

// Helper function to extract relevant snippet
function extractSnippet(content, searchTerms, maxLength = 200) {
  if (!content) return '';
  
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (!searchTerms) {
    return cleanContent.substring(0, maxLength) + (cleanContent.length > maxLength ? '...' : '');
  }
  
  const terms = searchTerms.toLowerCase().split(' ').filter(term => term.length > 2);
  const contentLower = cleanContent.toLowerCase();
  
  // Find the first occurrence of any search term
  let bestIndex = -1;
  for (const term of terms) {
    const index = contentLower.indexOf(term);
    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index;
    }
  }
  
  if (bestIndex === -1) {
    return cleanContent.substring(0, maxLength) + (cleanContent.length > maxLength ? '...' : '');
  }
  
  // Extract snippet around the found term
  const start = Math.max(0, bestIndex - 50);
  const end = Math.min(cleanContent.length, start + maxLength);
  const snippet = cleanContent.substring(start, end);
  
  return (start > 0 ? '...' : '') + snippet + (end < cleanContent.length ? '...' : '');
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q') || searchParams.get('query') || '';
    const type = searchParams.get('type') || 'all'; // all, blog, quill, devfolio, spotlight
    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 15, 50);
    const skip = (page - 1) * limit;

    const query = prepareSearchQuery(rawQuery);
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        query: rawQuery,
        results: [],
        totalResults: 0,
        page,
        totalPages: 0,
        suggestions: [
          'React.js tutorials',
          'Tamil poetry',
          'MERN stack',
          'Next.js guide',
          'Node.js development',
          'JavaScript best practices'
        ]
      }, { status: 400 });
    }

    let allResults = [];

    // Search Tech Blogs
    if (type === 'all' || type === 'blog') {
      try {
        const blogResults = await TechBlog.find({
          status: 'published',
          $text: { $search: query }
        })
        .select('title slug _id excerpt content category tags publishedAt readTime images performance.views averageRating author')
        .populate('author', 'name')
        .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
        .limit(type === 'blog' ? limit : Math.ceil(limit / 4))
        .lean();

        const formattedBlogs = blogResults.map(blog => ({
          id: blog._id,
          title: blog.title,
          url: `/blog/${blog.slug || blog._id}`,
          type: 'blog',
          typeLabel: 'Technical Article',
          excerpt: blog.excerpt || extractSnippet(blog.content, query),
          snippet: highlightSearchTerms(
            blog.excerpt || extractSnippet(blog.content, query), 
            query
          ),
          category: blog.category,
          tags: blog.tags || [],
          publishedAt: blog.publishedAt,
          readTime: blog.readTime,
          views: blog.performance?.views || 0,
          rating: blog.averageRating || 0,
          author: blog.author?.name || 'Ajithkumar',
          image: blog.images?.thumbnail || blog.images?.small,
          score: blog.score || 1
        }));

        allResults.push(...formattedBlogs);
      } catch (error) {
        console.warn('Blog search error:', error);
      }
    }

    // Search Writings
    if (type === 'all' || type === 'quill') {
      try {
        const writingResults = await Writing.find({
          status: 'published',
          $text: { $search: query }
        })
        .select('title slug _id excerpt body category tags publishedAt readTime images performance.views averageRating language')
        .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
        .limit(type === 'quill' ? limit : Math.ceil(limit / 4))
        .lean();

        const formattedWritings = writingResults.map(writing => ({
          id: writing._id,
          title: writing.title,
          url: `/quill/${writing.slug || writing._id}`,
          type: 'quill',
          typeLabel: writing.language === 'tamil' ? 'Tamil Writing' : 'Writing',
          excerpt: writing.excerpt || extractSnippet(writing.body, query),
          snippet: highlightSearchTerms(
            writing.excerpt || extractSnippet(writing.body, query), 
            query
          ),
          category: writing.category,
          tags: writing.tags || [],
          publishedAt: writing.publishedAt,
          readTime: writing.readTime,
          views: writing.performance?.views || 0,
          rating: writing.averageRating || 0,
          author: 'Ajithkumar',
          image: writing.images?.thumbnail || writing.images?.small,
          language: writing.language,
          score: writing.score || 1
        }));

        allResults.push(...formattedWritings);
      } catch (error) {
        console.warn('Writing search error:', error);
      }
    }

    // Search Projects
    if (type === 'all' || type === 'devfolio') {
      try {
        const projectResults = await Project.find({
          status: 'published',
          $text: { $search: query }
        })
        .select('title slug _id shortDescription longDescription category technologies publishedAt images performance.views featured')
        .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
        .limit(type === 'devfolio' ? limit : Math.ceil(limit / 4))
        .lean();

        const formattedProjects = projectResults.map(project => ({
          id: project._id,
          title: project.title,
          url: `/devfolio/${project.slug || project._id}`,
          type: 'devfolio',
          typeLabel: 'Project',
          excerpt: project.shortDescription,
          snippet: highlightSearchTerms(project.shortDescription, query),
          category: project.category,
          tags: project.technologies?.map(tech => 
            typeof tech === 'object' ? tech.name : tech
          ) || [],
          publishedAt: project.publishedAt,
          views: project.performance?.views || 0,
          author: 'Ajithkumar',
          image: project.images?.thumbnail || project.images?.small,
          featured: project.featured,
          score: project.score || 1
        }));

        allResults.push(...formattedProjects);
      } catch (error) {
        console.warn('Project search error:', error);
      }
    }

    // Search Books
    if (type === 'all' || type === 'spotlight') {
      try {
        const bookResults = await Book.find({
          $text: { $search: query }
        })
        .select('title slug _id description coverImage publishYear publisher featured')
        .sort({ score: { $meta: 'textScore' }, publishYear: -1 })
        .limit(type === 'spotlight' ? limit : Math.ceil(limit / 4))
        .lean();

        const formattedBooks = bookResults.map(book => ({
          id: book._id,
          title: book.title,
          url: `/spotlight/${book.slug || book._id}`,
          type: 'spotlight',
          typeLabel: 'Poetry Book',
          excerpt: book.description,
          snippet: highlightSearchTerms(book.description, query),
          category: 'poetry',
          tags: ['Tamil poetry', 'book'],
          publishedAt: new Date(`${book.publishYear}-01-01`),
          author: 'Ajithkumar',
          image: book.coverImage,
          publisher: book.publisher,
          featured: book.featured,
          score: book.score || 1
        }));

        allResults.push(...formattedBooks);
      } catch (error) {
        console.warn('Book search error:', error);
      }
    }

    // Sort all results by relevance score and date
    allResults.sort((a, b) => {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher score first
      }
      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(); // More recent first
    });

    // Apply pagination
    const totalResults = allResults.length;
    const paginatedResults = allResults.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalResults / limit);

    // Generate search suggestions if no results
    let suggestions = [];
    if (totalResults === 0) {
      suggestions = [
        'React hooks tutorial',
        'Next.js SEO guide',
        'Tamil poetry collection',
        'MERN stack project',
        'JavaScript fundamentals',
        'Node.js API development'
      ];
    }

    return NextResponse.json({
      query: rawQuery,
      normalizedQuery: query,
      results: paginatedResults,
      totalResults,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      suggestions,
      searchTime: Date.now(), // For caching
      filters: {
        types: [
          { value: 'all', label: 'All Content', count: totalResults },
          { value: 'blog', label: 'Technical Articles', count: allResults.filter(r => r.type === 'blog').length },
          { value: 'quill', label: 'Writings & Poetry', count: allResults.filter(r => r.type === 'quill').length },
          { value: 'devfolio', label: 'Projects', count: allResults.filter(r => r.type === 'devfolio').length },
          { value: 'spotlight', label: 'Books', count: allResults.filter(r => r.type === 'spotlight').length }
        ]
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return NextResponse.json(
        { 
          error: 'Search service temporarily unavailable',
          message: 'Please try again in a moment'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Search failed',
        message: 'An error occurred while searching. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Handle POST requests for analytics tracking
export async function POST(request) {
  try {
    const { query, resultClicked, position, type } = await request.json();
    
    // Log search analytics (implement your analytics logic here)
    console.log('Search Analytics:', {
      query,
      resultClicked,
      position,
      type,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Search analytics error:', error);
    return NextResponse.json({ error: 'Failed to log analytics' }, { status: 500 });
  }
}