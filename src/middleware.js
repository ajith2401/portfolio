// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host');
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Force www redirect for SEO consistency
  if (!hostname.startsWith('www.') && 
      !hostname.includes('localhost') && 
      !hostname.includes('127.0.0.1') &&
      !hostname.includes('vercel.app')) {
    return NextResponse.redirect(
      `https://www.${hostname}${pathname}${url.search}`,
      301
    );
  }

  // TEMPORARILY DISABLE ObjectId blocking to test
  // We'll only block known problematic patterns, not all ObjectIds
  
  // Block API routes from being indexed
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Add security headers for SEO and performance
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Performance headers
  if (pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};