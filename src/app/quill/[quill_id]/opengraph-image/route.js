// GET /quill/<slug>/opengraph-image  ->  branded 1200x630 PNG for a PUBLISHED writing.
// Unpublished / unknown -> 404 (no existence leak). Old slugs -> 308 to the current image URL.
import { NextResponse } from 'next/server';
import { findForRoute } from '@/lib/public-writings';
import { renderCard, cardVersion } from '@/lib/og/render-card.js';
import { getSiteUrl } from '@/lib/public/site.js';
import { encodeSlugForUrl } from '@/lib/content-contract/index.js';

export const runtime = 'nodejs';
export const maxDuration = 10;

const CACHE = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

export async function GET(request, props) {
  const { quill_id } = await props.params;
  let route;
  try {
    route = await findForRoute(quill_id);
  } catch (error) {
    console.error('og: route lookup failed', error);
    return new NextResponse('Service unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  if (route.action === 'redirect') {
    const to = new URL(`/quill/${encodeSlugForUrl(route.slug)}/opengraph-image`, request.url);
    return NextResponse.redirect(to, 308);
  }
  if (route.action !== 'render') {
    return new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } });
  }

  const { title, category, language } = route.writing;
  const host = new URL(getSiteUrl()).host;
  const etag = `"og-${cardVersion({ title, category, language, host })}"`;
  const headers = { 'Content-Type': 'image/png', 'Cache-Control': CACHE, ETag: etag };
  if (request.headers.get('if-none-match') === etag) return new NextResponse(null, { status: 304, headers });

  try {
    const png = renderCard({ title, category, host });
    return new NextResponse(png, { status: 200, headers: { ...headers, 'Content-Length': String(png.length) } });
  } catch (error) {
    console.error('og: render failed', error);
    return new NextResponse('Image unavailable', { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
