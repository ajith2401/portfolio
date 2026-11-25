// src/app/quill/[quill_id]/page.js
// Public writing page. One lookup per request (shared by metadata and page via cache()).
import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { findForRoute, relatedCards } from '@/lib/public-writings';
import connectDB from '@/lib/db';
import { Writing } from '@/models';
import { toPublicWriting, writingPath, docHeadings } from '@/lib/content-contract/index.js';
import { parseMarkdown, markdownHeadings } from '@/lib/render/markdown-ast.js';
import { WritingContent } from '@/lib/render/WritingContent.jsx';
import {
  buildWritingMetadata,
  buildWritingJsonLdScripts,
  notFoundMetadata,
} from '@/lib/public/writing-metadata.js';
import WritingDetailClient from './WritingDetailClient';

const lookup = cache(async (param) => {
  try {
    return await findForRoute(param);
  } catch (error) {
    console.error('Error resolving writing route:', error);
    return { kind: 'notfound' };
  }
});

export async function generateMetadata(props) {
  const { quill_id } = await props.params;
  const route = await lookup(quill_id);
  if (route.kind === 'render') {
    return buildWritingMetadata(route.doc, { objectIdAccess: false });
  }
  if (route.kind === 'redirect') return { robots: { index: false, follow: false } };
  return notFoundMetadata();
}

export default async function WritingDetailPage(props) {
  const { quill_id } = await props.params;
  const route = await lookup(quill_id);

  if (route.kind === 'redirect') permanentRedirect(writingPath(route.slug));
  if (route.kind !== 'render') notFound();

  const doc = route.doc;
  const writing = JSON.parse(JSON.stringify(toPublicWriting(doc)));
  let related = [];
  try {
    related = JSON.parse(JSON.stringify(await relatedCards(doc, 3)));
  } catch (error) {
    console.error('Error loading related writings:', error);
  }
  let headings = [];
  try {
    headings = writing.contentFormat === 'tiptap' && writing.content
      ? docHeadings(writing.content)
      : markdownHeadings(parseMarkdown(writing.body || ''));
  } catch {
    headings = [];
  }
  const [workLd, crumbLd] = buildWritingJsonLdScripts(doc);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: workLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: crumbLd }} />
      <WritingDetailClient writing={writing} quillId={writing.id} headings={headings} related={related}>
        <WritingContent writing={writing} />
      </WritingDetailClient>
    </>
  );
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const rows = await Writing.find({ status: 'published', slug: { $exists: true, $nin: [null, ''] } })
      .select('slug').sort({ publishedAt: -1 }).limit(100).lean();
    return rows.map((w) => ({ quill_id: w.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// ISR: pages are rendered on demand and cached for an hour; /api/revalidate refreshes sooner.
export const revalidate = 3600;
export const maxDuration = 10;
