// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme/themeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/ui/ContactForm'
import SubscriptionModal from '@/components/ui/SubscriptionModal'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata = {
  metadataBase: new URL('https://www.ajithkumarr.com'),
  title: {
    default: 'Ajithkumar - Tamil Writer, Poet & Full Stack Developer',
    template: '%s | Ajithkumar'
  },
  description: 'Award-winning Tamil writer, poet, and full stack developer. Explore React.js tutorials, Tamil poetry, MERN stack projects, and published poetry books.',
  keywords: [
    'Ajithkumar',
    'Tamil writer',
    'Tamil poet',
    'Full stack developer',
    'React.js developer',
    'Next.js tutorials',
    'MERN stack',
    'Tamil poetry books',
    'JavaScript tutorials',
    'Node.js developer',
    'Tamil literature',
    'Contemporary Tamil poetry',
    'Tech blog Tamil',
    'React hooks tutorial',
    'MongoDB tutorials'
  ],
  authors: [{ 
    name: 'Ajithkumar',
    url: 'https://www.ajithkumarr.com/about'
  }],
  creator: 'Ajithkumar',
  publisher: 'Ajithkumar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.ajithkumarr.com',
    languages: {
      'en-US': 'https://www.ajithkumarr.com',
      'ta-IN': 'https://www.ajithkumarr.com/ta'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ajithkumarr.com',
    siteName: 'Ajithkumar',
    title: 'Ajithkumar - Tamil Writer, Poet & Full Stack Developer',
    description: 'Award-winning Tamil writer, poet, and full stack developer sharing technical insights and creative writings.',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajithkumar - Tamil Writer & Developer',
        type: 'image/jpeg'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajithkumar - Tamil Writer, Poet & Full Stack Developer',
    description: 'Award-winning Tamil writer, poet, and full stack developer sharing technical insights and creative writings.',
    images: ['/twitter-image.jpg'],
    creator: '@ajithkumarr',
    site: '@ajithkumarr'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    bing: process.env.BING_VERIFICATION
  },
  category: 'Technology & Literature',
  classification: 'Personal Website',
  referrer: 'origin-when-cross-origin'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a202c' }
  ]
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//vercel-insights.com" />
        <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
        
        {/* Manifest and icons */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1e40af" />
        
        {/* Meta tags for better SEO */}
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="application-name" content="Ajithkumar" />
        <meta name="apple-mobile-web-app-title" content="Ajithkumar" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Schema.org Organization markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://www.ajithkumarr.com/#identity",
              "name": "Ajithkumar",
              "alternateName": ["Ajith Kumar", "அஜித்குமார்"],
              "description": "Award-winning Tamil writer, poet, and full stack developer",
              "url": "https://www.ajithkumarr.com",
              "image": "https://www.ajithkumarr.com/images/ajithkumar-portrait.jpg",
              "sameAs": [
                "https://www.goodreads.com/author/show/ajithkumarr",
                "https://twitter.com/ajithkumarr",
                "https://www.instagram.com/ajithkumarr",
                "https://github.com/ajith2401",
                "https://linkedin.com/in/ajithkumarr"
              ],
              "jobTitle": ["Writer", "Poet", "Full Stack Developer", "Software Engineer"],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "knowsLanguage": ["Tamil", "English"],
              "nationality": {
                "@type": "Country",
                "name": "India"
              },
              "birthPlace": {
                "@type": "Place",
                "name": "Tamil Nadu, India"
              },
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Educational Institution"
              },
              "hasOccupation": [
                {
                  "@type": "Occupation",
                  "name": "Tamil Writer",
                  "description": "Published author of 5 Tamil poetry books"
                },
                {
                  "@type": "Occupation", 
                  "name": "Full Stack Developer",
                  "description": "Specializing in React.js, Node.js, and MERN stack development"
                }
              ],
              "award": [
                "Tamil Literature Recognition",
                "Poetry Publication Awards"
              ],
              "mainEntityOfPage": "https://www.ajithkumarr.com",
              "potentialAction": {
                "@type": "ContactAction",
                "target": "https://www.ajithkumarr.com/contact"
              }
            })
          }}
        />

        {/* Website schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.ajithkumarr.com/#website",
              "url": "https://www.ajithkumarr.com",
              "name": "Ajithkumar - Tamil Writer & Full Stack Developer",
              "description": "Award-winning Tamil writer, poet and full stack developer",
              "publisher": {
                "@type": "Person",
                "@id": "https://www.ajithkumarr.com/#identity"
              },
              "inLanguage": ["en-US", "ta-IN"],
              "copyrightYear": new Date().getFullYear(),
              "copyrightHolder": {
                "@type": "Person",
                "@id": "https://www.ajithkumarr.com/#identity"
              },
              "potentialAction": [{
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.ajithkumarr.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }],
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Technical Blog",
                    "url": "https://www.ajithkumarr.com/blog"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Tamil Poetry & Writings",
                    "url": "https://www.ajithkumarr.com/quill"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Developer Portfolio",
                    "url": "https://www.ajithkumarr.com/devfolio"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Published Books",
                    "url": "https://www.ajithkumarr.com/spotlight"
                  }
                ]
              }
            })
          }}
        />

        {/* Breadcrumb schema for navigation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.ajithkumarr.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Technical Blog",
                  "item": "https://www.ajithkumarr.com/blog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Tamil Poetry",
                  "item": "https://www.ajithkumarr.com/quill"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Projects Portfolio",
                  "item": "https://www.ajithkumarr.com/devfolio"
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "name": "Published Books",
                  "item": "https://www.ajithkumarr.com/spotlight"
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          {/* Skip to main content for accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
            Skip to main content
          </a>
          
          <Navbar />
          
          <main id="main-content" className="flex-1">
            {children}
          </main>
          
          <Footer />
          
          {/* Global components */}
          <ContactForm />
          <SubscriptionModal />
          
          {/* Analytics and performance monitoring */}
          <Analytics />
          <SpeedInsights />
          
          {/* Performance monitoring script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                    function sendToAnalytics(metric) {
                      if (window.gtag) {
                        window.gtag('event', metric.name, {
                          value: Math.round(metric.value),
                          event_label: metric.id,
                          non_interaction: true,
                        });
                      }
                    }
                    getCLS(sendToAnalytics);
                    getFID(sendToAnalytics);
                    getFCP(sendToAnalytics);
                    getLCP(sendToAnalytics);
                    getTTFB(sendToAnalytics);
                  });
                }
              `
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}