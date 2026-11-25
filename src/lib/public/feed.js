// Pure helpers for RSS items. Writing content is projected to plain text and HTML-escaped, so a malicious
// body can neither inject markup into readers nor terminate a CDATA section.
import { contentToPlainText, writingPath, truncateText, DEFAULT_SITE } from "../content-contract/index.js";
import { escapeXml } from "./comments.js";

export function cdata(s) {
  return `<![CDATA[${String(s ?? "").split("]]>").join("]]]]><![CDATA[>")}]]>`;
}

/** Plain text -> minimal safe HTML: blank-line separated paragraphs, single newlines as <br>. */
export function plainTextToHtml(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p) => `<p>${escapeXml(p).split("\n").join("<br/>")}</p>`)
    .join("");
}

export function writingFeedItem(doc, site = DEFAULT_SITE) {
  if (!doc || !doc.slug) return null;
  const link = `${site.siteUrl}${writingPath(doc.slug, site.section)}`;
  const plain = contentToPlainText(doc);
  const description = doc.excerpt?.trim() || truncateText(plain.replace(/\s+/g, " "), 200);
  return {
    title: doc.title,
    link,
    description,
    contentHtml: plainTextToHtml(plain),
    pubDate: new Date(doc.publishedAt || doc.createdAt || Date.now()).toUTCString(),
    category: doc.category || "",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    lang: doc.language === "English" ? "en" : "ta",
  };
}
