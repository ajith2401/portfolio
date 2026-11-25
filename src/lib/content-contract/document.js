import { analyzeBody, countWords, readingTimeMinutes, countGraphemes } from "./text.js";
// Spike: framework-free document spec + validator + text extraction (candidate for the shared contract).
export const DOC_SCHEMA_VERSION = 1;
const INLINE = ["text", "hardBreak"];
const BLOCK = [
  "paragraph",
  "heading",
  "blockquote",
  "bulletList",
  "orderedList",
  "horizontalRule",
  "codeBlock",
  "image",
  "poem",
];

export const NODE_SPEC = {
  doc: { children: BLOCK, min: 1 },
  paragraph: {
    children: INLINE,
    attrs: { textAlign: ["left", "center", "right"] },
  },
  heading: { children: INLINE, attrs: { level: [1, 2, 3, 4, 5, 6] } },
  blockquote: { children: ["paragraph", "bulletList", "orderedList"], min: 1 },
  bulletList: { children: ["listItem"], min: 1 },
  orderedList: { children: ["listItem"], min: 1, attrs: { start: "int" } },
  listItem: { children: ["paragraph", "bulletList", "orderedList"], min: 1 },
  horizontalRule: { children: [] },
  codeBlock: { children: ["text"], attrs: { language: "string" } },
  image: {
    children: [],
    attrs: { src: "url", alt: "string", title: "string" },
  },
  // A poem is a sequence of stanzas; each stanza is a paragraph whose lines are separated by hardBreak.
  poem: {
    children: ["paragraph"],
    min: 1,
    attrs: { align: ["left", "center"] },
  },
  hardBreak: { children: [] },
  text: { children: [] },
};
export const MARK_SPEC = {
  bold: {},
  italic: {},
  strike: {},
  code: {},
  link: { attrs: { href: "url", title: "string" } },
};

const ALLOWED_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);
export function isSafeUrl(value, { allowRelative = true } = {}) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    /[\u0000-\u001f\u007f]/.test(value)
  )
    return false;
  const v = value.trim();
  if (allowRelative && v.startsWith("/") && !v.startsWith("//")) return true;
  try {
    return ALLOWED_PROTOCOLS.has(new URL(v).protocol);
  } catch {
    return false;
  }
}

export function validateDoc(doc) {
  const errors = [];
  const err = (path, msg) => errors.push(`${path}: ${msg}`);
  const attrOk = (spec, key, val, path) => {
    const rule = spec?.attrs?.[key];
    if (rule === undefined) return err(path, `attribute "${key}" not allowed`);
    if (val == null) return;
    if (Array.isArray(rule) && !rule.includes(val))
      err(path, `attribute "${key}" invalid`);
    if (rule === "url" && !isSafeUrl(val)) err(path, `unsafe url in "${key}"`);
    if (rule === "string" && typeof val !== "string")
      err(path, `attribute "${key}" must be a string`);
    if (rule === "int" && !Number.isInteger(val))
      err(path, `attribute "${key}" must be an integer`);
  };
  const walk = (node, path, parent) => {
    const spec = NODE_SPEC[node?.type];
    if (!spec) return err(path, `unknown node type "${node?.type}"`);
    if (parent && !NODE_SPEC[parent.type].children.includes(node.type))
      err(path, `"${node.type}" not allowed in "${parent.type}"`);
    for (const k of Object.keys(node.attrs || {}))
      attrOk(spec, k, node.attrs[k], path);
    if (node.type === "image" && !node.attrs?.src)
      err(path, "image requires src");
    if (node.type === "heading" && !node.attrs?.level)
      err(path, "heading requires level");
    if (node.type === "text") {
      if (typeof node.text !== "string" || node.text === "")
        err(path, "text must be a non-empty string");
      for (const [i, m] of (node.marks || []).entries()) {
        const ms = MARK_SPEC[m?.type];
        if (!ms) {
          err(`${path}.marks[${i}]`, `unknown mark "${m?.type}"`);
          continue;
        }
        for (const k of Object.keys(m.attrs || {}))
          attrOk(ms, k, m.attrs[k], `${path}.marks[${i}]`);
        if (m.type === "link" && !m.attrs?.href)
          err(`${path}.marks[${i}]`, "link requires href");
      }
    } else if (node.marks?.length) err(path, "marks only allowed on text");
    const kids = node.content || [];
    if (spec.min && kids.length < spec.min)
      err(path, `requires at least ${spec.min} child`);
    if (!spec.children.length && kids.length)
      err(path, "must not have children");
    kids.forEach((c, i) => walk(c, `${path}.content[${i}]`, node));
  };
  if (!doc || doc.type !== "doc")
    return { ok: false, errors: ["root must be a doc node"] };
  walk(doc, "doc", null);
  return { ok: errors.length === 0, errors };
}

/** Plain text, preserving paragraph and line breaks. Works for any valid doc. */
export function docToPlainText(doc) {
  const out = [];
  const inline = (n) =>
    n.type === "text" ? n.text : n.type === "hardBreak" ? "\n" : "";
  const block = (n) => {
    switch (n.type) {
      case "paragraph":
      case "heading":
      case "codeBlock":
        out.push((n.content || []).map(inline).join(""));
        break;
      case "image":
      case "horizontalRule":
        break;
      default:
        (n.content || []).forEach(block);
    }
  };
  (doc.content || []).forEach(block);
  return out
    .filter((s, i) => s !== "" || out[i - 1] !== "")
    .join("\n\n")
    .trim();
}
export const docHeadings = (doc) =>
  (doc.content || [])
    .filter((n) => n.type === "heading")
    .map((n) => ({
      level: n.attrs.level,
      text: (n.content || []).map((c) => c.text || "").join(""),
    }));
export const docImages = (doc) => {
  const found = [];
  const walk = (n) => {
    if (n.type === "image")
      found.push({
        url: n.attrs.src,
        alt: n.attrs.alt || "",
        caption: n.attrs.title || "",
      });
    (n.content || []).forEach(walk);
  };
  walk(doc);
  return found;
};

// ---------------------------------------------------------------------------
// Content formats: 'markdown' (legacy `body`) | 'tiptap' (versioned JSON in `content`).
// `body` always stays the legacy/plain source; `content` is the structured source when contentFormat === 'tiptap'.
export const CONTENT_FORMATS = Object.freeze(["markdown", "tiptap"]);
export function resolveContentFormat(w) {
  return w && w.contentFormat === "tiptap" && w.content && w.content.type === "doc"
    ? "tiptap"
    : "markdown";
}

/** Remove editor-added default attributes so equal documents compare/serialize equal. */
export function canonicalizeDoc(doc) {
  const DEFAULTS = { poem: { align: "left" } };
  const clean = (n) => {
    const out = { type: n.type };
    let attrs = n.attrs ? { ...n.attrs } : null;
    if (attrs) {
      for (const k of Object.keys(attrs)) {
        if (attrs[k] === null || attrs[k] === undefined || attrs[k] === "") delete attrs[k];
        else if (DEFAULTS[n.type]?.[k] === attrs[k]) delete attrs[k];
      }
      if (Object.keys(attrs).length) out.attrs = attrs;
    }
    if (n.content?.length) out.content = n.content.map(clean);
    if (n.text !== undefined) out.text = n.text.normalize("NFC");
    if (n.marks?.length) out.marks = n.marks.map((m) => ({ type: m.type, ...(m.attrs && Object.keys(m.attrs).length ? { attrs: m.attrs } : {}) }));
    return out;
  };
  return clean(doc);
}

/** Plain text for any writing regardless of representation. Used for SEO, word count, search. */
export function contentToPlainText(w) {
  return analyzeWriting(w).plain;
}

/** Unified analysis: works for legacy Markdown and structured documents. */
export function analyzeWriting(w) {
  if (resolveContentFormat(w) === "markdown") return { ...analyzeBody(w?.body), format: "markdown" };
  const plain = docToPlainText(w.content);
  const wordCount = countWords(plain);
  return { plain, wordCount, readTime: readingTimeMinutes(wordCount), characterCount: countGraphemes(plain), format: "tiptap" };
}

/** True when a writing has publishable content in either representation. */
export function hasContent(w) {
  if (resolveContentFormat(w) === "markdown") return Boolean(String(w?.body ?? "").trim());
  return Boolean(docToPlainText(w.content).trim()) || docImages(w.content).length > 0;
}
