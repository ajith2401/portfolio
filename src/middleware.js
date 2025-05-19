// Create a middleware file: src/middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get hostname (e.g. www.ajithkumarr.com, ajithkumarr.com)
  const hostname = request.headers.get('host');
  const url = request.nextUrl.clone();
  
  // Check if www is missing and it's not localhost
  if (!hostname.startsWith('www.') && 
      !hostname.includes('localhost') && 
      !hostname.includes('127.0.0.1')) {
    // Add www prefix
    return NextResponse.redirect(
      `https://www.${hostname}${url.pathname}${url.search}`,
      301
    );
  }

  return NextResponse.next();
}

// Only run middleware on specific paths to optimize performance
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};