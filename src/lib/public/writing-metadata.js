// Pure builders turning a contract SEO resolution into Next metadata and JSON-LD scripts.
import {
  resolveWritingSeo,
  buildWritingJsonLd,
  buildBreadcrumbJsonLd,
  writingBreadcrumbs,
  safeJsonLd,
  encodeSlugForUrl,
} from '../content-contract/index.js';
import { cardVersion } from '../og/card-version.js';

const AUTHOR = 'Ajithkumar R';

const iso = (v) => {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

/** Resolve SEO against the configured site origin, using the generated OG card when no image is set. */
function resolveSeo(doc, siteUrl) {
  const site = siteUrl ? { siteUrl } : {};
  const generatedImageUrl = doc?.slug
    ? `/quill/${encodeSlugForUrl(doc.slug)}/opengraph-image?v=${cardVersion({
        title: doc.title, category: doc.category, language: doc.language, host: new URL(siteUrl || 'https://www.ajithkumarr.com').host,
      })}`
    : null;
  return resolveWritingSeo(doc, site, { generatedImageUrl });
}

/** Next `metadata` object. The layout title template appends the brand, so the title is bare. */
export function buildWritingMetadata(doc, { objectIdAccess = false, siteUrl } = {}) {
  const seo = resolveSeo(doc, siteUrl);
  const index = seo.robots.index && !objectIdAccess;
  const image = { url: seo.og.image, alt: seo.og.imageAlt };
  return {
    title: seo.title,
    description: seo.description,
    authors: [{ name: AUTHOR }],
    alternates: { canonical: seo.canonical },
    robots: { index, follow: seo.robots.follow },
    openGraph: {
      type: 'article',
      title: seo.og.title,
      description: seo.og.description,
      url: seo.canonical,
      siteName: AUTHOR,
      locale: seo.locale,
      publishedTime: iso(seo.publishedTime),
      modifiedTime: iso(seo.modifiedTime),
      authors: [AUTHOR],
      images: [image],
    },
    twitter: {
      card: seo.twitter.card,
      title: seo.twitter.title,
      description: seo.twitter.description,
      images: [{ url: seo.twitter.image, alt: seo.twitter.imageAlt }],
    },
  };
}

/** Serialized, script-safe JSON-LD strings: the work and its breadcrumb trail. */
export function buildWritingJsonLdScripts(doc, { siteUrl } = {}) {
  const seo = resolveSeo(doc, siteUrl);
  return [
    safeJsonLd(buildWritingJsonLd(doc, seo, { authorName: AUTHOR })),
    safeJsonLd(buildBreadcrumbJsonLd(writingBreadcrumbs(seo))),
  ];
}

export function notFoundMetadata() {
  return { title: 'Writing not found', robots: { index: false, follow: false } };
}
