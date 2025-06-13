// src/app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/themeProvider";
import { Great_Vibes, Inter, Playfair_Display, Merriweather, DM_Sans, Work_Sans, Poppins } from 'next/font/google';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundVectors from "@/components/layout/BackgroundVectors";
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from "@vercel/speed-insights/next"
import OfflineNotice from "@/components/ui/OfflineNotice";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react"
import ReduxProvider from '@/components/providers/ReduxProvider'
import ContactForm from '@/components/ui/ContactForm'
import SubscriptionModal from "@/components/ui/form/SubscriptionModal";
// Initialize the fonts
const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['300', '400', '700', '900'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap', 
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL('https://www.ajithkumarr.com'),
  title: {
    default: "Ajithkumar |Full Stack Developer, Poet, Writer & Lyricist",
    template: "%s | Ajithkumar - Tamil Writer & MERN Developer"
  },
  description: "Ajithkumar - Published Tamil writer with 5 poetry books and Full Stack MERN Developer, exploring themes of feminism and social justice through captivating poetry while creating innovative web applications.",
  keywords: [
    "Ajithkumar writer", 
    "Tamil poet", 
    "Tamil literature", 
    "MERN stack developer",
    "Full stack developer",
    "Tamil poetry books",
    "published Tamil author",
    "feminist poetry", 
    "social justice poetry", 
    "web developer poet",
    "Tamil developer",
    "modern Tamil writer",
    "contemporary Tamil poetry",
    "Tamil poetry", 
    "Tamil writer", 
    "Indian poet", 
    "feminist poetry", 
    "social justice poetry", 
    "Tamil literature"
  ],
  authors: [{ 
    name: "Ajithkumar",
    url: "https://www.ajithkumarr.com"
  }],
  creator: "Ajithkumar",
  publisher: "Ajithkumar",
  alternates: {
    canonical: "/",
    languages: {
      'en-US': 'https://www.ajithkumarr.com',
      'ta-IN': 'https://www.ajithkumarr.com/ta'
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#0ea5e9'
      }
    ]
  },
  openGraph: {
    title: "Ajithkumar | Tamil Writer & Full Stack Developer",
    description: "Explore the work of Ajithkumar - published Tamil poet with 5 books who also creates innovative web applications as a Full Stack MERN Developer.",
    url: "https://www.ajithkumarr.com",
    siteName: "Ajithkumar - Full Stack Developer, Poet, Writer & Lyricist",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar - Full Stack Developer, Poet, Writer & Lyricist" 
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajithkumar |Full Stack Developer, Poet, Writer & Lyricist",
    description: "Explore the captivating Tamil poetry books and MERN stack projects of Ajithkumar - where literature meets technology.",
    images: ["/twitter-image.jpg"],
    creator: "@ajithkumarr"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  verification: {
    google: "ZQmUyyc_YFdaL87F16F0RyC5i2dRIYENA478ZwUSZx4",
    yandex: "your-yandex-verification-code",
    bing: "1234567890ABCDEF",
    yahoo: "1234567890ABCDEF"
  },
  appLinks: {
    ios: {
      url: "https://www.ajithkumarr.com/",
      app_store_id: "123456789"
    },
    android: {
      package: "com.ajithkumarr.app",
      app_name: "Ajithkumar"
    },
    web: {
      url: "https://www.ajithkumarr.com/",
      should_fallback: true
    }
  },
  category: "literature",
  other: {
    "pinterest": "nopin",
  },
  archives: [
    "https://www.ajithkumarr.com/archive/2024",
    "https://www.ajithkumarr.com/archive/2023",
    "https://www.ajithkumarr.com/archive/2022"
  ],
  bookmarks: ["https://www.ajithkumarr.com/featured"],
  links: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Ajithkumar RSS Feed',
      href: '/api/rss'
    },
    {
      rel: 'manifest',
      href: '/manifest.json'
    },
    {
      rel: 'author',
      href: '/about'
    },
    {
      rel: 'me',
      href: 'https://www.goodreads.com/author/show/ajithkumarr'
    }
  ],
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`
        ${greatVibes.variable} 
        ${inter.variable} 
        ${playfair.variable}
        ${geistSans.variable} 
        ${merriweather.variable}
        ${dmSans.variable}
        ${workSans.variable}
        ${poppins.variable}
      `}
    >
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
                <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://www.ajithkumarr.com/#identity",
              "name": "Ajithkumar",
              "alternateName": "Ajith Kumar",
              "givenName": "Ajith",
              "familyName": "Kumar",
              "description": "Award-winning Tamil writer, poet, and lyricist exploring themes of feminism, social justice, and human emotions through captivating poetry and creative works.",
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
                "name": "Self-Employed Writer"
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
                "name": "Your University Name"
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
      
              "mainEntityOfPage": "https://www.ajithkumarr.com"
            })
          }}
        />

        {/* Website organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.ajithkumarr.com/#website",
              "url": "https://www.ajithkumarr.com",
              "name": "Ajithkumar - Tamil Writer & Poet",
              "description": "Award-winning Tamil writer, poet and lyricist",
              "publisher": {
                "@type": "Person",
                "@id": "https://www.ajithkumarr.com/#identity"
              },
              "inLanguage": "en-US",
              "potentialAction": [{
                "@type": "SearchAction",
                "target": "https://www.ajithkumarr.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }]
            })
          }}
        />

        {/* BreadcrumbList schema for navigation */}
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
                  "name": "Poetry",
                  "item": "https://www.ajithkumarr.com/quill"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Technical Blog",
                  "item": "https://www.ajithkumarr.com/blog"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Books",
                  "item": "https://www.ajithkumarr.com/spotlight"
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "name": "About",
                  "item": "https://www.ajithkumarr.com/about"
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ReduxProvider>
          <ThemeProvider>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
                padding: '12px 16px'
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF'
                }
              }
            }}
          />
          <BackgroundVectors />
          <Navbar />
          <OfflineNotice />
          <main  id="main-content" className="w-full">
            <Providers>{children}</Providers>
          </main>
          <div className="w-full h-px bg-decorative-line opacity-20 my-6"></div>
          <Footer />
          <SubscriptionModal />

          <Analytics />
          <SpeedInsights />

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
        </ReduxProvider>
      </body>
    </html>
  )
}