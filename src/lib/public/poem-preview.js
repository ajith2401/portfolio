// Server-side poem preview for list cards: the first stanza only, intentional line breaks preserved.
// Output is plain strings (rendered as React text nodes, so never interpreted as HTML).
import { contentToPlainText, graphemes } from '../content-contract/index.js';

export const PREVIEW_MAX_LINES = 4;
export const PREVIEW_MAX_LINE_GRAPHEMES = 72;

function clipLine(line, max) {
  const g = graphemes(line);
  if (g.length <= max) return { text: line, clipped: false };
  const cut = g.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  const keep = sp > max * 0.6 ? cut.slice(0, sp) : cut;
  return { text: keep.join('').trimEnd() + '…', clipped: true };
}

/**
 * @param {object} doc lean writing (category, contentFormat, content?, body?)
 * @returns {{ lines: string[], more: boolean } | null} null when not a poem or nothing to show
 */
export function poemPreview(doc, { maxLines = PREVIEW_MAX_LINES, maxLineGraphemes = PREVIEW_MAX_LINE_GRAPHEMES } = {}) {
  if (!doc || doc.category !== 'poem') return null;
  let plain = '';
  try { plain = contentToPlainText(doc); } catch { return null; }
  const stanzas = plain.replace(/\r\n?/g, '\n').split(/\n[ \t]*\n/).map((s) => s.trim()).filter(Boolean);
  if (!stanzas.length) return null;
  const all = stanzas[0].split('\n').map((l) => l.trim()).filter(Boolean);
  const shown = all.slice(0, maxLines);
  let more = stanzas.length > 1 || all.length > shown.length;
  const lines = shown.map((l) => {
    const c = clipLine(l, maxLineGraphemes);
    if (c.clipped) more = true;
    return c.text;
  });
  return { lines, more };
}
