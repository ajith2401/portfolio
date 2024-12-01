// src/app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/themeProvider";
import { Great_Vibes, Inter, Playfair_Display } from 'next/font/google';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundVectors from "@/components/layout/BackgroundVectors";

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
  title: "Ajithkumar",
  description: "Ajithkumar's portfolio",
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
        ${geistMono.variable}
      `}
    >
      <ThemeProvider>
      <body className="items-center justify-items-center bg-background">
      <BackgroundVectors />
      <Navbar/>
      {children} 
      <Footer/>
      </body>
      </ThemeProvider> 
    </html>
  );
}