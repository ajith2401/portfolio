// src/scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for sitemap generation');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Models (simplified versions just for sitemap generation)
const WritingSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  status: String,
  createdAt: Date,
  updatedAt: Date
});

const TechBlogSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  status: String,
  createdAt: Date,
  updatedAt: Date
});

const ProjectSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  status: String,
  createdAt: Date,
  updatedAt: Date
});

const BookSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date
});

// Register models only if they don't exist
let Writing, TechBlog, Project, Book;
try {
  Writing = mongoose.model('Writing');
} catch {
  Writing = mongoose.model('Writing', WritingSchema);
}

try {
  TechBlog = mongoose.model('TechBlog');
} catch {
  TechBlog = mongoose.model('TechBlog', TechBlogSchema);
}

try {
  Project = mongoose.model('Project');
} catch {
  Project = mongoose.model('Project', ProjectSchema);
}

try {
  Book = mongoose.model('Book');
} catch {
  Book = mongoose.model('Book', BookSchema);
}

// Format date for sitemap
const formatDate = (date) => {
  return date ? new Date(date).toISOString() : new Date().toISOString();
};

// Generates a complete sitemap
const generateSitemap = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('Could not connect to MongoDB. Exiting...');
    process.exit(1);
  }

  // Start sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: 'blog', priority: 0.9, changefreq: 'daily' },
    { url: 'quill', priority: 0.9, changefreq: 'daily' },
    { url: 'devfolio', priority: 0.9, changefreq: 'weekly' },
    { url: 'spotlight', priority: 0.9, changefreq: 'weekly' },
    { url: 'about', priority: 0.8, changefreq: 'monthly' },
    { url: 'privacy-policy', priority: 0.5, changefreq: 'yearly' },
    { url: 'terms-conditions', priority: 0.5, changefreq: 'yearly' },
    { url: 'unsubscribed', priority: 0.3, changefreq: 'yearly', noindex: true },
    { url: 'subscription-verified', priority: 0.3, changefreq: 'yearly', noindex: true }
  ];

  // Add static pages to sitemap
  for (const page of staticPages) {
    const robots = page.noindex ? '<meta name="robots" content="noindex,nofollow"/>' : '';
    sitemap += `  <url>
    <loc>https://www.ajithkumarr.com/${page.url}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${robots}
  </url>
`;
  }

  // Add dynamic blog posts
  try {
    const techBlogs = await TechBlog.find({ status: 'published' })
      .sort({ updatedAt: -1 })
      .lean();

    for (const blog of techBlogs) {
      sitemap += `  <url>
    <loc>https://www.ajithkumarr.com/blog/${blog._id}</loc>
    <lastmod>${formatDate(blog.updatedAt || blog.createdAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  } catch (error) {
    console.error('Error fetching tech blogs:', error);
  }

  // Add writings (quill)
  try {
    const writings = await Writing.find({ status: 'published' })
      .sort({ updatedAt: -1 })
      .lean();

    for (const writing of writings) {
      sitemap += `  <url>
    <loc>https://www.ajithkumarr.com/quill/${writing._id}</loc>
    <lastmod>${formatDate(writing.updatedAt || writing.createdAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  } catch (error) {
    console.error('Error fetching writings:', error);
  }

  // Add projects
  try {
    const projects = await Project.find({ status: 'published' })
      .sort({ updatedAt: -1 })
      .lean();

    for (const project of projects) {
      sitemap += `  <url>
    <loc>https://www.ajithkumarr.com/devfolio/${project._id}</loc>
    <lastmod>${formatDate(project.updatedAt || project.createdAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  // Add books
  try {
    const books = await Book.find()
      .sort({ updatedAt: -1 })
      .lean();

    for (const book of books) {
      sitemap += `  <url>
    <loc>https://www.ajithkumarr.com/spotlight/${book._id}</loc>
    <lastmod>${formatDate(book.updatedAt || book.createdAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  } catch (error) {
    console.error('Error fetching books:', error);
  }

  // Close sitemap XML
  sitemap += '</urlset>';

  // Create the public directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write the sitemap file
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');

  // Create robots.txt file
  const robotsTxt = `# www.robotstxt.org/
# Allows crawling of all content
User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.ajithkumarr.com/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('robots.txt generated successfully!');

  // Disconnect MongoDB
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};

// Execute the sitemap generation
generateSitemap()
  .catch(error => {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  });