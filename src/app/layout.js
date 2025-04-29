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
  metadataBase: new URL('https://ajithkumarr.com'),
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
      'en-US': 'https://ajithkumarr.com',
      'ta-IN': 'https://ajithkumarr.com/ta'
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
    url: "https://ajithkumarr.com",
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
      url: "https://ajithkumarr.com/",
      app_store_id: "123456789"
    },
    android: {
      package: "com.ajithkumarr.app",
      app_name: "Ajithkumar"
    },
    web: {
      url: "https://ajithkumarr.com/",
      should_fallback: true
    }
  },
  category: "literature",
  other: {
    "pinterest": "nopin",
  },
  archives: [
    "https://ajithkumarr.com/archive/2024",
    "https://ajithkumarr.com/archive/2023",
    "https://ajithkumarr.com/archive/2022"
  ],
  bookmarks: ["https://ajithkumarr.com/featured"],
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
        {/* Schema.org structured data for personal identity as a writer */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://ajithkumarr.com/#identity",
              "name": "Ajithkumar",
              "alternateName": "Ajith Kumar",
              "givenName": "Ajith",
              "familyName": "Kumar",
              "description": "Award-winning Tamil writer, poet, and lyricist exploring themes of feminism, social justice, and human emotions through captivating poetry and creative works.",
              "url": "https://ajithkumarr.com",
              "image": "https://ajithkumarr.com/images/ajithkumar-portrait.jpg",
              "sameAs": [
                "https://www.goodreads.com/author/show/ajithkumarr",
                "https://twitter.com/ajithkumarr",
                "https://www.instagram.com/ajithkumarr",
                "https://github.com/ajith2401"
              ],
              "jobTitle": "Writer and Poet",
              "worksFor": {
                "@type": "Organization",
                "name": "Self-Employed Writer"
              },
              "knowsLanguage": ["Tamil", "English"],
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Your University Name"
              },
              "award": [
                "Award 1",
                "Award 2"
              ],
              "mainEntityOfPage": "https://ajithkumarr.com"
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
              "@id": "https://ajithkumarr.com/#website",
              "url": "https://ajithkumarr.com",
              "name": "Ajithkumar - Tamil Writer & Poet",
              "description": "Award-winning Tamil writer, poet and lyricist",
              "publisher": {
                "@type": "Person",
                "@id": "https://ajithkumarr.com/#identity"
              },
              "inLanguage": "en-US",
              "potentialAction": [{
                "@type": "SearchAction",
                "target": "https://ajithkumarr.com/search?q={search_term_string}",
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
                  "item": "https://ajithkumarr.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Poetry",
                  "item": "https://ajithkumarr.com/quill"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Technical Blog",
                  "item": "https://ajithkumarr.com/blog"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Books",
                  "item": "https://ajithkumarr.com/spotlight"
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "name": "About",
                  "item": "https://ajithkumarr.com/about"
                }
              ]
            })
          }}
        />
      </head>

      <body className="min-h-screen transition-colors duration-300">
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
          <main className="w-full">
            <Providers>{children}</Providers>
          </main>
          <div className="w-full h-px bg-decorative-line opacity-20 my-6"></div>
          <Footer />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}