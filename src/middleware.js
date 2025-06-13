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

  // Block problematic ObjectId URLs that cause indexing issues
  // Return 410 (Gone) for old ObjectId patterns to help Google understand
  if (pathname.match(/\/blog\/[0-9a-f]{24}$/)) {
    // Check if it's a bot - serve 410, otherwise redirect to blog index
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    
    if (isBot) {
      return new Response('This URL format is no longer available', {
        status: 410,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'public, max-age=2592000' // 30 days
        }
      });
    } else {
      // Redirect users to blog index
      return NextResponse.redirect(new URL('/blog', request.url), 302);
    }
  }

  // Same for other ObjectId patterns
  if (pathname.match(/\/quill\/[0-9a-f]{24}$/)) {
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    
    if (isBot) {
      return new Response('This URL format is no longer available', {
        status: 410,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'public, max-age=2592000'
        }
      });
    } else {
      return NextResponse.redirect(new URL('/quill', request.url), 302);
    }
  }

  if (pathname.match(/\/devfolio\/[0-9a-f]{24}$/)) {
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    
    if (isBot) {
      return new Response('This URL format is no longer available', {
        status: 410,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'public, max-age=2592000'
        }
      });
    } else {
      return NextResponse.redirect(new URL('/devfolio', request.url), 302);
    }
  }

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