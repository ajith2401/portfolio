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
  buildExcludes: [/middleware-manifest\.json$/],
  customWorkerDir: 'worker'
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      '@/components', 
      '@/lib', 
      'lucide-react', 
      'next/image'
    ],
    serverComponentsExternalPackages: ['mongoose'],
    scrollRestoration: true,
    optimizeCss: true
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
    },
    // Redirect old blog URLs to new structure (when implementing slugs)
    {
      source: '/tech-blog/:path*',
      destination: '/blog/:path*',
      permanent: true,
    },
    {
      source: '/writings/:path*',
      destination: '/quill/:path*',
      permanent: true,
    },
    {
      source: '/portfolio/:path*',
      destination: '/devfolio/:path*',
      permanent: true,
    },
    {
      source: '/books/:path*',
      destination: '/spotlight/:path*',
      permanent: true,
    }
  ],

  // Rewrites for better URL structure
  rewrites: async () => [
    // Category pages
    {
      source: '/category/:category',
      destination: '/api/category/:category'
    },
    // Tag pages  
    {
      source: '/tag/:tag',
      destination: '/api/tag/:tag'
    },
    // Archive pages
    {
      source: '/archive/:year',
      destination: '/api/archive/:year'
    },
    // RSS feeds
    {
      source: '/feed.xml',
      destination: '/api/feed'
    },
    {
      source: '/blog/feed.xml',
      destination: '/api/feed/blog'
    },
    {
      source: '/quill/feed.xml',
      destination: '/api/feed/quill'
    }
  ],

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
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

    // Add bundle analyzer in development
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Optimize for production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
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

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Output configuration
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Trailing slash consistency for SEO
  trailingSlash: false,
  
  // Generate ETags for better caching
  generateEtags: true,
  
  // Compress responses
  compress: true,
  
  // Power by header
  poweredByHeader: false,
  
  // Disable x-powered-by for security
  httpAgentOptions: {
    keepAlive: true,
  }
};

export default withPWA(nextConfig);