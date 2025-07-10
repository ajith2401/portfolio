// scripts/create-mongodb-indexes.js
// Usage: node scripts/create-mongodb-indexes.js
// This script creates all recommended indexes for your main collections.

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your environment variables.');
  process.exit(1);
}

async function createIndexes() {
  await mongoose.connect(MONGODB_URI, {}); // No deprecated options
  const db = mongoose.connection.db;

  // Writings
  await db.collection('writings').createIndex({ slug: 1 }, { unique: true });
  await db.collection('writings').createIndex({ category: 1, publishedAt: -1 });
  await db.collection('writings').createIndex({ status: 1 });
  await db.collection('writings').createIndex(
		{ title: 'text', body: 'text', category: 'text' },
		{
			default_language: 'english',
			language_override: 'language_override',
		}
	);
  console.log('Indexes created for writings');

  // TechBlogs
  await db.collection('techblogs').createIndex({ slug: 1 }, { unique: true });
  await db.collection('techblogs').createIndex({ category: 1, publishedAt: -1 });
  await db.collection('techblogs').createIndex({ status: 1 });
  await db.collection('techblogs').createIndex({ title: 'text', content: 'text', category: 'text' });
  console.log('Indexes created for techblogs');

  // Projects
  await db.collection('projects').createIndex({ slug: 1 }, { unique: true });
  await db.collection('projects').createIndex({ category: 1, publishedAt: -1 });
  await db.collection('projects').createIndex({ status: 1 });
  await db.collection('projects').createIndex({ title: 'text', shortDescription: 'text', longDescription: 'text', category: 'text' });
  console.log('Indexes created for projects');

  // Books
  await db.collection('books').createIndex({ slug: 1 }, { unique: true });
  await db.collection('books').createIndex({ category: 1, publishedAt: -1 });
  await db.collection('books').createIndex({ status: 1 });
  await db.collection('books').createIndex(
		{ title: 'text', description: 'text' },
		{
			default_language: 'english',
			language_override: 'language_override',
		}
	);
  console.log('Indexes created for books');

  await mongoose.disconnect();
  console.log('All indexes created and DB connection closed.');
}

createIndexes().catch((err) => {
  console.error('Error creating indexes:', err);
  process.exit(1);
}); 