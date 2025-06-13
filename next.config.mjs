/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
import nextPWA from 'next-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/]
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  
  // FIXED: Removed problematic experimental features
  experimental: {
    optimizePackageImports: [
      '@/components', 
      '@/lib', 
      'lucide-react', 
      'next/image'
    ],
    serverComponentsExternalPackages: ['mongoose']
    // REMOVED: optimizeCss - this was causing the critters error
  },

  // Image optimization for better Core Web Vitals
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    loader: 'default',
    domains: [
      'res.cloudinary.com', 
      'ajithkumarr.com', 
      'www.ajithkumarr.com',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Headers for SEO and performance
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow'
        }
      ]
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ],

  // Redirects for SEO and URL consistency
  redirects: async () => [
    // Redirect non-www to www for SEO consistency
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'ajithkumarr.com',
        },
      ],
      destination: 'https://www.ajithkumarr.com/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'ajithkumar.com',
        },
      ],
      destination: 'https://www.ajithkumarr.com/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'www.ajithkumar.com',
        },
      ],
      destination: 'https://www.ajithkumarr.com/:path*',
      permanent: true,
    }
  ],

  // Webpack optimizations (SIMPLIFIED)
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false
      };
    }

    return config;
  },

  // Environment variables
  env: {
    SITE_URL: process.env.SITE_URL || 'https://www.ajithkumarr.com',
    AUTHOR_NAME: 'Ajithkumar',
    SITE_NAME: 'Ajithkumar - Tamil Writer & Full Stack Developer'
  },

  // Compiler options (SIMPLIFIED)
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Trailing slash consistency for SEO
  trailingSlash: false,
  
  // Generate ETags for better caching
  generateEtags: true,
  
  // Compress responses
  compress: true,
  
  // Power by header
  poweredByHeader: false
};

export default withPWA(nextConfig);