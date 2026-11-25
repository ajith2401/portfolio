// Shared content contract: JSON-LD builders. Only describes what is visibly on the page.
// Deliberately absent: aggregateRating, review, comment, publisher logo, keywords boilerplate.
import { DEFAULT_SITE } from './seo.js';

/** Safe for embedding inside <script type="application/ld+json">. */
export function safeJsonLd(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(String.fromCharCode(0x2028)).join('\\u2028')
    .split(String.fromCharCode(0x2029)).join('\\u2029');
}

export function personId(site = DEFAULT_SITE) {
  return `${site.siteUrl}/#person`;
}

export function buildPersonJsonLd({ name, sameAs = [], site = DEFAULT_SITE } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(site),
    name: name || site.siteName,
    url: site.siteUrl,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildWebSiteJsonLd(site = DEFAULT_SITE) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.siteUrl}/#website`,
    url: site.siteUrl,
    name: site.siteName,
  };
}

/** doc: resolved public writing; seo: result of resolveWritingSeo. */
export function buildWritingJsonLd(doc, seo, { authorName } = {}) {
  const site = seo.site;
  const data = {
    '@context': 'https://schema.org',
    '@type': seo.schemaType,
    '@id': `${seo.canonical}#work`,
    url: seo.canonical,
    mainEntityOfPage: seo.canonical,
    headline: seo.title,
    name: seo.title,
    description: seo.description,
    inLanguage: seo.lang,
    author: { '@type': 'Person', '@id': personId(site), name: authorName || site.siteName },
    ...(seo.publishedTime ? { datePublished: new Date(seo.publishedTime).toISOString() } : {}),
    ...(seo.modifiedTime ? { dateModified: new Date(seo.modifiedTime).toISOString() } : {}),
    ...(seo.og.imageSource !== 'default' && seo.og.image ? { image: seo.og.image } : {}),
    ...(doc.category ? { genre: doc.category } : {}),
    ...(doc.wordCount ? { wordCount: doc.wordCount } : {}),
    ...(Array.isArray(doc.tags) && doc.tags.length ? { keywords: doc.tags.join(', ') } : {}), // real tags only
  };
  return data;
}

/** items: [{ name, url }] matching the visible breadcrumb trail, in order. */
export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function writingBreadcrumbs(seo) {
  const { site } = seo;
  return [
    { name: 'Home', url: site.siteUrl },
    { name: site.sectionLabel, url: `${site.siteUrl}/${site.section}` },
    { name: seo.title, url: seo.canonical },
  ];
}
