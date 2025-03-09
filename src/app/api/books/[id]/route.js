// app/api/books/[id]/route.js
import connectDB from "@/lib/db";
import { Book } from "@/models";

import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
      const { id } = params;
      await connectDB();
      
      const book = await Book.findById(id);
      
      if (!book) {
        return NextResponse.json(
          { success: false, message: 'Book not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: book });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }
  
// export async function PUT(request, { params }) {
// try {
//     const { id } = params;
//     const body = await request.json();
//     await connectDB();
    
//     const book = await Book.findByIdAndUpdate(
//     id,
//     body,
//     { new: true, runValidators: true }
//     );
    
//     if (!book) {
//     return NextResponse.json(
//         { success: false, message: 'Book not found' },
//         { status: 404 }
//     );
//     }
    
//     return NextResponse.json({ success: true, data: book });
// } catch (error) {
//     return NextResponse.json(
//     { success: false, message: error.message },
//     { status: 500 }
//     );
// }
// }

// export async function DELETE(request, { params }) {
// try {
//     const { id } = params;
//     await connectDB();
    
//     const book = await Book.findByIdAndDelete(id);
    
//     if (!book) {
//     return NextResponse.json(
//         { success: false, message: 'Book not found' },
//         { status: 404 }
//     );
//     }
    
//     return NextResponse.json({ success: true, data: {} });
// } catch (error) {
//     return NextResponse.json(
//     { success: false, message: error.message },
//     { status: 500 }
//     );
// }
// }