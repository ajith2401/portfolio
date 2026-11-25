// Pure builders turning a contract SEO resolution into Next metadata and JSON-LD scripts.
import {
  resolveWritingSeo,
  buildWritingJsonLd,
  buildBreadcrumbJsonLd,
  writingBreadcrumbs,
  safeJsonLd,
} from '../content-contract/index.js';

const AUTHOR = 'Ajithkumar R';

const iso = (v) => {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

/** Next `metadata` object. The layout title template appends the brand, so the title is bare. */
export function buildWritingMetadata(doc, { objectIdAccess = false } = {}) {
  const seo = resolveWritingSeo(doc);
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
export function buildWritingJsonLdScripts(doc) {
  const seo = resolveWritingSeo(doc);
  return [
    safeJsonLd(buildWritingJsonLd(doc, seo, { authorName: AUTHOR })),
    safeJsonLd(buildBreadcrumbJsonLd(writingBreadcrumbs(seo))),
  ];
}

export function notFoundMetadata() {
  return { title: 'Writing not found', robots: { index: false, follow: false } };
}
