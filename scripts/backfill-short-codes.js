// scripts/backfill-short-codes.js
// Backfills shortCode onto every existing TechBlog, Writing, Book, and Project
// document that doesn't already have one.
// Usage: node scripts/backfill-short-codes.js

const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_LENGTH = 6;

function generateShortCode(length = DEFAULT_LENGTH) {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

const COLLECTIONS = ['techblogs', 'writings', 'books', 'projects'];

async function codeExistsAnywhere(db, code) {
  for (const coll of COLLECTIONS) {
    const hit = await db.collection(coll).findOne({ shortCode: code }, { projection: { _id: 1 } });
    if (hit) return true;
  }
  return false;
}

async function generateUnique(db) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateShortCode(DEFAULT_LENGTH + Math.floor(attempt / 3));
    if (!(await codeExistsAnywhere(db, code))) return code;
  }
  return generateShortCode(DEFAULT_LENGTH + 4);
}

async function backfillCollection(db, collectionName) {
  const coll = db.collection(collectionName);
  const cursor = coll.find(
    { $or: [{ shortCode: { $exists: false } }, { shortCode: null }, { shortCode: '' }] },
    { projection: { _id: 1 } }
  );
  let updated = 0;
  let skipped = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const code = await generateUnique(db);
    try {
      await coll.updateOne({ _id: doc._id }, { $set: { shortCode: code } });
      updated++;
    } catch (err) {
      if (err && err.code === 11000) {
        skipped++;
        console.warn(`  duplicate for ${collectionName}/${doc._id}, retrying on next run`);
      } else {
        throw err;
      }
    }
  }
  console.log(`  ${collectionName}: updated ${updated}, skipped ${skipped}`);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  const db = mongoose.connection.db;

  console.log('\nEnsuring unique sparse index on shortCode for each collection...');
  for (const coll of COLLECTIONS) {
    try {
      await db.collection(coll).createIndex({ shortCode: 1 }, { unique: true, sparse: true });
      console.log(`  ${coll}: index ok`);
    } catch (err) {
      console.warn(`  ${coll}: ${err.message}`);
    }
  }

  console.log('\nBackfilling shortCodes...');
  for (const coll of COLLECTIONS) {
    await backfillCollection(db, coll);
  }

  await mongoose.disconnect();
  console.log('\n✅ Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
