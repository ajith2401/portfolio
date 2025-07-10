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
    await mongoose.connect(process.env.MONGODB_URI);
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
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
  
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

// Define schemas for migration
const WritingSchema = new mongoose.Schema({
  title: String,
  slug: String,
  body: String,
  excerpt: String,
  status: String,
  publishedAt: Date
}, { timestamps: true });

const TechBlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  status: String,
  publishedAt: Date
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: String,
  slug: String,
  shortDescription: String,
  longDescription: String,
  status: String,
  publishedAt: Date
}, { timestamps: true });

const BookSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  publishYear: Number,
  status: String
}, { timestamps: true });

// Models
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

// Known problematic ObjectIds from Search Console
const PROBLEMATIC_WRITINGS = [
  '674617c2a56c8f57d03659b4',
  '674617c4a56c8f57d03665fe6',
  '674617c1a56c8f57d03657aa',
  '674617c1a56c8f57d03657da',
  '674617c5a56c8f57d03662a1',
  '674617c0a56c8f57d036614d',
  '674617c1a56c8f57d0365675',
  '674617c5a56c8f57d0366132',
  '674617c0a56c8f57d036588a',
  '674617c0a56c8f57d03655f3'
];

// Migrate a specific collection
async function migrateCollection(Model, collectionName) {
  console.log(`\n🔄 Processing ${collectionName}...`);
  console.log('=' .repeat(50));
  
  try {
    // Find all documents without slugs
    const documents = await Model.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ],
      title: { $exists: true, $ne: '', $ne: null }
    }).sort({ createdAt: 1 });
    
    if (documents.length === 0) {
      console.log(`✅ No ${collectionName} need slug migration`);
      return { success: 0, errors: 0, skipped: 0 };
    }
    
    console.log(`📊 Found ${documents.length} ${collectionName} without slugs`);
    
    // Collect existing slugs to ensure uniqueness
    const existingSlugs = new Set();
    const docsWithSlugs = await Model.find({ slug: { $exists: true, $ne: null, $ne: '' } }, 'slug');
    docsWithSlugs.forEach(doc => {
      if (doc.slug) existingSlugs.add(doc.slug);
    });
    
    let success = 0;
    let errors = 0;
    let skipped = 0;
    
    for (const doc of documents) {
      try {
        // Skip if no title
        if (!doc.title || doc.title.trim() === '') {
          console.log(`⚠️  Skipping ${doc._id}: No title`);
          skipped++;
          continue;
        }
        
        // Generate unique slug
        const slug = generateSlug(doc.title, existingSlugs);
        
        if (!slug) {
          console.log(`⚠️  Skipping ${doc._id}: Could not generate slug from "${doc.title}"`);
          skipped++;
          continue;
        }
        
        // Update document
        await Model.updateOne(
          { _id: doc._id },
          { 
            $set: { 
              slug: slug,
              lastModified: new Date()
            }
          }
        );
        
        console.log(`✅ ${doc.title.substring(0, 50)}${doc.title.length > 50 ? '...' : ''}`);
        console.log(`   📍 ObjectId: ${doc._id}`);
        console.log(`   🔗 New slug: ${slug}`);
        console.log(`   🌐 New URL: /${collectionName.toLowerCase() === 'techblog' ? 'blog' : 
                                      collectionName.toLowerCase() === 'writing' ? 'quill' : 
                                      collectionName.toLowerCase() === 'project' ? 'devfolio' : 'spotlight'}/${slug}`);
        
        // Mark problematic writings specifically
        if (collectionName === 'Writing' && PROBLEMATIC_WRITINGS.includes(doc._id.toString())) {
          console.log(`   🔥 FIXED PROBLEMATIC URL!`);
        }
        
        console.log('');
        success++;
        
      } catch (error) {
        console.error(`❌ Error processing ${doc._id}: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`📈 ${collectionName} Migration Summary:`);
    console.log(`   ✅ Success: ${success}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    
    return { success, errors, skipped };
    
  } catch (error) {
    console.error(`❌ Error migrating ${collectionName}:`, error);
    return { success: 0, errors: 1, skipped: 0 };
  }
}

// Generate final report
function generateReport(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION COMPLETE - FINAL REPORT');
  console.log('='.repeat(60));
  
  let totalSuccess = 0;
  let totalErrors = 0;
  let totalSkipped = 0;
  
  Object.entries(results).forEach(([collection, stats]) => {
    console.log(`\n📝 ${collection}:`);
    console.log(`   ✅ Migrated: ${stats.success}`);
    console.log(`   ❌ Errors: ${stats.errors}`);
    console.log(`   ⚠️  Skipped: ${stats.skipped}`);
    
    totalSuccess += stats.success;
    totalErrors += stats.errors;
    totalSkipped += stats.skipped;
  });
  
  console.log(`\n📊 TOTALS:`);
  console.log(`   ✅ Total Migrated: ${totalSuccess}`);
  console.log(`   ❌ Total Errors: ${totalErrors}`);
  console.log(`   ⚠️  Total Skipped: ${totalSkipped}`);
  
  if (totalSuccess > 0) {
    console.log('\n🎉 SUCCESS! Your content now has SEO-friendly URLs!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Update your card components to use slug instead of _id');
    console.log('2. Deploy the updated code');
    console.log('3. Test the new slug URLs');
    console.log('4. Submit updated sitemap to Google Search Console');
    
    console.log('\n🔗 PROBLEMATIC URLS NOW FIXED:');
    PROBLEMATIC_WRITINGS.forEach(id => {
      console.log(`   ❌ OLD: https://www.ajithkumarr.com/quill/${id}`);
      console.log(`   ✅ NEW: Will use slug URL now`);
    });
  }
  
  if (totalErrors > 0) {
    console.log(`\n⚠️  Warning: ${totalErrors} items had errors. Check the logs above.`);
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting SEO Slug Migration...');
  console.log('This will add SEO-friendly slugs to your existing content');
  console.log('='.repeat(60));
  
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Could not connect to database. Exiting...');
    process.exit(1);
  }
  
  try {
    const results = {};
    
    // Migrate each collection
    results.Writing = await migrateCollection(Writing, 'Writing');
    results.TechBlog = await migrateCollection(TechBlog, 'TechBlog');
    results.Project = await migrateCollection(Project, 'Project');
    results.Book = await migrateCollection(Book, 'Book');
    
    // Generate final report
    generateReport(results);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed.');
    console.log('Migration completed successfully! 🎉');
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigration().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { runMigration, generateSlug };