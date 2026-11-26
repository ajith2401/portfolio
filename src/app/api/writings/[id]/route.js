// src/app/api/writings/[id]/route.js
import { NextResponse } from 'next/server';
import { Writing } from '@/models/writings.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { findForRoute } from '@/lib/public-writings';
import { toPublicWriting, encodeSlugForUrl } from '@/lib/content-contract/index.js';

// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper to log API requests for monitoring
function logRequest(method, identifier, userAgent, clientIP, result) {
  const timestamp = new Date().toISOString();
  console.log(`[API] ${timestamp} | ${method} /api/writings/${identifier} | ${result} | IP: ${clientIP} | UA: ${userAgent?.substring(0, 50) || 'unknown'}`);
}

// GET a single PUBLISHED writing by slug (or ObjectId, which permanently redirects to the slug).
// Always serialised through the public DTO: no ratings[] (reviewer emails), revisions or drafts.
export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { status: 'error', message: 'Invalid writing identifier', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const result = await findForRoute(id);

    if (result.action === 'redirect') {
      const target = new URL(request.url);
      target.pathname = `/api/writings/${encodeSlugForUrl(result.slug)}`;
      return NextResponse.redirect(target, {
        status: 301,
        headers: { 'Cache-Control': 'public, max-age=3600', 'X-Redirect-Reason': result.reason }
      });
    }

    if (result.action !== 'render') {
      return NextResponse.json(
        { status: 'error', message: 'Writing not found', code: 'NOT_FOUND' },
        { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } }
      );
    }

    const { writing } = result;
    // Fire-and-forget view counter on the real schema path.
    Writing.updateOne({ _id: writing._id }, { $inc: { 'performance.views.total': 1 } }).catch(() => {});

    const data = { ...toPublicWriting(writing), _id: String(writing._id) };
    const canonical = writing.slug ? `https://www.ajithkumarr.com/quill/${encodeSlugForUrl(writing.slug)}` : null;
    return NextResponse.json(
      {
        status: 'success',
        data: { writing: data },
        meta: { accessedBy: result.via, hasSlug: !!writing.slug, canonicalUrl: canonical }
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
          ...(canonical && { Link: `<${canonical}>; rel="canonical"` })
        }
      }
    );
  } catch (error) {
    console.error('Error fetching writing:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500, headers: { 'Cache-Control': 'no-cache' } }
    );
  }
}

// RETIRED. Writes happen only in the Admin studio, which enforces version compare-and-swap, slug history,
// lifecycle rules and the shared content contract. This key-gated route bypassed all of them and had no callers.
const gone = () =>
  NextResponse.json(
    { error: 'Gone. Writings are managed through the Admin studio.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );

export async function PUT() {
  return gone();
}

export async function PATCH() {
  return gone();
}

export async function DELETE() {
  return gone();
}
