// Seeds synthetic writings into the LOCAL test database for smoke tests. Refuses any non-local URI.
// Usage: MONGODB_URI=mongodb://127.0.0.1:27018/portfolio_test node scripts/seed-smoke-writings.mjs [--clean]
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || '';
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost)[:/]/.test(uri) || !/test/.test(uri)) {
  console.error('Refusing: MONGODB_URI must be a local *test* database.');
  process.exit(1);
}
await mongoose.connect(uri);
const col = mongoose.connection.db.collection('writings');
const TAG = 'smoke-seed';
await col.deleteMany({ tags: TAG });
if (process.argv.includes('--clean')) { console.log('cleaned'); await mongoose.disconnect(); process.exit(0); }

const t = (text) => ({ type: 'text', text });
const br = { type: 'hardBreak' };
const lines = (...ls) => ls.flatMap((l, i) => (i ? [br, t(l)] : [t(l)]));
const para = (...c) => ({ type: 'paragraph', content: c });
const doc = (...content) => ({ type: 'doc', content });
const poem = (...stanzas) => ({ type: 'poem', content: stanzas });
const now = new Date('2026-01-10T00:00:00Z');
const base = (o) => ({
  language: 'Tamil', status: 'published', tags: [TAG], images: {}, publishedAt: now, createdAt: now,
  updatedAt: new Date('2026-02-01T00:00:00Z'), slugHistory: [], wordCount: 0, readTime: 1,
  ratings: [{ name: 'Hidden Rater', email: 'private-rater@example.test', rating: 5, comment: 'x' }],
  revisions: [{ title: 'OLD-REVISION-MARKER', body: 'OLD-REVISION-BODY', savedAt: now }],
  ...o,
});
const longMd = ['# மழை', 'வானம் அழுதது,\nமண் சிரித்தது.', '## இரவு', 'நிலவு **ஒளிர்ந்தது**. [தளம்](https://example.test) <script>alert(1)</script>', '### முடிவு', 'கதை முடிந்தது.'].join('\n\n');
const docs = [
  base({ title: 'மழை நாள்', slug: 'மழை-நாள்', category: 'story', contentFormat: 'markdown', body: longMd, excerpt: 'ஒரு மழை நாள் கதை' }),
  base({ title: 'தமிழ் கதை', slug: 'தமிழ்-கதை', category: 'story', contentFormat: 'tiptap', contentSchemaVersion: 1,
    content: doc({ type: 'heading', attrs: { level: 1 }, content: [t('தொடக்கம்')] }, para(t('ஒரு ஊரில் ஒரு மனிதன் இருந்தான்.')), { type: 'heading', attrs: { level: 2 }, content: [t('நடுவில்')] }, para(t('பின்பு மழை பெய்தது.')), { type: 'heading', attrs: { level: 2 }, content: [t('முடிவு')] }, para(t('கதை முடிந்தது.'))),
    body: 'தொடக்கம்\n\nஒரு ஊரில் ஒரு மனிதன் இருந்தான்.', excerpt: 'ஒரு கதை' }),
  base({ title: 'நிலா கவிதை', slug: 'நிலா-கவிதை', category: 'poem', contentFormat: 'tiptap', contentSchemaVersion: 1,
    content: doc(poem(para(...lines('வானம் அழுதது,', 'மண் சிரித்தது!')), para(...lines('நிலவு ஒளிர்ந்தது?', 'இரவு நீண்டது…')), para(...lines('காற்று வீசியது', 'கனவு கலைந்தது')))),
    body: 'வானம் அழுதது,\nமண் சிரித்தது!' }),
  base({ title: 'இரு வரி', slug: 'இரு-வரி', category: 'poem', contentFormat: 'tiptap', contentSchemaVersion: 1,
    content: doc(poem(para(...lines('ஒரு வரி', 'இரு வரி')))), body: 'ஒரு வரி\nஇரு வரி' }),
  base({ title: 'வரைவு எழுத்து', slug: 'வரைவு-எழுத்து', status: 'draft', category: 'story', contentFormat: 'markdown', body: 'DRAFT-BODY-MARKER' }),
  base({ title: 'புதிய தலைப்பு', slug: 'புதிய-தலைப்பு', category: 'story', contentFormat: 'markdown', body: 'புதிய உள்ளடக்கம்\n\nஇரண்டாம் பத்தி', slugHistory: [{ slug: 'பழைய-தலைப்பு', changedAt: now }] }),
];
const res = await col.insertMany(docs);
console.log(JSON.stringify({ inserted: res.insertedCount, ids: Object.values(res.insertedIds).map(String) }));
await mongoose.disconnect();
