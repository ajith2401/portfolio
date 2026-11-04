// src/app/books/page.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  ShoppingBag,
  PenTool
} from 'lucide-react';
import PersonSchema from '@/components/schema/PersonSchema';
import connectDB from '@/lib/db';
import { Book } from '@/models';

export const metadata = {
  title: "Published Tamil Poetry Books by Ajithkumar R (அஜித்குமார் புத்தகங்கள்)",
  description: "Complete literary bibliography and portfolio of five published Tamil poetry books authored by Ajithkumar R, exploring social justice, feminism, identity, and human emotions.",
  keywords: [
    "Ajith Kumar published books",
    "Ajithkumar books",
    "Ajith Kumar Tamil poetry books",
    "Tamil poetry books Ajithkumar",
    "Ajith published books",
    "ஆண்டெனா மீதமர்ந்த காக்கை",
    "முற்றிய பிரியத்தின் வற்றாத துளி",
    "ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள்",
    "சிப்பிக்குள் சிந்தா மழை",
    "அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும்",
    "Tamil author Ajithkumar",
    "Ajithkumar poetry collection"
  ],
  alternates: {
    canonical: "https://www.ajithkumarr.com/books",
  },
  openGraph: {
    title: "Published Tamil Poetry Books by Ajithkumar R",
    description: "Explore the five published Tamil poetry books by Ajithkumar R — spanning themes of feminism, social justice, and contemporary human emotions.",
    url: "https://www.ajithkumarr.com/books",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197446/books/syxyyt3giwcoeq5m1wds.jpg",
        width: 1200,
        height: 630,
        alt: "Tamil Poetry Books by Ajithkumar R"
      }
    ],
    locale: "ta_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Published Tamil Poetry Books by Ajithkumar R",
    description: "Bibliography of five published Tamil poetry collections authored by Ajithkumar R.",
    images: ["https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197446/books/syxyyt3giwcoeq5m1wds.jpg"],
    creator: "@ajithkumarr"
  }
};

export const revalidate = 3600; // 1 hour

export default async function BooksPage() {
  await connectDB();
  const dbBooks = await Book.find({}).sort({ publishYear: -1 }).lean();

  const books = [
    {
      titleTamil: 'ஆண்டெனா மீதமர்ந்த காக்கை',
      transliteration: 'Antenna Meedhamarndha Kaakkai',
      year: '2021',
      publisher: 'மகிழினி பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197446/books/syxyyt3giwcoeq5m1wds.jpg',
      slug: 'ஆண்டெனா-மீதமர்ந்த-காக்கை',
      pageCount: 150,
      price: 120,
      description: 'A poignant poetry collection reflecting on modern isolation, urban existence, collective grief, and enduring human empathy. Examines how modern living fragments community bonds while highlighting our shared capacity for quiet compassion.',
      amazon: 'https://www.amazon.in/Antenna-Meedhamarndha-Kakkai-Vaanawill/dp/B0DCZVKSFZ',
      booksgrub: 'https://booksgrub.com/product/antenna-meedhamarndha-kakkai'
    },
    {
      titleTamil: 'முற்றிய பிரியத்தின் வற்றாத துளி',
      transliteration: 'Muttriya Piriyathin Vattratha Thuli',
      year: '2020',
      publisher: 'எழுத்து பிரசுரம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197444/books/udbuiab0gb3dpxxcqcpv.jpg',
      slug: 'முற்றிய-பிரியத்தின்-வற்றாத-துளி',
      pageCount: 120,
      price: 150,
      description: 'A tender exploration of unconditional love, silent longings, emotional vulnerabilities, and relational intimacy. Celebrates love that exists without possession or demand.'
    },
    {
      titleTamil: 'ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள்',
      transliteration: 'Oru Paithiyakaaranin Diary Kurippukal',
      year: '2019',
      publisher: 'நாடோடி பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197445/books/zfs94uaxu2wcfq9w5yha.jpg',
      slug: 'ஒரு-பைத்தியக்காரனின்-டைரிக்-குறிப்புகள்',
      pageCount: 110,
      price: 100,
      description: 'Introspective diary-verse examining nonconformist thinking, societal hypocrisy, and the search for authentic inner truth amidst a conforming world.'
    },
    {
      titleTamil: 'சிப்பிக்குள் சிந்தா மழை',
      transliteration: 'Chippikkul Sinthaa Mazhai',
      year: '2018',
      publisher: 'கரங்கள் பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197444/books/ev4w0dydp8e9k65m54r0.jpg',
      slug: 'சிப்பிக்குள்-சிந்தா-மழை',
      pageCount: 100,
      price: 100,
      description: 'Verses on quiet introspections, natural imagery, emotional resilience, and the inner sanctum of the human soul facing life’s transitions.'
    },
    {
      titleTamil: 'அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும்',
      transliteration: 'Anbudaiyavalukkum Anbukkuriyaavalukkum',
      year: '2017',
      publisher: 'விஜய பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197427/books/aznatozjb3eaqfavh3nb.jpg',
      slug: 'அன்புடையவளுக்கும்-அன்புக்குரியவளுக்கும்',
      pageCount: 96,
      price: 90,
      description: 'Debut poetry collection exploring interpersonal affections, heartfelt dedications, and the beginnings of a passionate literary exploration in Tamil verse.'
    }
  ];

  const bookListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Published Tamil Poetry Books by Ajithkumar R",
    "numberOfItems": books.length,
    "itemListElement": books.map((book, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Book",
        "name": `${book.titleTamil} (${book.transliteration})`,
        "author": {
          "@type": "Person",
          "@id": "https://www.ajithkumarr.com/#ajithkumar",
          "name": "Ajithkumar R"
        },
        "inLanguage": "ta",
        "datePublished": book.year,
        "publisher": book.publisher,
        "image": book.cover,
        "description": book.description,
        "url": `https://www.ajithkumarr.com/spotlight/${encodeURIComponent(book.slug)}`
      }
    }))
  };

  const faqs = [
    {
      question: "How many books has Ajithkumar R published?",
      answer: "Ajithkumar R has authored and published five Tamil poetry books: அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும் (2017), சிப்பிக்குள் சிந்தா மழை (2018), ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள் (2019), முற்றிய பிரியத்தின் வற்றாத துளி (2020), and ஆண்டெனா மீதமர்ந்த காக்கை (2021)."
    },
    {
      question: "Where can I buy or read Ajithkumar R's books?",
      answer: "His latest book 'Antenna Meedhamarndha Kaakkai' (ஆண்டெனா மீதமர்ந்த காக்கை) is available on Amazon India and BooksGrub. Other titles can be accessed via Tamil literary distributors and libraries, with sample poems available on the official website."
    },
    {
      question: "What are the major themes explored in Ajithkumar's books?",
      answer: "His books explore feminism, social justice, personal identity, existential solitude, emotional intimacy, human vulnerability, and the daily contradictions of contemporary Tamil life."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <main className="min-h-screen py-12 md:py-16">
      <PersonSchema includeFullBio={true} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-secondary flex items-center gap-2">
          <Link href="/" className="hover:text-accent-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Books</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary border border-color text-xs font-semibold text-accent-primary uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Complete Literary Bibliography</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Published Tamil Poetry Books by Ajithkumar R
          </h1>
          <p className="text-xl text-secondary max-w-3xl leading-relaxed">
            Five published poetry collections exploring feminism, social justice, quiet emotional truths, and contemporary human relationships in nuanced Tamil verse.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              5 Published Volumes (2017–2021)
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Tamil Literature (தமிழ் இலக்கியம்)
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Published with Recognized Tamil Houses
            </span>
          </div>
        </header>

        {/* Books Grid */}
        <section className="mb-16 space-y-8">
          <div className="space-y-8">
            {books.map((book) => (
              <article key={book.slug} className="modern-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className="relative w-full sm:w-48 aspect-[3/4] shrink-0 rounded-xl overflow-hidden bg-tertiary shadow-md mx-auto sm:mx-0">
                  <Image
                    src={book.cover}
                    alt={`${book.titleTamil} (${book.transliteration}) by Ajithkumar R`}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/80 text-xs font-bold text-foreground">
                    {book.year}
                  </span>
                </div>

                <div className="space-y-4 flex-grow">
                  <div>
                    <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">
                      {book.publisher} · Published {book.year}
                    </span>
                    <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mt-1">
                      {book.titleTamil}
                    </h2>
                    <p className="text-sm text-secondary-500 font-mono italic">
                      {book.transliteration}
                    </p>
                  </div>

                  <p className="text-secondary leading-relaxed text-sm md:text-base">
                    {book.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-y border-color/40 text-xs text-secondary">
                    <div>
                      <span className="text-secondary-400 block font-semibold">Language</span>
                      Tamil (தமிழ்)
                    </div>
                    <div>
                      <span className="text-secondary-400 block font-semibold">Pages</span>
                      {book.pageCount} Pages
                    </div>
                    <div>
                      <span className="text-secondary-400 block font-semibold">Format</span>
                      Paperback Poetry Book
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1 items-center">
                    <Link
                      href={`/spotlight/${encodeURIComponent(book.slug)}`}
                      className="modern-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                    >
                      Read Poems &amp; Book Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {book.amazon && (
                      <a
                        href={book.amazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modern-card px-4 py-2 rounded-xl text-sm text-foreground font-medium inline-flex items-center gap-1.5 hover:bg-card"
                      >
                        <ShoppingBag className="w-4 h-4 text-accent-primary" />
                        Buy on Amazon
                        <ExternalLink className="w-3 h-3 text-secondary" />
                      </a>
                    )}

                    {book.booksgrub && (
                      <a
                        href={book.booksgrub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modern-card px-4 py-2 rounded-xl text-sm text-foreground font-medium inline-flex items-center gap-1.5 hover:bg-card"
                      >
                        Buy on BooksGrub
                        <ExternalLink className="w-3 h-3 text-secondary" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section: Literary Philosophy & Related Areas */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-6">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Explore Beyond the Books
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="modern-card p-6 rounded-2xl space-y-3">
              <PenTool className="w-5 h-5 text-accent-primary" />
              <h3 className="font-playfair text-xl font-bold text-foreground">Writer Profile</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Read about Ajithkumar R&apos;s literary background, thematic pillars, essays, and writing philosophy.
              </p>
              <Link href="/writer" className="text-accent-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                Author Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="modern-card p-6 rounded-2xl space-y-3">
              <BookOpen className="w-5 h-5 text-accent-primary" />
              <h3 className="font-playfair text-xl font-bold text-foreground">The Quill Archive</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Search and read over 600 digital poems, aphorisms, and philosophical writeups written by Ajithkumar R.
              </p>
              <Link href="/quill" className="text-accent-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                Read on Quill <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="modern-card p-6 rounded-2xl space-y-3">
              <Sparkles className="w-5 h-5 text-accent-primary" />
              <h3 className="font-playfair text-xl font-bold text-foreground">Screenplay &amp; Film</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Explore how literary depth informs Ajithkumar R&apos;s original screenplays and independent filmmaking pursuits.
              </p>
              <Link href="/screenwriter" className="text-accent-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                Screenplay Work <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent-primary" />
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-xl modern-card space-y-2">
                <h3 className="font-bold text-foreground text-base">
                  {faq.question}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

