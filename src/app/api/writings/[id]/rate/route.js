// src/app/api/writings/[id]/rate/route.js
// Retired. This endpoint accepted unauthenticated, unmoderated ratings keyed by a self-reported email
// and echoed the whole writing (including every reviewer's email). Ratings now go through POST /api/comments,
// which validates input, rate-limits, deduplicates per email and stores them as `pending` until approved.
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    { error: 'Gone. Submit ratings through POST /api/comments.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
