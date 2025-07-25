// src/middleware.js
import { NextResponse } from 'next/server';

// Known problematic ObjectIds from Google Search Console
const BLOCKED_OBJECT_IDS = new Set([
  '674617c2a56c8f57d03659b4',
  '674617c4a56c8f57d03665fe6',
  '674617c1a56c8f57d03657aa',
  '674617c1a56c8f57d03657da',
  '674617c5a56c8f57d03662a1',
  '674617c0a56c8f57d036614d',
  '674617c1a56c8f57d0365675',
  '674617c5a56c8f57d0366132',
  '674617c0a56c8f57d036588a',
  '674617c0a56c8f57d03655f3'
]);

// Helper to check if string is valid ObjectId
function isObjectId(str) {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

// Helper to get client IP for logging
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export function middleware(request) {
  const hostname = request.headers.get('host');
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = getClientIP(request);

  // Extract path segments
  const segments = pathname.split('/').filter(Boolean);
  const [section, identifier] = segments;

  // 1. Force HTTPS and www redirect for SEO consistency (highest priority)
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol.slice(0, -1);
  const needsHttpsRedirect = protocol !== 'https' && 
                           !hostname.includes('localhost') && 
                           !hostname.includes('127.0.0.1');
  const needsWwwRedirect = !hostname.startsWith('www.') && 
                          !hostname.includes('localhost') && 
                          !hostname.includes('127.0.0.1') &&
                          !hostname.includes('vercel.app') &&
                          !hostname.includes('preview');

  if (needsHttpsRedirect || needsWwwRedirect) {
    const redirectUrl = new URL(url);
    
    if (needsHttpsRedirect) {
      redirectUrl.protocol = 'https:';
    }
    
    if (needsWwwRedirect) {
      redirectUrl.hostname = hostname.startsWith('www.') ? hostname : `www.${hostname}`;
    }
    
    // Log the redirect for monitoring
    console.log(`[REDIRECT] ${clientIP} | ${protocol}://${hostname}${pathname} -> ${redirectUrl.toString()}`);
    
    return NextResponse.redirect(redirectUrl, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000', // 1 year for HTTPS/www redirects
        'X-Robots-Tag': 'noindex, nofollow' // Prevent indexing during redirect
      }
    });
  }

  // 2. Handle problematic ObjectId URLs from Google Search Console
  const contentSections = ['blog', 'quill', 'devfolio', 'spotlight'];
  
  if (contentSections.includes(section) && identifier) {
    // ONLY block if it's an ObjectId, allow slug URLs to pass through
    if (isObjectId(identifier)) {
      
      // Check if it's one of the known problematic IDs
      if (BLOCKED_OBJECT_IDS.has(identifier)) {
        console.log(`[BLOCKED] ${clientIP} | Problematic URL: ${pathname} | UA: ${userAgent.substring(0, 50)}`);
        
        // Return 410 Gone for these specific URLs
        return new NextResponse(
          JSON.stringify({
            error: 'Gone',
            message: 'This content has been permanently moved to a new URL structure.',
            timestamp: new Date().toISOString(),
            redirect: `Please visit https://www.ajithkumarr.com/${section}/ to find the content.`
          }),
          {
            status: 410, // Gone - indicates the resource is no longer available
            headers: {
              'Content-Type': 'application/json',
              'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }
        );
      }
      
      // For other ObjectId URLs, let them pass through but mark as noindex
      console.log(`[NOINDEX] ${clientIP} | ObjectId URL: ${pathname} | UA: ${userAgent.substring(0, 50)}`);
      
      const response = NextResponse.next();
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }
    // If it's NOT an ObjectId (i.e., it's a slug), let it pass through normally
  }

  // 3. Block crawling of API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'private, no-cache, no-store');
    return response;
  }

  // 4. Block admin/auth routes from indexing
  if (pathname.startsWith('/admin/') || 
      pathname.startsWith('/dashboard/') ||
      pathname.startsWith('/auth/') ||
      pathname.startsWith('/login/') ||
      pathname.startsWith('/signup/')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Cache-Control', 'private, no-cache');
    return response;
  }

  // 5. Block subscription/checkout pages from indexing
  if (pathname.startsWith('/checkout/') ||
      pathname.startsWith('/subscription-verified') ||
      pathname.startsWith('/unsubscribed')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'private, no-cache');
    return response;
  }

  // 6. Handle search engine crawlers with special treatment
  const isCrawler = /bot|crawler|spider|scraper/i.test(userAgent);
  
  if (isCrawler) {
    console.log(`[CRAWLER] ${clientIP} | ${pathname} | ${userAgent.substring(0, 100)}`);
    
    // Add crawl delay for non-Google bots
    const isGoogleBot = /googlebot/i.test(userAgent);
    if (!isGoogleBot) {
      // Add a small delay for other bots
      const response = NextResponse.next();
      response.headers.set('X-Crawl-Delay', '2');
      return response;
    }
  }

  // 7. Default response with comprehensive security and SEO headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Performance headers for static assets
  if (pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/images/') ||
      pathname.startsWith('/backgrounds/') ||
      pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|otf|css|js)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // SEO headers for content pages
  if (contentSections.includes(section) && identifier && !isObjectId(identifier)) {
    // This is a slug URL - add SEO-friendly headers
    response.headers.set('X-Canonical-URL', `https://www.ajithkumarr.com${pathname}`);
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }
  
  // Add HSTS header for security
  if (hostname && hostname.includes('ajithkumarr.com')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Add CSP header for security (but allow Vercel analytics)
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://www.youtube.com https://www.google.com"
  ].join('; '));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-images.xml|manifest.json).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};