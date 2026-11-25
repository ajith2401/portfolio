// Runs only against a throwaway MongoDB: MONGODB_TEST_URI=mongodb://127.0.0.1:27018/some_test_db
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_TEST_URI;
const skip = !uri || !/^mongodb:\/\/(127\.0\.0\.1|localhost)[:/]/.test(uri) ? 'set MONGODB_TEST_URI to a LOCAL throwaway mongod' : false;
const POEM = { type: 'doc', content: [{ type: 'poem', attrs: { align: 'left' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'மழை' }, { type: 'hardBreak' }, { type: 'text', text: 'இரவு' }] }] }] };
const base = { category: 'poem', language: 'Tamil', status: 'draft' };

test('Writing model: structured content, slugs, legacy compatibility', { skip }, async (t) => {
  const { Writing } = await import('../src/models/writings.model.js');
  await mongoose.connect(uri);
  t.after(() => mongoose.disconnect());
  await Writing.deleteMany({});
  await Writing.syncIndexes();

  const a = await Writing.create({ ...base, title: 'மழை இரவு', contentFormat: 'tiptap', content: POEM });
  assert.equal(a.body, 'மழை\nஇரவு'); assert.equal(a.contentSchemaVersion, 1); assert.equal(a.content.content[0].attrs, undefined);
  assert.equal(a.slug, 'மழை-இரவு');
  a.title = 'வேறு'; await a.save(); assert.equal(a.slug, 'மழை-இரவு', 'title edit must not change URL');
  await assert.rejects(Writing.create({ ...base, title: 'bad', contentFormat: 'tiptap', content: { type: 'doc', content: [{ type: 'image', attrs: { src: 'javascript:alert(1)' } }] } }), /Invalid structured content/);
  await assert.rejects(Writing.create({ ...base, title: 'none', contentFormat: 'tiptap' }));
  const l = await Writing.create({ ...base, category: 'short story', title: 'பழைய கதை', body: '# தலைப்பு\n\nஉரை' });
  assert.equal(l.contentFormat, 'markdown'); assert.equal(l.content, undefined);
  await assert.rejects(Writing.create({ ...base, title: 'nobody' }));
  const d = await Writing.create({ ...base, title: 'மழை இரவு', contentFormat: 'tiptap', content: POEM });
  assert.equal(d.slug, 'மழை-இரவு-2');
  assert.ok((await Writing.find({ $text: { $search: 'இரவு' } })).length >= 1, 'Tamil text search');
  // Query-style writes must not bypass validation.
  const evil = { type: 'doc', content: [{ type: 'image', attrs: { src: 'javascript:alert(1)' } }] };
  await assert.rejects(Writing.findOneAndUpdate({ _id: a._id }, { $set: { contentFormat: 'tiptap', content: evil } }), /Invalid structured content/);
  await assert.rejects(Writing.updateOne({ _id: a._id }, { content: evil }), /Invalid structured content/);
  const upd = await Writing.findOneAndUpdate({ _id: a._id }, { content: POEM }, { new: true });
  assert.equal(upd.body, 'மழை\nஇரவு');
  await assert.rejects(Writing.insertMany([{ ...base, title: 'x', slug: 'x', contentFormat: 'tiptap', content: evil }]));
  await Writing.deleteMany({});
});
