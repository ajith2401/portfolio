import test from 'node:test';
import assert from 'node:assert/strict';
import { poemPreview } from '../src/lib/public/poem-preview.js';

const t = (text) => ({ type: 'text', text });
const br = { type: 'hardBreak' };
const doc = (...c) => ({ type: 'doc', content: c });
const para = (...c) => ({ type: 'paragraph', content: c });
const poemDoc = (stanzas) => ({
  category: 'poem', contentFormat: 'tiptap',
  content: doc({ type: 'poem', content: stanzas.map((lines) => para(...lines.flatMap((l, i) => (i ? [br, t(l)] : [t(l)])))) }),
});

test('structured: first stanza only, line breaks kept, more=true when later stanzas exist', () => {
  const p = poemPreview(poemDoc([['வரி 1', 'வரி 2', 'வரி 3'], ['இரண்டாம்', 'பகுதி']]));
  assert.deepEqual(p, { lines: ['வரி 1', 'வரி 2', 'வரி 3'], more: true });
});
test('structured: caps at 4 lines and flags more', () => {
  const p = poemPreview(poemDoc([['1', '2', '3', '4', '5', '6']]));
  assert.deepEqual(p.lines, ['1', '2', '3', '4']); assert.equal(p.more, true);
});
test('short single-stanza poem: whole poem, no ellipsis flag', () => {
  assert.deepEqual(poemPreview(poemDoc([['ஒன்று', 'இரண்டு']])), { lines: ['ஒன்று', 'இரண்டு'], more: false });
});
test('markdown body: lines and stanzas, markup stripped', () => {
  const p = poemPreview({ category: 'poem', contentFormat: 'markdown', body: '# தலைப்பு\n\nமழை **பெய்தது**\nமண் [மணந்தது](http://x.test)\n\nஅடுத்த பகுதி' });
  assert.equal(p.lines.join('|'), 'தலைப்பு'); // heading is its own stanza here
  const q = poemPreview({ category: 'poem', contentFormat: 'markdown', body: 'மழை **பெய்தது**\nமண் [மணந்தது](http://x.test)\n\nஅடுத்த பகுதி' });
  assert.deepEqual(q, { lines: ['மழை பெய்தது', 'மண் மணந்தது'], more: true });
});
test('non-poems and empty content give null', () => {
  assert.equal(poemPreview({ ...poemDoc([['a']]), category: 'short story' }), null);
  assert.equal(poemPreview({ category: 'poem', contentFormat: 'markdown', body: '   ' }), null);
  assert.equal(poemPreview(null), null);
});
test('very long line is clipped on grapheme boundary with ellipsis', () => {
  const p = poemPreview({ category: 'poem', contentFormat: 'markdown', body: 'கொ'.repeat(200) });
  assert.equal(p.more, true);
  assert.ok(p.lines[0].endsWith('…'));
  assert.ok([...p.lines[0].slice(0, -1)].every((c, i) => c === ['க', 'ொ'][i % 2]), 'no syllable split');
});
test('hostile markup stays inert text (rendered by React as text nodes)', () => {
  const p = poemPreview({ category: 'poem', contentFormat: 'markdown', body: '<img src=x onerror=alert(1)>வரி\n&lt;b&gt;' });
  assert.ok(!p.lines.join('').includes('<'));
});
