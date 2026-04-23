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
const COLLECTIONS = ['techblogs', 'writings', 'books', 'projects'];
const BATCH_SIZE = 50;

function generateShortCode(length = DEFAULT_LENGTH) {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

function nextUnique(used, attempt = 0) {
  for (let i = 0; i < 20; i++) {
    const code = generateShortCode(DEFAULT_LENGTH + Math.floor((attempt + i) / 3));
    if (!used.has(code)) return code;
  }
  return generateShortCode(DEFAULT_LENGTH + 4);
}

async function loadExistingCodes(db) {
  const used = new Set();
  for (const coll of COLLECTIONS) {
    const docs = await db.collection(coll)
      .find({ shortCode: { $exists: true, $ne: null, $ne: '' } }, { projection: { shortCode: 1 } })
      .toArray();
    for (const d of docs) if (d.shortCode) used.add(d.shortCode);
    console.log(`  preloaded ${docs.length} existing codes from ${coll}`);
  }
  return used;
}

async function backfillCollection(db, collectionName, used) {
  const coll = db.collection(collectionName);
  const docs = await coll
    .find(
      { $or: [{ shortCode: { $exists: false } }, { shortCode: null }, { shortCode: '' }] },
      { projection: { _id: 1 } }
    )
    .toArray();

  if (docs.length === 0) {
    console.log(`  ${collectionName}: nothing to backfill`);
    return;
  }

  let updated = 0;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    const ops = batch.map((doc) => {
      const code = nextUnique(used);
      used.add(code);
      return {
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { shortCode: code } },
        },
      };
    });
    const result = await coll.bulkWrite(ops, { ordered: false });
    updated += result.modifiedCount || 0;
    process.stdout.write(`  ${collectionName}: ${updated}/${docs.length}\r`);
  }
  process.stdout.write('\n');
  console.log(`  ${collectionName}: updated ${updated}`);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('connected');
  const db = mongoose.connection.db;

  console.log('\nensuring unique sparse index on shortCode...');
  for (const coll of COLLECTIONS) {
    try {
      await db.collection(coll).createIndex({ shortCode: 1 }, { unique: true, sparse: true });
      console.log(`  ${coll}: index ok`);
    } catch (err) {
      console.warn(`  ${coll}: ${err.message}`);
    }
  }

  console.log('\npreloading existing shortCodes...');
  const used = await loadExistingCodes(db);
  console.log(`  total in-use codes: ${used.size}`);

  console.log('\nbackfilling...');
  for (const coll of COLLECTIONS) {
    await backfillCollection(db, coll, used);
  }

  await mongoose.disconnect();
  console.log('\ndone');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
