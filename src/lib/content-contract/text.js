// Shared content contract: Markdown -> clean text, Unicode-aware counting and truncation.
import { graphemes, normalizeText } from "./slug.js";

export const SEO_LIMITS = { title: 60, description: 155 }; // advisory only; search engines truncate by pixel width

const wordSegmenter =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: "word" })
    : null;

/**
 * Collapse paragraph separators, line breaks and repeated whitespace into single spaces, for one-line
 * contexts (SEO excerpt, search snippet). Never alters characters other than whitespace, so Tamil
 * combining marks, ZWJ/ZWNJ and punctuation are preserved. Does not touch stored content.
 */
export function toOneLine(value) {
  return normalizeText(value)
    .replace(/[\u2028\u2029]/g, " ")
    .replace(/[ \t\r\n\f\v\u00a0]+/g, " ")
    .trim();
}

/**
 * Markdown -> plain text. Keeps paragraph breaks (blank line) and line breaks (important for poems).
 * Drops images and code blocks, keeps link labels.
 */
export function markdownToPlainText(markdown) {
  let s = normalizeText(markdown).replace(/\r\n?/g, "\n");
  s = s.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, ""); // fenced code
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<\/?[a-zA-Z][^>]*>/g, ""); // html tags (not a bare "<" in a poem)
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ""); // images
  s = s.replace(/!\[[^\]]*\]\[[^\]]*\]/g, "");
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1"); // links -> label
  s = s.replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1");
  s = s.replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, ""); // headings
  s = s.replace(/^[ \t]{0,3}>[ \t]?/gm, ""); // quotes (also nested)
  s = s.replace(/^[ \t]{0,3}>[ \t]?/gm, "");
  s = s.replace(/^[ \t]*([-*_])([ \t]*\1){2,}[ \t]*$/gm, ""); // horizontal rules
  s = s.replace(/^[ \t]*(?:[-*+]|\d+[.)])\s+/gm, ""); // list markers
  s = s.replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, "$2"); // bold
  s = s.replace(
    /(?<![\p{L}\p{N}*])\*(?=\S)([^*\n]*?\S)\*(?![\p{L}\p{N}*])/gu,
    "$1",
  ); // italic *
  s = s.replace(
    /(?<![\p{L}\p{N}_])_(?=\S)([^_\n]*?\S)_(?![\p{L}\p{N}_])/gu,
    "$1",
  ); // italic _
  s = s.replace(/~~(?=\S)([\s\S]*?\S)~~/g, "$1");
  s = s.replace(/`([^`\n]+)`/g, "$1");
  s = s.replace(/[ \t]+$/gm, "");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

export function countGraphemes(text) {
  return graphemes(text).length;
}

/** Truncate on grapheme (not UTF-16) boundaries, preferring a word boundary. */
export function truncateText(text, max, { ellipsis = "…" } = {}) {
  const clean = String(text ?? "").trim();
  const g = graphemes(clean);
  if (g.length <= max) return clean;
  let cut = g.slice(0, Math.max(1, max - 1));
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > cut.length * 0.6) cut = cut.slice(0, lastSpace);
  return cut.join("").replace(/[\s,;:.\-–—]+$/u, "") + ellipsis;
}

/** Single-line description for meta tags. Poems can pass lineSeparator ' / '. */
export function buildDescription(
  markdown,
  { max = SEO_LIMITS.description, lineSeparator = " ", plain: isPlain = false } = {},
) {
  const plain = isPlain ? normalizeText(markdown).trim() : markdownToPlainText(markdown);
  if (!plain) return "";
  const joined = plain
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(lineSeparator)
    .replace(/\s+/g, " ");
  return truncateText(joined, max);
}

export function countWords(plainText) {
  const t = String(plainText ?? "").trim();
  if (!t) return 0;
  if (!wordSegmenter) return t.split(/\s+/).length;
  let n = 0;
  for (const seg of wordSegmenter.segment(t)) if (seg.isWordLike) n += 1;
  return n;
}

export function readingTimeMinutes(wordCount, wordsPerMinute = 180) {
  return wordCount > 0 ? Math.max(1, Math.ceil(wordCount / wordsPerMinute)) : 0;
}

export function analyzeBody(markdown) {
  const plain = markdownToPlainText(markdown);
  const wordCount = countWords(plain);
  return {
    plain,
    wordCount,
    readTime: readingTimeMinutes(wordCount),
    characterCount: countGraphemes(plain),
  };
}

/** Headings outside code fences: [{ level, text, line }] */
export function extractHeadings(markdown) {
  const out = [];
  let inFence = false;
  normalizeText(markdown)
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (/^[ \t]{0,3}(```|~~~)/.test(line)) inFence = !inFence;
      if (inFence) return;
      const m = /^[ \t]{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
      if (m) out.push({ level: m[1].length, text: m[2], line: i + 1 });
    });
  return out;
}

/** Markdown images: [{ alt, url }] */
export function extractImages(markdown) {
  const out = [];
  const re = /!\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)/g;
  let m;
  const src = normalizeText(markdown);
  while ((m = re.exec(src))) out.push({ alt: m[1].trim(), url: m[2] });
  return out;
}

/** Share of letters that are Tamil. Used only to warn about a language mismatch, never to decide silently. */
export function tamilLetterRatio(text) {
  const letters = String(text ?? "").match(/\p{L}/gu) || [];
  if (letters.length === 0) return 0;
  const tamil = String(text).match(/\p{Script=Tamil}/gu) || [];
  return tamil.length / letters.length;
}

export function suggestLanguage(text) {
  return tamilLetterRatio(text) >= 0.3 ? "Tamil" : "English";
}
