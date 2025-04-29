// src/app/sitemap.js
import connectDB from "@/lib/db";
import { TechBlog, Writing, Project, Book } from "@/models";

export default async function sitemap() {
  await connectDB();
  
  // Fetch all published tech blogs with needed fields
  const techBlogs = await TechBlog.find({ status: 'published' })
    .select('_id title updatedAt createdAt category tags images')
    .sort({ createdAt: -1 })
    .lean();
  
  // Fetch all published writings with needed fields
  const writings = await Writing.find({ status: 'published' })
    .select('_id title updatedAt createdAt category images')
    .sort({ createdAt: -1 })
    .lean();
  
  // Fetch all published projects with needed fields
  const projects = await Project.find({ status: 'published' })
    .select('_id title slug updatedAt createdAt category technologies images')
    .sort({ createdAt: -1 })
    .lean();

  // Fetch all published books with needed fields
  const books = await Book.find({})
    .select('_id title coverImage publisher publishYear updatedAt createdAt')
    .sort({ createdAt: -1 })
    .lean();
  
  const baseUrl = 'https://www.ajithkumarr.com';
  
  // Define static routes with improved metadata
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      // Add additional metadata for Google Search
      alternates: {
        languages: {
          'en-US': `${baseUrl}/`,
          'ta-IN': `${baseUrl}/ta/`
        }
      }
    },
    {
      url: `${baseUrl}/devfolio`,
      lastModified: new Date(projects[0]?.updatedAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'en-US': `${baseUrl}/devfolio`,
          'ta-IN': `${baseUrl}/ta/devfolio`
        }
      }
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(techBlogs[0]?.updatedAt || new Date()),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          'en-US': `${baseUrl}/blog`,
          'ta-IN': `${baseUrl}/ta/blog`
        }
      }
    },
    {
      url: `${baseUrl}/quill`,
      lastModified: new Date(writings[0]?.updatedAt || new Date()),
      changeFrequency: 'daily',
      priority: 0.95, // Increased since this is core content as a writer
      alternates: {
        languages: {
          'en-US': `${baseUrl}/quill`,
          'ta-IN': `${baseUrl}/ta/quill`
        }
      }
    },
    {
      url: `${baseUrl}/spotlight`,
      lastModified: new Date(books[0]?.updatedAt || books[0]?.createdAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.9, // Increased since books are important for a writer
      alternates: {
        languages: {
          'en-US': `${baseUrl}/spotlight`,
          'ta-IN': `${baseUrl}/ta/spotlight`
        }
      }
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // Increased since it contains author info
      alternates: {
        languages: {
          'en-US': `${baseUrl}/about`,
          'ta-IN': `${baseUrl}/ta/about`
        }
      }
    },
    // Add legal pages for completeness
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    }
  ];
  
  // Extract unique categories from content for category pages
  const extractCategories = () => {
    const categories = new Set();
    
    // Extract from tech blogs
    techBlogs.forEach(blog => {
      if (blog.category) categories.add(blog.category);
    });
    
    // Extract from writings
    writings.forEach(writing => {
      if (writing.category) categories.add(writing.category);
    });
    
    return Array.from(categories);
  };
  
  // Extract unique tags from content for tag pages
  const extractTags = () => {
    const tags = new Set();
    
    // Extract from tech blogs
    techBlogs.forEach(blog => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => tags.add(tag));
      }
    });
    
    return Array.from(tags);
  };
  
  // Create category routes
  const categoryRoutes = extractCategories().map(category => ({
    url: `${baseUrl}/category/${encodeURIComponent(category.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));
  
  // Create tag routes
  const tagRoutes = extractTags().map(tag => ({
    url: `${baseUrl}/tag/${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6
  }));
  
  // Blog routes with enhanced metadata and image sitemaps
  const blogRoutes = techBlogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog._id}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
    // Add images for image sitemaps
    images: blog.images ? [
      {
        url: blog.images.large || blog.images.medium || blog.images.small,
        title: blog.title,
        alt: blog.title
      }
    ] : undefined
  }));
  
  // Writing routes with enhanced metadata and image sitemaps
  const writingRoutes = writings.map((writing) => ({
    url: `${baseUrl}/quill/${writing._id}`,
    lastModified: new Date(writing.updatedAt || writing.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.85, // Higher priority for writings as an author
    // Add images for image sitemaps
    images: writing.images ? [
      {
        url: writing.images.large || writing.images.medium || writing.images.small,
        title: writing.title,
        alt: writing.title
      }
    ] : undefined
  }));
  
  // Project routes with enhanced metadata and image sitemaps
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/devfolio/${project._id}`,
    lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.75,
    // Add images for image sitemaps
    images: project.images ? [
      {
        url: project.images.large || project.images.medium || project.images.small,
        title: project.title,
        alt: project.title
      }
    ] : undefined
  }));

  // Book routes with enhanced metadata and image sitemaps
  const bookRoutes = books.map((book) => ({
    url: `${baseUrl}/spotlight/${book._id}`,
    lastModified: new Date(book.updatedAt || book.createdAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.85, // Higher priority for books as an author
    // Add images for image sitemaps
    images: book.coverImage ? [
      {
        url: book.coverImage,
        title: book.title,
        alt: `${book.title} - book by Ajithkumar`
      }
    ] : undefined
  }));
  
  // Archive routes for years
  const currentYear = new Date().getFullYear();
  const archiveRoutes = [];
  
  for (let year = 2020; year <= currentYear; year++) {
    archiveRoutes.push({
      url: `${baseUrl}/archive/${year}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5
    });
  }
  
  // Combine all routes
  return [
    ...staticRoutes, 
    ...categoryRoutes,
    ...tagRoutes,
    ...blogRoutes, 
    ...writingRoutes, 
    ...projectRoutes,
    ...bookRoutes,
    ...archiveRoutes
  ];
}