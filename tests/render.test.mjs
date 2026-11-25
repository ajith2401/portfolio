// Run: node --import ./tests/helpers/jsx-register.mjs --test tests/render.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WritingContent } from "../src/lib/render/WritingContent.jsx";
import { StructuredContent } from "../src/lib/render/structured.jsx";
import { parseMarkdown, markdownHeadings } from "../src/lib/render/markdown-ast.js";
import { linkAttrs, imageSrc } from "../src/lib/render/urls.js";
import { validateDoc } from "../src/lib/content-contract/index.js";

const html = (el) => renderToStaticMarkup(el);
const t = (text, marks) => ({ type: "text", text, ...(marks ? { marks } : {}) });
const para = (...c) => ({ type: "paragraph", content: c });
const doc = (...c) => ({ type: "doc", content: c });
const lines = (...ls) => ls.flatMap((l, i) => (i ? [{ type: "hardBreak" }, t(l)] : [t(l)]));

const STORY = doc(
  { type: "heading", attrs: { level: 1 }, content: [t("அத்தியாயம் ஒன்று")] },
  para(t("மழை பெய்தது. "), t("மண்", [{ type: "bold" }]), t(" மணந்தது; "), t("நினைவு", [{ type: "italic" }]), t("…")),
  { type: "blockquote", content: [para(t("“நிலவு” — ஒரு சொல்."))] },
  { type: "bulletList", content: [{ type: "listItem", content: [para(t("ஒன்று"))] }] },
  { type: "image", attrs: { src: "https://x.test/a.jpg", alt: "மழைக்காட்சி", title: "மழை நாள்" } },
);
const POEM = doc({
  type: "poem",
  content: [para(...lines("வானம் அழுதது,", "மண் சிரித்தது!")), para(...lines("நிலவு ஒளிர்ந்தது?", "இரவு நீண்டது…"))],
});

test("fixtures are valid per the shared contract", () => {
  assert.ok(validateDoc(STORY).ok, validateDoc(STORY).errors?.join());
  assert.ok(validateDoc(POEM).ok);
});

test("structured story: semantic HTML, Tamil intact, h1 demoted, figure+caption+alt", () => {
  const out = html(createElement(WritingContent, { writing: { contentFormat: "tiptap", content: STORY, language: "Tamil" } }));
  assert.match(out, /lang="ta"/);
  assert.match(out, /<h2 id="section-0">அத்தியாயம் ஒன்று<\/h2>/);
  assert.match(out, /<strong>மண்<\/strong>/);
  assert.match(out, /<blockquote><p>“நிலவு” — ஒரு சொல்\.<\/p><\/blockquote>/);
  assert.match(out, /<figure><img src="https:\/\/x\.test\/a\.jpg" alt="மழைக்காட்சி"[^>]*\/><figcaption>மழை நாள்<\/figcaption><\/figure>/);
});

test("structured poem: stanzas as paragraphs, lines separated by <br>", () => {
  const out = html(createElement(StructuredContent, { doc: POEM }));
  assert.match(out, /<div class="poem"[^>]*><p class="stanza">வானம் அழுதது,<br\/>மண் சிரித்தது!<\/p><p class="stanza">நிலவு ஒளிர்ந்தது\?<br\/>இரவு நீண்டது…<\/p><\/div>/);
});

test("two-line poem renders", () => {
  const two = doc({ type: "poem", content: [para(...lines("ஒரு வரி", "இரு வரி"))] });
  assert.match(html(createElement(StructuredContent, { doc: two })), /ஒரு வரி<br\/>இரு வரி/);
});

test("links: external gets nofollow ugc + _blank, mailto/relative safe, javascript: dropped", () => {
  const d = doc(
    para(
      t("a", [{ type: "link", attrs: { href: "https://example.org/x" } }]),
      t("b", [{ type: "link", attrs: { href: "mailto:a@b.co" } }]),
      t("c", [{ type: "link", attrs: { href: "/quill" } }]),
    ),
  );
  const out = html(createElement(StructuredContent, { doc: d }));
  assert.match(out, /<a href="https:\/\/example\.org\/x" rel="noopener noreferrer nofollow ugc" target="_blank">a<\/a>/);
  assert.match(out, /<a href="mailto:a@b\.co" rel="noopener noreferrer">b<\/a>/);
  assert.match(out, /<a href="\/quill" rel="noopener noreferrer">c<\/a>/);
});

test("hostile structured input: invalid doc falls back to text, never throws or emits markup", () => {
  const evil = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "<script>alert(1)</script>" }] }, { type: "script", content: [] }] };
  const out = html(createElement(StructuredContent, { doc: evil }));
  assert.ok(!out.includes("<script"));
  assert.doesNotThrow(() => html(createElement(StructuredContent, { doc: null })));
  assert.doesNotThrow(() => html(createElement(StructuredContent, { doc: { type: "doc", content: "x" } })));
});

test("hostile marks/urls inside a VALID doc are neutralised", () => {
  const d = doc(
    para(t('<img src=x onerror=alert(1)>'), t("x", [{ type: "link", attrs: { href: "javascript:alert(1)" } }])),
    { type: "image", attrs: { src: "javascript:alert(1)", alt: "x" } },
  );
  const out = html(createElement(StructuredContent, { doc: d }));
  assert.ok(!/javascript:/i.test(out));
  assert.ok(!out.includes("<img src=x"));
  assert.match(out, /&lt;img src=x onerror=alert\(1\)&gt;/);
});

const MD = [
  "# மழை",
  "",
  "வானம் அழுதது,",
  "**மண்** சிரித்தது.",
  "",
  "> நிலவு",
  "",
  "- ஒன்று",
  "- இரண்டு",
  "",
  "![மழை](https://x.test/a.jpg)",
].join("\n");

test("markdown: legacy story/poem, line breaks kept, headings get ids", () => {
  const out = html(createElement(WritingContent, { writing: { contentFormat: "markdown", body: MD, language: "Tamil", category: "poem" } }));
  assert.match(out, /<h2 id="section-0">மழை<\/h2>/);
  assert.match(out, /<p>வானம் அழுதது,<br\/><strong>மண்<\/strong> சிரித்தது\.<\/p>/);
  assert.match(out, /<blockquote><p>நிலவு<\/p><\/blockquote>/);
  assert.match(out, /<ul><li>ஒன்று<\/li><li>இரண்டு<\/li><\/ul>/);
  assert.match(out, /<figure><img src="https:\/\/x\.test\/a\.jpg" alt="மழை"/);
  assert.deepEqual(markdownHeadings(parseMarkdown(MD)), [{ level: 1, text: "மழை" }]);
});

test("markdown hostile: raw HTML is text, javascript:/data: dropped, no dangerouslySetInnerHTML", () => {
  const evil = [
    "<script>alert(1)</script>",
    "",
    '<img src=x onerror="alert(1)">',
    "",
    "[click](javascript:alert(1)) [ok](https://example.org) [d](data:text/html;base64,AAA)",
    "",
    "![x](javascript:alert(1))",
    "",
    "![y](data:image/svg+xml;base64,AAA)",
    "",
    "[a](https://x.test \"t\" onmouseover=\"1\")",
  ].join("\n");
  const out = html(createElement(WritingContent, { writing: { contentFormat: "markdown", body: evil } }));
  assert.ok(!out.includes("<script"));
  assert.ok(!out.includes("<img src=x"));
  assert.ok(!/href="javascript:|src="javascript:|data:/i.test(out));
  assert.match(out, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(out, /<a href="https:\/\/example\.org" rel="noopener noreferrer nofollow ugc" target="_blank">ok<\/a>/);
});

test("url policy", () => {
  assert.equal(linkAttrs("javascript:alert(1)"), null);
  assert.equal(linkAttrs("//evil.test"), null);
  assert.equal(linkAttrs(" JaVaScRiPt:1"), null);
  assert.equal(imageSrc("mailto:a@b.co"), null);
  assert.equal(linkAttrs("https://www.ajithkumarr.com/quill").external, false);
});

test("corrupt writing: structured format without content falls back to empty markdown, no crash", () => {
  assert.doesNotThrow(() => html(createElement(WritingContent, { writing: { contentFormat: "tiptap", content: null, body: null } })));
});
