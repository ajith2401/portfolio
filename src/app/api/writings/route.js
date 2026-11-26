// src/app/api/writings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing } from '@/models';
import { toCardsWithPreview } from '@/lib/public-writings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Recommended MongoDB Indexes for best performance:
// db.writings.createIndex({ slug: 1 })
// db.writings.createIndex({ category: 1, publishedAt: -1 })
// db.writings.createIndex({ status: 1 })
// db.writings.createIndex({ title: "text", body: "text", category: "text" })

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Build query based on parameters
    // Only published writings. Short pieces (e.g. two-line Tamil poems) are valid and must be listed.
    const query = {
      status: 'published'
    };
    const sort = {};
    
    // Category filter - use exact match for indexed performance
    let category = searchParams.get('category');
    if (category && category.length <= 60 && category.toLowerCase() !== 'all writings') {
      query.category = category;
    }
    
    // Date filter
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }
    
    // Search text - use $text if indexed
    const search = searchParams.get('search');
    if (search && search.trim() !== '') {
      query.$text = { $search: search.slice(0, 200) };
    }
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'date';
    switch (sortBy) {
      case 'rating':
        sort.averageRating = -1;
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'title':
        sort.title = 1;
        break;
      case 'date':
      default:
        sort.createdAt = -1;
        break;
    }
    
    // Pagination
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    let requestedPage = 1;
    if (pageParam) {
      const parsedPage = parseInt(pageParam);
      requestedPage = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    }
    let limit = 12;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      limit = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 50) : 12;
    }

    // Get total count of matching documents
    const total = await Writing.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    
    // Clamp requested page to valid range so out-of-bounds requests return valid data
    const currentPage = total > 0 ? Math.min(requestedPage, totalPages) : 1;
    const skip = (currentPage - 1) * limit;
    
    // Select needed fields for listing
    const writings = await Writing.find(query)
      .select('title slug excerpt wordCount readTime language tags images publishedAt createdAt updatedAt category averageRating totalRatings status featured trending')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const cards = await toCardsWithPreview(writings);
    return NextResponse.json({
      writings: cards.map((card, i) => ({
        ...card,
        _id: String(writings[i]._id),
        averageRating: writings[i].averageRating || 0,
        totalRatings: writings[i].totalRatings || 0,
        trending: Boolean(writings[i].trending),
        status: writings[i].status
      })),
      pagination: {
        total,
        pages: totalPages,
        current: currentPage,
        limit
      },
      filters: {
        category: category || null,
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null,
        sortBy
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Error fetching writings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch writings' },
      { status: 500 }
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

export async function POST() {
  return gone();
}

export async function PUT() {
  return gone();
}

export async function PATCH() {
  return gone();
}

export async function DELETE() {
  return gone();
}
