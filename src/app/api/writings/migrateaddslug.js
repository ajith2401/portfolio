// scripts/migrate-add-slugs.js
// Run this script to add slugs to existing content
// Usage: node scripts/migrate-add-slugs.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
}

// Helper function to generate slug from title
function generateSlug(title, existingSlugs = new Set()) {
  if (!title) return null;
  
  let baseSlug = title
    .toLowerCase()
    .trim()
    // Handle common patterns
    .replace(/[^\w\s\u0B80-\u0BFF-]/g, '') // Remove special chars, keep Tamil
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  // Ensure slug is not empty
  if (!baseSlug) {
    baseSlug = 'untitled';
  }
  
  // Check for duplicates and append number if necessary
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
}

// TechBlog Schema
const TechBlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  metaDescription: String,
  category: String,
  tags: [String],
  status: String,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

// Writing Schema
const WritingSchema = new mongoose.Schema({
  title: String,
  slug: String,
  body: String,
  excerpt: String,
  metaDescription: String,
  category: String,
  tags: [String],
  status: String,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

// Project Schema
const ProjectSchema = new mongoose.Schema({
  title: String,
  slug: String,
  shortDescription: String,
  longDescription: String,
  metaDescription: String,
  category: String,
  technologies: [mongoose.Schema.Types.Mixed],
  status: String,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

// Book Schema
const BookSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  publishYear: Number,
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

// Models
const TechBlog = mongoose.model('TechBlog', TechBlogSchema);
const Writing = mongoose.model('Writing', WritingSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Book = mongoose.model('Book', BookSchema);

// Migration functions
async function migrateTechBlogs() {
  console.log('\n🔄 Migrating TechBlog collection...');
  
  try {
    const blogs = await TechBlog.find({}).select('_id title slug content excerpt').lean();
    console.log(`Found ${blogs.length} tech blogs`);
    
    if (blogs.length === 0) {
      console.log('No tech blogs to migrate');
      return { success: 0, skipped: 0, errors: 0 };
    }

    const existingSlugs = new Set();
    let success = 0, skipped = 0, errors = 0;

    for (const blog of blogs) {
      try {
        // Skip if slug already exists
        if (blog.slug) {
          existingSlugs.add(blog.slug);
          skipped++;
          continue;
        }

        const slug = generateSlug(blog.title, existingSlugs);
        
        if (!slug) {
          console.warn(`⚠️  Could not generate slug for blog: ${blog.title}`);
          errors++;
          continue;
        }

        // Generate meta description if content exists
        let metaDescription = '';
        if (blog.content) {
          const plainText = blog.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          metaDescription = plainText.substring(0, 155) + (plainText.length > 155 ? '...' : '');
        }

        // Generate excerpt if content exists
        let excerpt = blog.excerpt;
        if (!excerpt && blog.content) {
          const plainText = blog.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          excerpt = plainText.substring(0, 250) + (plainText.length > 250 ? '...' : '');
        }

        await TechBlog.updateOne(
          { _id: blog._id },
          { 
            $set: { 
              slug,
              ...(metaDescription && { metaDescription }),
              ...(excerpt && { excerpt })
            }
          }
        );

        console.log(`✅ Updated blog: "${blog.title}" -> slug: "${slug}"`);
        success++;

      } catch (error) {
        console.error(`❌ Error updating blog ${blog._id}:`, error.message);
        errors++;
      }
    }

    return { success, skipped, errors };
  } catch (error) {
    console.error('❌ Error in migrateTechBlogs:', error);
    return { success: 0, skipped: 0, errors: 1 };
  }
}

async function migrateWritings() {
  console.log('\n🔄 Migrating Writing collection...');
  
  try {
    const writings = await Writing.find({}).select('_id title slug body excerpt').lean();
    console.log(`Found ${writings.length} writings`);
    
    if (writings.length === 0) {
      console.log('No writings to migrate');
      return { success: 0, skipped: 0, errors: 0 };
    }

    const existingSlugs = new Set();
    let success = 0, skipped = 0, errors = 0;

    for (const writing of writings) {
      try {
        // Skip if slug already exists
        if (writing.slug) {
          existingSlugs.add(writing.slug);
          skipped++;
          continue;
        }

        const slug = generateSlug(writing.title, existingSlugs);
        
        if (!slug) {
          console.warn(`⚠️  Could not generate slug for writing: ${writing.title}`);
          errors++;
          continue;
        }

        // Generate meta description if body exists
        let metaDescription = '';
        if (writing.body) {
          const plainText = writing.body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          metaDescription = plainText.substring(0, 155) + (plainText.length > 155 ? '...' : '');
        }

        // Generate excerpt if body exists
        let excerpt = writing.excerpt;
        if (!excerpt && writing.body) {
          const plainText = writing.body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          excerpt = plainText.substring(0, 400) + (plainText.length > 400 ? '...' : '');
        }

        await Writing.updateOne(
          { _id: writing._id },
          { 
            $set: { 
              slug,
              ...(metaDescription && { metaDescription }),
              ...(excerpt && { excerpt })
            }
          }
        );

        console.log(`✅ Updated writing: "${writing.title}" -> slug: "${slug}"`);
        success++;

      } catch (error) {
        console.error(`❌ Error updating writing ${writing._id}:`, error.message);
        errors++;
      }
    }

    return { success, skipped, errors };
  } catch (error) {
    console.error('❌ Error in migrateWritings:', error);
    return { success: 0, skipped: 0, errors: 1 };
  }
}

async function migrateProjects() {
  console.log('\n🔄 Migrating Project collection...');
  
  try {
    const projects = await Project.find({}).select('_id title slug shortDescription').lean();
    console.log(`Found ${projects.length} projects`);
    
    if (projects.length === 0) {
      console.log('No projects to migrate');
      return { success: 0, skipped: 0, errors: 0 };
    }

    const existingSlugs = new Set();
    let success = 0, skipped = 0, errors = 0;

    for (const project of projects) {
      try {
        // Skip if slug already exists
        if (project.slug) {
          existingSlugs.add(project.slug);
          skipped++;
          continue;
        }

        const slug = generateSlug(project.title, existingSlugs);
        
        if (!slug) {
          console.warn(`⚠️  Could not generate slug for project: ${project.title}`);
          errors++;
          continue;
        }

        // Generate meta description from short description
        let metaDescription = '';
        if (project.shortDescription) {
          metaDescription = project.shortDescription.length > 160 
            ? project.shortDescription.substring(0, 157) + '...'
            : project.shortDescription;
        }

        await Project.updateOne(
          { _id: project._id },
          { 
            $set: { 
              slug,
              ...(metaDescription && { metaDescription })
            }
          }
        );

        console.log(`✅ Updated project: "${project.title}" -> slug: "${slug}"`);
        success++;

      } catch (error) {
        console.error(`❌ Error updating project ${project._id}:`, error.message);
        errors++;
      }
    }

    return { success, skipped, errors };
  } catch (error) {
    console.error('❌ Error in migrateProjects:', error);
    return { success: 0, skipped: 0, errors: 1 };
  }
}

async function migrateBooks() {
  console.log('\n🔄 Migrating Book collection...');
  
  try {
    const books = await Book.find({}).select('_id title slug').lean();
    console.log(`Found ${books.length} books`);
    
    if (books.length === 0) {
      console.log('No books to migrate');
      return { success: 0, skipped: 0, errors: 0 };
    }

    const existingSlugs = new Set();
    let success = 0, skipped = 0, errors = 0;

    for (const book of books) {
      try {
        // Skip if slug already exists
        if (book.slug) {
          existingSlugs.add(book.slug);
          skipped++;
          continue;
        }

        const slug = generateSlug(book.title, existingSlugs);
        
        if (!slug) {
          console.warn(`⚠️  Could not generate slug for book: ${book.title}`);
          errors++;
          continue;
        }

        await Book.updateOne(
          { _id: book._id },
          { $set: { slug } }
        );

        console.log(`✅ Updated book: "${book.title}" -> slug: "${slug}"`);
        success++;

      } catch (error) {
        console.error(`❌ Error updating book ${book._id}:`, error.message);
        errors++;
      }
    }

    return { success, skipped, errors };
  } catch (error) {
    console.error('❌ Error in migrateBooks:', error);
    return { success: 0, skipped: 0, errors: 1 };
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting slug migration for SEO optimization...\n');
  console.log('This script will add SEO-friendly slugs to your existing content.');
  console.log('Existing slugs will be preserved.\n');

  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Could not connect to database. Exiting...');
    process.exit(1);
  }

  try {
    const results = {
      techBlogs: await migrateTechBlogs(),
      writings: await migrateWritings(),
      projects: await migrateProjects(),
      books: await migrateBooks()
    };

    console.log('\n📊 Migration Summary:');
    console.log('====================');
    
    Object.entries(results).forEach(([collection, result]) => {
      console.log(`\n${collection}:`);
      console.log(`  ✅ Success: ${result.success}`);
      console.log(`  ⏭️  Skipped: ${result.skipped}`);
      console.log(`  ❌ Errors: ${result.errors}`);
    });

    const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
    const totalSkipped = Object.values(results).reduce((sum, r) => sum + r.skipped, 0);
    const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);

    console.log('\n🎯 Overall Results:');
    console.log(`  ✅ Total Success: ${totalSuccess}`);
    console.log(`  ⏭️  Total Skipped: ${totalSkipped}`);
    console.log(`  ❌ Total Errors: ${totalErrors}`);

    if (totalErrors === 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Deploy your updated code with the new middleware and routing');
      console.log('2. Update your sitemap in Google Search Console');
      console.log('3. Test the new SEO-friendly URLs');
      console.log('4. Monitor Google Search Console for indexing improvements');
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please review the error messages above.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed.');
  }
}

// Handle script execution
if (require.main === module) {
  runMigration().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  runMigration,
  generateSlug,
  migrateTechBlogs,
  migrateWritings,
  migrateProjects,
  migrateBooks
};