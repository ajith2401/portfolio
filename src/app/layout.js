// src/app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/themeProvider";
import { Great_Vibes, Inter, Playfair_Display, Merriweather, DM_Sans, Work_Sans, Poppins } from 'next/font/google';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundVectors from "@/components/layout/BackgroundVectors";
import { Toaster } from 'react-hot-toast';

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
  metadataBase: new URL('https://ajithkumar.com'), // Replace with your actual domain
  title: {
    default: "Ajithkumar | Poet, Writer & Lyricist",
    template: "%s | Ajithkumar"
  },
  description: "Poet, writer, and lyricist exploring themes of feminism, social justice, and human emotions through Tamil poetry and creative works.",
  keywords: ["Tamil poetry", "Tamil writer", "Indian poet", "feminist poetry", "social justice poetry", "Tamil literature"],
  authors: [{ name: "Ajithkumar" }],
  creator: "Ajithkumar",
  publisher: "Ajithkumar",
  alternates: {
    canonical: "/"
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
  },
  openGraph: {
    title: "Ajithkumar | Poet, Writer & Lyricist",
    description: "Explore the creative projects, poetic works, and writings  of Ajithkumar - Tamil poet, writer and lyricist.",
    url: "https://ajithkumar.com",
    siteName: "Ajithkumar Portfolio",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar -Full stack developer, Poet, Writer & Lyricist"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajithkumar | Poet, Writer & Lyricist",
    description: "Explore the creative projects, poetic works and writings of Ajithkumar.",
    images: ["/twitter-image.jpg"], // Create a specific Twitter image (1200x628px)
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
    yandex: "your-yandex-verification-code"  // Replace with your actual Yandex code if you have one
  }
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
          <main className="w-full">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}