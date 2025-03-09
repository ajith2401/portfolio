// app/api/books/route.js

import connectDB from '@/lib/db';
import { Book } from '@/models';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find({}).sort({ publishYear: -1 });
    
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     await connectDB();
    
//     const book = await Book.create(body);
    
//     return NextResponse.json(
//       { success: true, data: book },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }
