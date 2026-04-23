import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { TechBlog, Writing, Book, Project } from '@/models';
import { generateUniqueShortCode } from '@/utils/shortCode';

export const dynamic = 'force-dynamic';

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ajithkumarr.com';

const SECTION_MAP = {
  blog: { Model: TechBlog, modelName: 'TechBlog' },
  quill: { Model: Writing, modelName: 'Writing' },
  spotlight: { Model: Book, modelName: 'Book' },
  devfolio: { Model: Project, modelName: 'Project' },
};

function parseContentPath(pathname) {
  if (!pathname || typeof pathname !== 'string') return null;
  const match = pathname.match(/^\/(blog|quill|spotlight|devfolio)\/([^/?#]+)/);
  if (!match) return null;
  return { section: match[1], identifier: decodeURIComponent(match[2]) };
}

async function findDoc(section, identifier) {
  const entry = SECTION_MAP[section];
  if (!entry) return null;
  const { Model, modelName } = entry;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await Model.findById(identifier).select('shortCode slug _id');
    if (byId) return { Model, modelName, doc: byId };
  }
  const bySlug = await Model.findOne({ slug: identifier }).select('shortCode slug _id');
  return bySlug ? { Model, modelName, doc: bySlug } : null;
}

async function ensureShortCode(found) {
  if (found.doc.shortCode) return found.doc.shortCode;
  const code = await generateUniqueShortCode({ excludeModelName: found.modelName, excludeId: found.doc._id });
  await found.Model.updateOne({ _id: found.doc._id }, { $set: { shortCode: code } });
  return code;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { pathname } = body;
    const parsed = parseContentPath(pathname);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Unsupported path. Only /blog, /quill, /spotlight, /devfolio content pages are shortenable.' },
        { status: 400 }
      );
    }

    await connectDB();
    const found = await findDoc(parsed.section, parsed.identifier);
    if (!found) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const code = await ensureShortCode(found);
    const origin = SITE_ORIGIN.replace(/\/$/, '');
    return NextResponse.json({ code, shortUrl: `${origin}/s/${code}` });
  } catch (error) {
    console.error('short-url error:', error);
    return NextResponse.json({ error: 'Failed to generate short URL' }, { status: 500 });
  }
}
