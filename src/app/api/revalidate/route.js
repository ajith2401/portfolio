// POST /api/revalidate  { slug, previousSlugs? }  with  Authorization: Bearer <REVALIDATE_SECRET>
// Called by the admin app after publish/unpublish/slug change. Refreshes the writing page(s), the list and the sitemap.
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { secretMatches, revalidationTargets } from '@/lib/public/revalidate.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'Revalidation is not configured' }, { status: 503 });
  }
  const auth = request.headers.get('authorization') || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7).trim() : request.headers.get('x-revalidate-secret') || '';
  if (!secretMatches(provided, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { paths, error } = revalidationTargets(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ revalidated: true, paths });
}
