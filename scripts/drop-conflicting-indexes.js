// scripts/drop-conflicting-indexes.js
// Usage: node scripts/drop-conflicting-indexes.js
// This script drops old, conflicting text indexes from ALL relevant collections.
// Run this BEFORE the create script.

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your environment variables.');
  process.exit(1);
}

// List of collections and the old index names to drop
const indexesToDrop = [
  { collectionName: 'writings', indexName: 'title_text_body_text' },
  { collectionName: 'techblogs', indexName: 'title_text_content_text' },
  {
    collectionName: 'projects',
    indexName:
      'title_text_shortDescription_text_longDescription_text_tags_text_technologies.name_text',
  },
  {
    collectionName: 'writings',
    indexName: 'title_text_body_text_category_text',
  },
  {
    collectionName: 'books',
    indexName: 'title_text_description_text',
  },
  // Add other collections here if they also have conflicting indexes
];

async function dropAllConflictingIndexes() {
  try {
    await mongoose.connect(MONGODB_URI, {});
    const db = mongoose.connection.db;

    for (const { collectionName, indexName } of indexesToDrop) {
      console.log(`\nAttempting to drop conflicting index '${indexName}' from '${collectionName}' collection...`);
      const collection = db.collection(collectionName);
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Successfully dropped the index from '${collectionName}'.`);
      } catch (err) {
        if (err.codeName === 'IndexNotFound') {
          console.log(`✅ Index '${indexName}' was not found in '${collectionName}' (it might have been deleted already).`);
        } else {
          // Re-throw other errors
          throw err;
        }
      }
    }

  } catch (err) {
    console.error("❌ An error occurred while trying to drop indexes:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB.");
  }
}

dropAllConflictingIndexes(); 