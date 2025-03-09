import connectDB from "@/lib/db";
import { TechBlog, Writing, Project, Book } from "@/models";

export default async function sitemap() {
  await connectDB();
  
  // Fetch all published tech blogs
  const techBlogs = await TechBlog.find({ status: 'published' })
    .select('_id title updatedAt createdAt')
    .sort({ createdAt: -1 })
    .lean();
  
  // Fetch all published writings
  const writings = await Writing.find({ status: 'published' })
    .select('_id title updatedAt createdAt')
    .sort({ createdAt: -1 })
    .lean();
  
  // Fetch all published projects
  const projects = await Project.find({ status: 'published' })
    .select('_id title slug updatedAt createdAt')
    .sort({ createdAt: -1 })
    .lean();

      // Fetch all published projects
      const books = await Book.find({})
      .select('_id title coverImage publisher publishYear price')
      .sort({ createdAt: -1 })
      .lean();
  
  const baseUrl = 'https://www.ajithkumarr.com';
  
  // Define static routes
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/devfolio`,
      lastModified: new Date(projects[0]?.updatedAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(techBlogs[0]?.updatedAt || new Date()),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quill`,
      lastModified: new Date(writings[0]?.updatedAt || new Date()),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/spotlight`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
  
  // Blog routes
  const blogRoutes = techBlogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog._id}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  // Writing routes
  const writingRoutes = writings.map((writing) => ({
    url: `${baseUrl}/quill/${writing._id}`,
    lastModified: new Date(writing.updatedAt || writing.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  // Project routes
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/devfolio/${project._id}`,
    lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // book routes
  const bookRoutes = books.map((book) => ({
    url: `${baseUrl}/spotlight/${book._id}`,
    lastModified: new Date(book.updatedAt || book.createdAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
    
  
  // Combine all routes
  return [...staticRoutes, ...blogRoutes, ...writingRoutes, ...projectRoutes,...bookRoutes];
}