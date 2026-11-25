// Pure helpers for the Open Graph card: no canvas, no framework. `measure(text, fontPx)` returns pixel width.
import { graphemes, toOneLine } from '../content-contract/index.js';

export const OG_SIZE = Object.freeze({ width: 1200, height: 630 });
export const TITLE_MAX_GRAPHEMES = 140;

/** One line, NFC, hard-capped by grapheme count (never splits a Tamil syllable or emoji). */
export function clampTitle(title, max = TITLE_MAX_GRAPHEMES) {
  const one = toOneLine(title).replace(/[\u0000-\u001f\u007f]/g, '');
  const g = graphemes(one);
  if (g.length <= max) return one;
  return g.slice(0, max - 1).join('').trimEnd() + '…';
}

function breakLongWord(word, fontPx, maxWidth, measure) {
  const out = [];
  let cur = '';
  for (const g of graphemes(word)) {
    if (cur && measure(cur + g, fontPx) > maxWidth) { out.push(cur); cur = g; } else cur += g;
  }
  if (cur) out.push(cur);
  return out;
}

function wrap(text, fontPx, maxWidth, measure) {
  const lines = [];
  let cur = '';
  for (const word of text.split(' ')) {
    const attempt = cur ? `${cur} ${word}` : word;
    if (measure(attempt, fontPx) <= maxWidth) { cur = attempt; continue; }
    if (cur) { lines.push(cur); cur = ''; }
    if (measure(word, fontPx) <= maxWidth) { cur = word; continue; }
    const parts = breakLongWord(word, fontPx, maxWidth, measure);
    lines.push(...parts.slice(0, -1));
    cur = parts[parts.length - 1] || '';
  }
  if (cur) lines.push(cur);
  return lines;
}

function ellipsize(line, fontPx, maxWidth, measure) {
  const g = graphemes(line);
  while (g.length > 1 && measure(g.join('') + '…', fontPx) > maxWidth) g.pop();
  return g.join('').trimEnd() + '…';
}

/**
 * Largest font size from `sizes` (descending) whose wrapped title fits in maxLines.
 * If none fits, uses the smallest size and ellipsizes the last line (grapheme-safe).
 * @returns {{ fontPx: number, lines: string[], truncated: boolean }}
 */
export function fitTitle(rawTitle, measure, { maxWidth, maxLines = 3, sizes = [88, 76, 66, 58, 50] } = {}) {
  const title = clampTitle(rawTitle) || 'Ajithkumar R';
  for (const fontPx of sizes) {
    const lines = wrap(title, fontPx, maxWidth, measure);
    if (lines.length <= maxLines) return { fontPx, lines, truncated: false };
  }
  const fontPx = sizes[sizes.length - 1];
  const lines = wrap(title, fontPx, maxWidth, measure).slice(0, maxLines);
  lines[maxLines - 1] = ellipsize(lines[maxLines - 1], fontPx, maxWidth, measure);
  return { fontPx, lines, truncated: true };
}
