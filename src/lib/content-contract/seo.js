// Shared content contract: SEO metadata resolution. The admin uses this for previews and the public
// site uses it for rendering, so what you preview is what is served.
import { encodeSlugForUrl } from "./slug.js";
import { analyzeWriting, hasContent, resolveContentFormat } from "./document.js";
import {
  buildDescription,
  markdownToPlainText,
  toOneLine,
  truncateText,
  SEO_LIMITS,
} from "./text.js";

export const DEFAULT_SITE = Object.freeze({
  siteUrl: "https://www.ajithkumarr.com",
  siteName: "Ajithkumar R",
  section: "quill",
  sectionLabel: "Writings",
  defaultImage: "/opengraph-image.jpg",
  fallbackDescription: "Tamil writing by Ajithkumar R.",
});

const LANGUAGES = {
  Tamil: { lang: "ta", locale: "ta_IN" },
  English: { lang: "en", locale: "en_US" },
};

const CREATIVE_CATEGORIES = new Set([
  "poem",
  "short story",
  "short writings",
  "letter",
  "joke",
]);

export function languageInfo(language) {
  return LANGUAGES[language] || LANGUAGES.Tamil;
}

export function writingPath(slug, section = DEFAULT_SITE.section) {
  return `/${section}/${encodeSlugForUrl(slug)}`;
}

function isHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function absolute(url, siteUrl) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${siteUrl}${url}`;
  return null;
}

function first(...values) {
  for (const v of values)
    if (typeof v === "string" && v.trim()) return v.trim();
  return "";
}

/** A custom canonical is honoured only when it stays on this site. Otherwise the automatic one is used. */
export function resolveCanonical(doc, site = DEFAULT_SITE) {
  const custom = doc?.seo?.canonicalUrl;
  if (
    custom &&
    isHttpUrl(custom) &&
    new URL(custom).origin === new URL(site.siteUrl).origin
  )
    return custom;
  if (!doc?.slug) return null;
  return `${site.siteUrl}${writingPath(doc.slug, site.section)}`;
}

/**
 * Resolve every SEO value for a writing, with the documented fallback chain:
 * title: seo.title -> title. description: seo.description -> metaDescription -> excerpt -> cleaned body.
 * image: seo.ogImage -> images.large/medium/small -> (caller supplied generated card) -> site default.
 */
export function resolveWritingSeo(
  doc,
  siteOverrides = {},
  { generatedImageUrl = null } = {},
) {
  const site = { ...DEFAULT_SITE, ...siteOverrides };
  const seo = doc?.seo || {};
  const lang = languageInfo(doc?.language);
  const poem = doc?.category === "poem";

  const title = first(seo.title, doc?.title) || site.siteName;
  const excerptPlain = doc?.excerpt
    ? toOneLine(markdownToPlainText(doc.excerpt))
    : "";
  const description = truncateText(
    first(
      seo.description,
      doc?.metaDescription,
      excerptPlain,
      resolveContentFormat(doc) === "tiptap"
        ? buildDescription(analyzeWriting(doc).plain, { plain: true, lineSeparator: poem ? " / " : " " })
        : buildDescription(doc?.body, { lineSeparator: poem ? " / " : " " }),
      site.fallbackDescription,
    ),
    SEO_LIMITS.description,
  );

  const explicitImage = first(seo.ogImage);
  const featured = first(
    doc?.images?.large,
    doc?.images?.medium,
    doc?.images?.small,
  );
  const imageSource = explicitImage
    ? "seo"
    : featured
      ? "featured"
      : generatedImageUrl
        ? "generated"
        : "default";
  const image = absolute(
    explicitImage || featured || generatedImageUrl || site.defaultImage,
    site.siteUrl,
  );
  const imageAlt = first(seo.ogImageAlt, doc?.images?.alt, doc?.title) || title;

  const ogTitle = first(seo.ogTitle, title);
  const ogDescription = first(seo.ogDescription, description);
  const canonical = resolveCanonical(doc, site);

  const published = doc?.status === "published";
  const index = published && Boolean(canonical) && seo.robots?.index !== false;
  const follow = seo.robots?.follow !== false;

  return {
    title,
    description,
    canonical,
    lang: lang.lang,
    locale: lang.locale,
    robots: { index, follow },
    og: {
      title: ogTitle,
      description: ogDescription,
      image,
      imageAlt,
      imageSource,
      url: canonical,
      type: "article",
    },
    twitter: {
      card:
        first(seo.twitterCard) ||
        (imageSource === "default" ? "summary" : "summary_large_image"),
      title: first(seo.twitterTitle, ogTitle),
      description: first(seo.twitterDescription, ogDescription),
      image,
      imageAlt,
    },
    publishedTime: doc?.publishedAt || null,
    modifiedTime:
      doc?.updatedAt || doc?.lastModified || doc?.publishedAt || null,
    schemaType: CREATIVE_CATEGORIES.has(doc?.category)
      ? "CreativeWork"
      : "BlogPosting",
    site,
  };
}

/**
 * Editor-facing checks. Returns [{ id, level: 'error'|'warning'|'info', message }].
 * Only 'error' items should ever block publishing, and only for invalid or unsafe data.
 */
export function checkSeo(
  doc,
  { duplicateSlug = false, duplicateTitle = false } = {},
) {
  const items = [];
  const add = (id, level, message) => items.push({ id, level, message });
  const seo = doc?.seo || {};
  const resolved = resolveWritingSeo(doc);

  if (!first(seo.title))
    add(
      "seo-title-missing",
      "info",
      "No custom SEO title: the work title will be used.",
    );
  if ([...resolved.title].length > SEO_LIMITS.title)
    add(
      "seo-title-long",
      "warning",
      "The title is long and may be shortened in search results.",
    );
  if (!first(seo.description, doc?.metaDescription))
    add(
      "description-generated",
      "info",
      "No custom description: one will be generated from the text. Review it.",
    );
  if (!hasContent(doc) || (resolveContentFormat(doc) === "markdown" && !markdownToPlainText(doc.body)))
    add("body-empty", "error", "The content is empty.");
  if (duplicateSlug)
    add("slug-duplicate", "error", "Another work already uses this slug.");
  if (duplicateTitle)
    add("title-duplicate", "warning", "Another work has the same title.");
  if (!doc?.language)
    add("language-missing", "warning", "Choose the content language.");
  if (!resolved.og.image || resolved.og.imageSource === "default")
    add(
      "image-missing",
      "info",
      "No featured image: a generated card or the site image will be used.",
    );
  if (doc?.images?.large && !first(seo.ogImageAlt, doc?.images?.alt))
    add("image-alt-missing", "warning", "The featured image has no alt text.");
  if (seo.canonicalUrl && resolved.canonical !== seo.canonicalUrl)
    add(
      "canonical-invalid",
      "warning",
      "The custom canonical must be an address on this site; the automatic one is used.",
    );
  if (seo.robots?.index === false)
    add("noindex", "info", "This work is hidden from search engines.");
  return items;
}
