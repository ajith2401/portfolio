// src/app/sitemap.js
import connectDB from "@/lib/db";
import { TechBlog, Writing, Project, Book } from "@/models";

export default async function sitemap() {
  try {
    await connectDB();
    
    const baseUrl = 'https://www.ajithkumarr.com';
    
    // Fetch all published content with validation
    const [techBlogs, writings, projects, books] = await Promise.all([
      TechBlog.find({ 
        status: 'published',
        title: { $exists: true, $ne: '', $ne: null }
      })
      .select('_id title slug updatedAt createdAt category tags images')
      .sort({ createdAt: -1 })
      .lean()
      .limit(1000), // Prevent memory issues

      Writing.find({ 
        status: 'published',
        title: { $exists: true, $ne: '', $ne: null }
      })
      .select('_id title slug updatedAt createdAt category images')
      .sort({ createdAt: -1 })
      .lean()
      .limit(1000),

      Project.find({ 
        status: 'published',
        title: { $exists: true, $ne: '', $ne: null }
      })
      .select('_id title slug updatedAt createdAt category technologies images')
      .sort({ createdAt: -1 })
      .lean()
      .limit(500),

      Book.find({
        title: { $exists: true, $ne: '', $ne: null }
      })
      .select('_id title slug updatedAt createdAt coverImage publishYear')
      .sort({ createdAt: -1 })
      .lean()
      .limit(100)
    ]);

    // Static routes with proper priorities and change frequencies
    const staticRoutes = [
      {
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: techBlogs[0]?.updatedAt ? new Date(techBlogs[0].updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/quill`,
        lastModified: writings[0]?.updatedAt ? new Date(writings[0].updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/devfolio`,
        lastModified: projects[0]?.updatedAt ? new Date(projects[0].updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/spotlight`,
        lastModified: books[0]?.updatedAt ? new Date(books[0].updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      }
    ];

    // Generate category pages for better SEO
    const categories = new Set();
    techBlogs.forEach(blog => blog.category && categories.add(blog.category));
    writings.forEach(writing => writing.category && categories.add(writing.category));
    projects.forEach(project => project.category && categories.add(project.category));

    const categoryRoutes = Array.from(categories).map(category => ({
      url: `${baseUrl}/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    // Generate tag pages for tech blogs
    const tags = new Set();
    techBlogs.forEach(blog => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => tags.add(tag));
      }
    });

    const tagRoutes = Array.from(tags).slice(0, 50).map(tag => ({
      url: `${baseUrl}/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    }));

    // Blog routes - use slug if available, otherwise ObjectId (temporary)
    const blogRoutes = techBlogs
      .filter(blog => blog.title && blog.title.trim().length > 0)
      .map((blog) => {
        const urlPath = blog.slug ? `/blog/${blog.slug}` : `/blog/${blog._id}`;
        return {
          url: `${baseUrl}${urlPath}`,
          lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.8,
          // Add image information for image sitemaps
          images: blog.images ? [{
            url: blog.images.large || blog.images.medium || blog.images.small,
            title: blog.title,
            caption: `${blog.title} - Technical blog post by Ajithkumar`
          }] : undefined
        };
      });

    // Writing routes - higher priority as you're primarily a writer
    const writingRoutes = writings
      .filter(writing => writing.title && writing.title.trim().length > 0)
      .map((writing) => {
        const urlPath = writing.slug ? `/quill/${writing.slug}` : `/quill/${writing._id}`;
        return {
          url: `${baseUrl}${urlPath}`,
          lastModified: new Date(writing.updatedAt || writing.createdAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.85, // Higher priority for writings
          images: writing.images ? [{
            url: writing.images.large || writing.images.medium || writing.images.small,
            title: writing.title,
            caption: `${writing.title} - Tamil writing by Ajithkumar`
          }] : undefined
        };
      });

    // Project routes
    const projectRoutes = projects
      .filter(project => project.title && project.title.trim().length > 0)
      .map((project) => {
        const urlPath = project.slug ? `/devfolio/${project.slug}` : `/devfolio/${project._id}`;
        return {
          url: `${baseUrl}${urlPath}`,
          lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
          changeFrequency: 'monthly',
          priority: 0.75,
          images: project.images ? [{
            url: project.images.large || project.images.medium || project.images.small,
            title: project.title,
            caption: `${project.title} - Project by Ajithkumar`
          }] : undefined
        };
      });

    // Book routes - highest priority for author credibility
    const bookRoutes = books
      .filter(book => book.title && book.title.trim().length > 0)
      .map((book) => {
        const urlPath = book.slug ? `/spotlight/${book.slug}` : `/spotlight/${book._id}`;
        return {
          url: `${baseUrl}${urlPath}`,
          lastModified: new Date(book.updatedAt || book.createdAt || new Date()),
          changeFrequency: 'yearly',
          priority: 0.9, // Highest priority for published books
          images: book.coverImage ? [{
            url: book.coverImage,
            title: `${book.title} - Book Cover`,
            caption: `${book.title} - Poetry book by Ajithkumar published in ${book.publishYear || 'recent years'}`
          }] : undefined
        };
      });

    // Archive routes for better organization
    const currentYear = new Date().getFullYear();
    const archiveRoutes = [];
    
    for (let year = 2020; year <= currentYear; year++) {
      archiveRoutes.push({
        url: `${baseUrl}/archive/${year}`,
        lastModified: new Date(`${year}-12-31`),
        changeFrequency: 'yearly',
        priority: 0.5
      });
    }

    // RSS feed routes
    const feedRoutes = [
      {
        url: `${baseUrl}/feed.xml`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8
      },
      {
        url: `${baseUrl}/blog/feed.xml`,
        lastModified: techBlogs[0]?.updatedAt ? new Date(techBlogs[0].updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7
      }
    ];

    // Combine all routes
    const allRoutes = [
      ...staticRoutes,
      ...categoryRoutes,
      ...tagRoutes,
      ...blogRoutes,
      ...writingRoutes,
      ...projectRoutes,
      ...bookRoutes,
      ...archiveRoutes,
      ...feedRoutes
    ];

    // Filter out any invalid URLs and ensure proper formatting
    return allRoutes.filter(route => {
      return route.url && 
             route.url.startsWith('https://') && 
             route.lastModified instanceof Date &&
             !isNaN(route.lastModified.getTime());
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return minimal sitemap if database fails
    const baseUrl = 'https://www.ajithkumarr.com';
    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/quill`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/devfolio`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/spotlight`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }
    ];
  }
}