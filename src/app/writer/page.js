// src/app/writer/page.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  PenTool, 
  ArrowRight, 
  ExternalLink, 
  Feather, 
  CheckCircle2, 
  Library, 
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import PersonSchema from '@/components/schema/PersonSchema';

export const metadata = {
  title: "Ajithkumar R — Tamil Writer, Author & Published Poet (அஜித்குமார் எழுத்தாளர்)",
  description: "Official writer portfolio of Ajithkumar R. Published author of five Tamil poetry books exploring feminism, social justice, and contemporary human emotions.",
  keywords: [
    "Ajith writer",
    "Ajith Kumar writer",
    "Ajithkumar writer",
    "Ajith Kumar Tamil writer",
    "Ajithkumar Tamil author",
    "Ajith Kumar author",
    "Ajith Kumar poet",
    "Ajithkumar poet",
    "Tamil poet Ajithkumar",
    "Ajith Kumar literary works",
    "Ajith Kumar published books",
    "Ajith Kumar Tamil poetry",
    "அஜித்குமார் எழுத்தாளர்",
    "அஜித்குமார் கவிஞர்",
    "தமிழ் எழுத்தாளர் அஜித்குமார்",
    "தமிழ் கவிஞர் அஜித்குமார்"
  ],
  alternates: {
    canonical: "https://www.ajithkumarr.com/writer",
  },
  openGraph: {
    title: "Ajithkumar R — Tamil Writer & Published Poet",
    description: "Official writer and literary portfolio of Ajithkumar R — Author of 5 published Tamil poetry books exploring social realism and feminist themes.",
    url: "https://www.ajithkumarr.com/writer",
    type: "profile",
    images: [
      {
        url: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar R — Tamil Writer and Author"
      }
    ],
    locale: "ta_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajithkumar R — Tamil Writer & Published Poet",
    description: "Official author page of Ajithkumar R — Published Tamil author of five poetry collections.",
    images: ["https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg"],
    creator: "@ajithkumarr"
  }
};

export default function WriterPage() {
  const publishedBooks = [
    {
      titleTamil: 'ஆண்டெனா மீதமர்ந்த காக்கை',
      transliteration: 'Antenna Meedhamarndha Kaakkai',
      year: '2021',
      publisher: 'மகிழினி பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197446/books/syxyyt3giwcoeq5m1wds.jpg',
      slug: 'ஆண்டெனா-மீதமர்ந்த-காக்கை',
      description: 'Reflections on modern isolation, urban existence, collective grief, and enduring human empathy.',
      amazon: 'https://www.amazon.in/Antenna-Meedhamarndha-Kakkai-Vaanawill/dp/B0DCZVKSFZ'
    },
    {
      titleTamil: 'முற்றிய பிரியத்தின் வற்றாத துளி',
      transliteration: 'Muttriya Piriyathin Vattratha Thuli',
      year: '2020',
      publisher: 'எழுத்து பிரசுரம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197444/books/udbuiab0gb3dpxxcqcpv.jpg',
      slug: 'முற்றிய-பிரியத்தின்-வற்றாத-துளி',
      description: 'An exploration of unconditional affection, silent emotional yearnings, and relational intimacy.'
    },
    {
      titleTamil: 'ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள்',
      transliteration: 'Oru Paithiyakaaranin Diary Kurippukal',
      year: '2019',
      publisher: 'நாடோடி பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197445/books/zfs94uaxu2wcfq9w5yha.jpg',
      slug: 'ஒரு-பைத்தியக்காரனின்-டைரிக்-குறிப்புகள்',
      description: 'Introspective diary-verse examining nonconformist thinking, societal hypocrisy, and inner truth.'
    },
    {
      titleTamil: 'சிப்பிக்குள் சிந்தா மழை',
      transliteration: 'Chippikkul Sinthaa Mazhai',
      year: '2018',
      publisher: 'கரங்கள் பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197444/books/ev4w0dydp8e9k65m54r0.jpg',
      slug: 'சிப்பிக்குள்-சிந்தா-மழை',
      description: 'Verses on quiet introspection, nature, resilience, and the inner sanctum of the soul.'
    },
    {
      titleTamil: 'அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும்',
      transliteration: 'Anbudaiyavalukkum Anbukkuriyaavalukkum',
      year: '2017',
      publisher: 'விஜய பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197427/books/aznatozjb3eaqfavh3nb.jpg',
      slug: 'அன்புடையவளுக்கும்-அன்புக்குரியவளுக்கும்',
      description: 'Debut poetry collection exploring interpersonal affections, heartfelt dedications, and love.'
    }
  ];

  const faqs = [
    {
      question: "Who is Ajithkumar R the writer?",
      answer: "Ajithkumar R is an Indian Tamil writer, published author of five poetry books, and poet based in Bengaluru, Karnataka, India. His literary work spans modern Tamil poetry, philosophical essays, short stories, and song lyrics exploring feminism, social justice, and emotional intimacy."
    },
    {
      question: "What books has Ajithkumar R published?",
      answer: "Ajithkumar R has published five Tamil poetry collections: அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும் (2017), சிப்பிக்குள் சிந்தா மழை (2018), ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள் (2019), முற்றிய பிரியத்தின் வற்றாத துளி (2020), and ஆண்டெனா மீதமர்ந்த காக்கை (2021)."
    },
    {
      question: "Is Ajithkumar R the writer related to actor Ajith Kumar?",
      answer: "No. Ajithkumar R is an independent Tamil author, poet, screenwriter, and software engineer based in Bengaluru. He is entirely distinct from Tamil cinema actor Ajith Kumar and Malayalam film director B. Ajithkumar."
    },
    {
      question: "Where can I read Ajithkumar R's Tamil writings online?",
      answer: "You can read over 600 poems, philosophical articles, and short writings directly on his official website's Quill section at https://www.ajithkumarr.com/quill."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-secondary flex items-center gap-2">
          <Link href="/" className="hover:text-accent-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Writer</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary border border-color text-xs font-semibold text-accent-primary uppercase tracking-wider">
            <PenTool className="w-3.5 h-3.5" />
            <span>Tamil Author &amp; Literary Portfolio</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Ajithkumar R. — Tamil Writer, Author &amp; Poet
          </h1>
          <p className="text-xl text-secondary max-w-3xl leading-relaxed">
            Published author of five Tamil poetry books, essayist, and lyricist examining social justice, feminism, existential solitude, and the quiet contradictions of contemporary life.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              5 Published Collections
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Over 600 Digital Poems &amp; Essays
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Tamil Song Lyrics
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Screenplays in Development
            </span>
          </div>
        </header>

        {/* Section: Literary Biography & Themes */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-6">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Literary Background &amp; Writing Philosophy
          </h2>
          <div className="prose dark:prose-invert max-w-none text-secondary space-y-4 leading-relaxed">
            <p>
              Ajithkumar R began writing Tamil poetry and reflective prose as a way of paying close attention to human experiences that are frequently overlooked. Rooted in the rich traditions of contemporary Tamil literature, his verses depart from flowery abstraction to confront everyday psychological and social realities.
            </p>
            <p>
              His work is characterized by three core thematic pillars:
            </p>
            <div className="grid md:grid-cols-3 gap-4 pt-2 not-prose">
              <div className="p-5 rounded-xl modern-card space-y-2">
                <h3 className="font-bold text-foreground text-base">Feminism &amp; Equality</h3>
                <p className="text-sm text-secondary">
                  Critiquing patriarchal conditioning, domestic expectations, and celebrating the agency and emotional sovereignty of women.
                </p>
              </div>
              <div className="p-5 rounded-xl modern-card space-y-2">
                <h3 className="font-bold text-foreground text-base">Social Realism &amp; Labour</h3>
                <p className="text-sm text-secondary">
                  Reflecting the struggles of the working class, marginalized voices, and systemic injustices embedded in everyday routines.
                </p>
              </div>
              <div className="p-5 rounded-xl modern-card space-y-2">
                <h3 className="font-bold text-foreground text-base">Intimacy &amp; Loneliness</h3>
                <p className="text-sm text-secondary">
                  Investigating unreciprocated longings, the beauty of silence, and love liberated from possessiveness and societal guilt.
                </p>
              </div>
            </div>
            <p>
              For Ajithkumar, literature is not merely self-expression — it is a conscious instrument for questioning the familiar and discovering compassionate clarity amidst modern chaos.
            </p>
          </div>
        </section>

        {/* Section: Published Books */}
        <section className="mb-16 border-t border-color/40 pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                Five Published Tamil Poetry Books
              </h2>
              <p className="text-sm text-secondary mt-1">
                Authored by Ajithkumar R between 2017 and 2021
              </p>
            </div>
            <Link
              href="/books"
              className="text-accent-primary text-sm font-semibold hover:underline inline-flex items-center gap-1"
            >
              View Books Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedBooks.map((book) => (
              <article key={book.slug} className="modern-card rounded-2xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative w-full aspect-[3/4] bg-tertiary">
                    <Image
                      src={book.cover}
                      alt={`${book.titleTamil} — Book by Ajithkumar R`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/80 text-xs font-semibold text-foreground">
                      {book.year}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-xs text-accent-primary font-medium">{book.publisher}</span>
                    <h3 className="font-playfair text-lg font-bold text-foreground">{book.titleTamil}</h3>
                    <p className="text-xs text-secondary-500 font-mono italic">{book.transliteration}</p>
                    <p className="text-xs text-secondary line-clamp-3 pt-1">{book.description}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 border-t border-color/30 mt-3 flex justify-between items-center text-xs">
                  <Link href={`/spotlight/${encodeURIComponent(book.slug)}`} className="text-accent-primary font-semibold hover:underline">
                    Read Excerpt &amp; Info →
                  </Link>
                  {book.amazon && (
                    <a href={book.amazon} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-foreground">
                      Amazon
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section: Quill Archive Integration */}
        <section className="mb-16 border-t border-color/40 pt-10">
          <div className="p-8 rounded-2xl bg-tertiary/40 border border-color flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-primary">Digital Literary Archive</span>
              <h2 className="font-playfair text-2xl font-bold text-foreground">
                Explore Over 600+ Writings on Quill
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                Dive into an extensive searchable archive of original Tamil poetry, aphorisms, essays, and creative notes written across over a decade.
              </p>
            </div>
            <Link
              href="/quill"
              className="modern-btn whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
            >
              Browse Quill Archive
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Section: Connection to Screenwriting & Film */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-4">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            From Poetry to Cinema: Screenwriting &amp; Direction
          </h2>
          <p className="text-secondary leading-relaxed">
            In addition to published poetry, Ajithkumar R actively applies his literary sensibilities to screenwriting and independent filmmaking. His writing process bridges literary depth with visual economy, crafting character-driven screenplays that respect dialogue authenticity and visual subtext.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/screenwriter"
              className="text-accent-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              Explore Screenwriter Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-secondary-400">·</span>
            <Link
              href="/filmmaker"
              className="text-accent-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              Explore Filmmaking Pursuits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Section: Frequently Asked Questions (AEO Optimized) */}
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

        {/* Contact / Collaboration Callout */}
        <footer className="border-t border-color/40 pt-10 text-center space-y-4">
          <h2 className="font-playfair text-2xl font-bold text-foreground">
            Connect for Literary Readings, Talks or Publications
          </h2>
          <p className="text-sm text-secondary max-w-lg mx-auto">
            Open to literary discussions, publishing inquiries, poetry recitals, and creative writing collaborations.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="modern-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm"
            >
              Contact Ajithkumar R
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}

