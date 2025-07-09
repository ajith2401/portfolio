// src/app/sitemap.js
import { TechBlog, Writing, Project, Book } from '@/models';
import connectDB from '@/lib/db';

export default async function sitemap() {
  try {
    // Connect to database
    await connectDB();
    
    const baseUrl = 'https://www.ajithkumarr.com';
    const currentDate = new Date();
    
    // Fetch all published content with slugs only
    const [techBlogs, writings, projects, books] = await Promise.all([
      TechBlog.find({ 
        status: 'published',
        slug: { $exists: true, $ne: null, $ne: '' },
        title: { $exists: true, $ne: null, $ne: '' }
      })
        .select('slug title updatedAt publishedAt createdAt images')
        .sort({ publishedAt: -1 })
        .lean(),
        
      Writing.find({ 
        status: 'published',
        slug: { $exists: true, $ne: null, $ne: '' },
        title: { $exists: true, $ne: null, $ne: '' }
      })
        .select('slug title updatedAt publishedAt createdAt images')
        .sort({ publishedAt: -1 })
        .lean(),
        
      Project.find({ 
        status: 'published',
        slug: { $exists: true, $ne: null, $ne: '' },
        title: { $exists: true, $ne: null, $ne: '' }
      })
        .select('slug title updatedAt publishedAt createdAt images')
        .sort({ publishedAt: -1 })
        .lean(),
        
      Book.find({ 
        slug: { $exists: true, $ne: null, $ne: '' },
        title: { $exists: true, $ne: null, $ne: '' }
      })
        .select('slug title updatedAt createdAt publishYear coverImage')
        .sort({ publishYear: -1 })
        .lean()
    ]);

    console.log(`[SITEMAP] Generated with ${techBlogs.length} blogs, ${writings.length} writings, ${projects.length} projects, ${books.length} books`);

    // Helper to get the most recent date
    const getMostRecentDate = (item) => {
      const dates = [
        item.updatedAt,
        item.publishedAt,
        item.createdAt
      ].filter(Boolean);
      
      return dates.length > 0 ? new Date(Math.max(...dates.map(d => new Date(d)))) : currentDate;
    };

    // Static pages (highest priority)
    const staticPages = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/about`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.9
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: techBlogs.length > 0 ? getMostRecentDate(techBlogs[0]) : currentDate,
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/quill`,
        lastModified: writings.length > 0 ? getMostRecentDate(writings[0]) : currentDate,
        changeFrequency: 'daily',
        priority: 0.95 // Higher priority for main writing section
      },
      {
        url: `${baseUrl}/devfolio`,
        lastModified: projects.length > 0 ? getMostRecentDate(projects[0]) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/spotlight`,
        lastModified: books.length > 0 ? getMostRecentDate(books[0]) : currentDate,
        changeFrequency: 'monthly',
        priority: 0.9 // High priority for published books
      }
    ];

    // Tech blog routes
    const techBlogRoutes = techBlogs
      .filter(blog => blog.slug && blog.title.trim().length > 0)
      .map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: getMostRecentDate(blog),
        changeFrequency: 'weekly',
        priority: 0.8,
        // Add image information for Google Images
        images: blog.images?.large ? [{
          url: blog.images.large,
          title: blog.title,
          caption: `${blog.title} - Technical blog post by Ajithkumar`
        }] : undefined
      }));

    // Writing routes - higher priority as you're primarily a writer
    const writingRoutes = writings
      .filter(writing => writing.slug && writing.title.trim().length > 0)
      .map((writing) => ({
        url: `${baseUrl}/quill/${writing.slug}`,
        lastModified: getMostRecentDate(writing),
        changeFrequency: 'weekly',
        priority: 0.85, // Higher priority for writings
        images: writing.images?.large ? [{
          url: writing.images.large,
          title: writing.title,
          caption: `${writing.title} - Tamil writing by Ajithkumar`
        }] : undefined
      }));

    // Project routes
    const projectRoutes = projects
      .filter(project => project.slug && project.title.trim().length > 0)
      .map((project) => ({
        url: `${baseUrl}/devfolio/${project.slug}`,
        lastModified: getMostRecentDate(project),
        changeFrequency: 'monthly',
        priority: 0.75,
        images: project.images?.featured ? [{
          url: project.images.featured,
          title: project.title,
          caption: `${project.title} - Project by Ajithkumar`
        }] : undefined
      }));

    // Book routes - highest priority for author credibility
    const bookRoutes = books
      .filter(book => book.slug && book.title.trim().length > 0)
      .map((book) => ({
        url: `${baseUrl}/spotlight/${book.slug}`,
        lastModified: getMostRecentDate(book),
        changeFrequency: 'yearly',
        priority: 0.9, // Highest priority for published books
        images: book.coverImage ? [{
          url: book.coverImage.startsWith('http') ? book.coverImage : `${baseUrl}/images/books/${book.coverImage}`,
          title: book.title,
          caption: `${book.title} - Book by Ajithkumar R`
        }] : undefined
      }));

    // Additional important pages
    const additionalPages = [
      {
        url: `${baseUrl}/photography`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: currentDate,
        changeFrequency: 'yearly',
        priority: 0.3
      },
      {
        url: `${baseUrl}/terms-conditions`,
        lastModified: currentDate,
        changeFrequency: 'yearly',
        priority: 0.3
      }
    ];

    // Combine all routes
    const allRoutes = [
      ...staticPages,
      ...writingRoutes,  // Writings first for higher priority
      ...bookRoutes,     // Books second
      ...techBlogRoutes, // Tech blogs third
      ...projectRoutes,  // Projects fourth
      ...additionalPages
    ];

    // Log sitemap generation stats
    console.log(`[SITEMAP] Generated sitemap with ${allRoutes.length} total URLs:`);
    console.log(`  - Static pages: ${staticPages.length}`);
    console.log(`  - Writings: ${writingRoutes.length}`);
    console.log(`  - Books: ${bookRoutes.length}`);
    console.log(`  - Tech blogs: ${techBlogRoutes.length}`);
    console.log(`  - Projects: ${projectRoutes.length}`);
    console.log(`  - Additional: ${additionalPages.length}`);

    return allRoutes;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap if there's an error
    const baseUrl = 'https://www.ajithkumarr.com';
    const currentDate = new Date();
    
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/quill`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.95
      },
      {
        url: `${baseUrl}/devfolio`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/spotlight`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.9
      }
    ];
  }
}

// Export dynamic sitemap configuration
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Regenerate every hour