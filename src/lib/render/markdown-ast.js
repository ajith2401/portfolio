// Safe legacy Markdown parser. Output is a plain AST (no HTML strings). Raw HTML in the source is NOT
// interpreted: "<script>" is just text and React escapes it when rendered. URLs are policed at render time.
// Supported: headings, paragraphs (single newlines kept as line breaks: poems), blockquotes, ordered/unordered
// lists, fenced code, horizontal rules, standalone images; inline bold/italic/strike/code/links/images.

const FENCE = /^```/;
const HR = /^(?:-{3,}|\*{3,}|_{3,})\s*$/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const UL = /^\s*[-*+]\s+(.*)$/;
const OL = /^\s*(\d+)[.)]\s+(.*)$/;
const IMG_LINE = /^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;

export function parseInline(src) {
  const out = [];
  let buf = "";
  const flush = () => {
    if (buf) out.push({ t: "text", v: buf });
    buf = "";
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    let m;
    if (rest[0] === "\\" && /[\\`*_{}[\]()#+\-.!~>|]/.test(rest[1] || "")) {
      buf += rest[1];
      i += 2;
      continue;
    }
    if ((m = /^`([^`\n]+)`/.exec(rest))) {
      flush(); out.push({ t: "code", v: m[1] }); i += m[0].length; continue;
    }
    if ((m = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/.exec(rest))) {
      flush(); out.push({ t: "image", alt: m[1], src: m[2], title: m[3] || "" }); i += m[0].length; continue;
    }
    if ((m = /^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/.exec(rest))) {
      flush(); out.push({ t: "link", href: m[2], title: m[3] || "", c: parseInline(m[1]) }); i += m[0].length; continue;
    }
    if ((m = /^\*\*([^\n]+?)\*\*/.exec(rest)) || (m = /^__([^\n]+?)__/.exec(rest))) {
      flush(); out.push({ t: "strong", c: parseInline(m[1]) }); i += m[0].length; continue;
    }
    if ((m = /^~~([^\n]+?)~~/.exec(rest))) {
      flush(); out.push({ t: "del", c: parseInline(m[1]) }); i += m[0].length; continue;
    }
    if ((m = /^\*([^*\s][^*\n]*?)\*/.exec(rest))) {
      flush(); out.push({ t: "em", c: parseInline(m[1]) }); i += m[0].length; continue;
    }
    if (rest[0] === "\n") {
      flush(); out.push({ t: "br" }); i += 1; continue;
    }
    buf += rest[0];
    i += 1;
  }
  flush();
  return out;
}

export function parseMarkdown(markdown) {
  const lines = String(markdown ?? "").replace(/\r\n?/g, "\n").normalize("NFC").split("\n");
  const blocks = [];
  let i = 0;
  const startsBlock = (l) => FENCE.test(l) || HR.test(l) || HEADING.test(l) || /^\s*>/.test(l) || UL.test(l) || OL.test(l) || IMG_LINE.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (FENCE.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const code = [];
      i++;
      while (i < lines.length && !FENCE.test(lines[i])) code.push(lines[i++]);
      i++; // closing fence (or EOF)
      blocks.push({ t: "code", lang, v: code.join("\n") });
      continue;
    }
    if (HR.test(line)) { blocks.push({ t: "hr" }); i++; continue; }
    let m;
    if ((m = HEADING.exec(line))) {
      blocks.push({ t: "heading", level: m[1].length, c: parseInline(m[2]) });
      i++;
      continue;
    }
    if (/^\s*>/.test(line)) {
      const q = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) q.push(lines[i++].replace(/^\s*>\s?/, ""));
      blocks.push({ t: "quote", c: parseMarkdown(q.join("\n")) });
      continue;
    }
    if (UL.test(line) || OL.test(line)) {
      const ordered = OL.test(line);
      const re = ordered ? OL : UL;
      const items = [];
      let start = 1;
      if (ordered) start = parseInt(OL.exec(line)[1], 10) || 1;
      while (i < lines.length && re.test(lines[i])) {
        const mm = re.exec(lines[i]);
        items.push(parseInline(ordered ? mm[2] : mm[1]));
        i++;
      }
      blocks.push({ t: "list", ordered, start, items });
      continue;
    }
    if ((m = IMG_LINE.exec(line))) {
      blocks.push({ t: "image", alt: m[1], src: m[2], title: m[3] || "" });
      i++;
      continue;
    }
    // paragraph: consecutive non-blank, non-block lines; newlines survive as <br> (poetry)
    const para = [];
    while (i < lines.length && lines[i].trim() && (para.length === 0 || !startsBlock(lines[i]))) para.push(lines[i++]);
    blocks.push({ t: "paragraph", c: parseInline(para.join("\n")) });
  }
  return blocks;
}

/** Top-level headings in render order, for a table of contents (ids match the renderer's). */
export function markdownHeadings(blocks) {
  const flat = (n) => (n.c || []).map((x) => (x.t === "text" || x.t === "code" ? x.v : flat(x))).join("");
  return blocks.filter((b) => b.t === "heading").map((b) => ({ level: b.level, text: flat(b) }));
}
