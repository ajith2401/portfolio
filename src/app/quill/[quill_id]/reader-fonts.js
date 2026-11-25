// Tamil reading fonts, self-hosted by next/font at build time. Only loaded by the writing route.
import { Noto_Serif_Tamil, Noto_Sans_Tamil } from 'next/font/google';

export const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ['tamil', 'latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-reader-serif',
});

export const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil', 'latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-reader-sans',
});
