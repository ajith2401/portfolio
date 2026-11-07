'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail, 
  BookOpen, 
  Film, 
  Clapperboard, 
  PenTool, 
  Code2, 
  Award, 
  ExternalLink, 
  ChevronDown, 
  Sparkles,
  MapPin,
  CheckCircle2,
  FileText
} from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';
import PersonSchema from '@/components/schema/PersonSchema';
import DeveloperSchema from '@/components/schema/DeveloperSchema';
import TechnicalKeywords from '@/components/SEO/TechnicalKeywords';

export default function HomePage() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const openContactForm = () => setIsContactFormOpen(true);

  const scrollToContent = () => {
    const section = document.getElementById('about-entity-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = document.querySelector('.profile-image-container');
      if (!container) return;

      const { left, top, width, height } = container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const rotateX = ((y - height / 2) / height) * 5;
      const rotateY = ((x - width / 2) / width) * -5;
      
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      const container = document.querySelector('.profile-image-container');
      if (!container) return;
      container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    const container = document.querySelector('.profile-image-container');
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const publishedBooks = [
    {
      titleTamil: 'ஆண்டெனா மீதமர்ந்த காக்கை',
      transliteration: 'Antenna Meedhamarndha Kaakkai',
      year: '2021',
      publisher: 'மகிழினி பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197446/books/syxyyt3giwcoeq5m1wds.jpg',
      slug: 'ஆண்டெனா-மீதமர்ந்த-காக்கை',
      description: 'A poignant poetry collection reflecting on modern isolation, urban existence, collective grief, and enduring human empathy.',
      amazon: 'https://www.amazon.in/Antenna-Meedhamarndha-Kakkai-Vaanawill/dp/B0DCZVKSFZ'
    },
    {
      titleTamil: 'முற்றிய பிரியத்தின் வற்றாத துளி',
      transliteration: 'Muttriya Piriyathin Vattratha Thuli',
      year: '2020',
      publisher: 'எழுத்து பிரசுரம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197444/books/udbuiab0gb3dpxxcqcpv.jpg',
      slug: 'முற்றிய-பிரியத்தின்-வற்றாத-துளி',
      description: 'A tender exploration of unconditional love, silent longings, emotional vulnerabilities, and relational intimacy.'
    },
    {
      titleTamil: 'ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள்',
      transliteration: 'Oru Paithiyakaaranin Diary Kurippukal',
      year: '2019',
      publisher: 'நாடோடி பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197445/books/zfs94uaxu2wcfq9w5yha.jpg',
      slug: 'ஒரு-பைத்தியக்காரனின்-டைரிக்-குறிப்புகள்',
      description: 'Introspective diary-verse examining nonconformist thinking, societal hypocrisy, and the search for authentic inner truth.'
    },
    {
      titleTamil: 'சிப்பிக்குள் சிந்தா மழை',
      transliteration: 'Chippikkul Sinthaa Mazhai',
      year: '2018',
      publisher: 'கரங்கள் பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197444/books/ev4w0dydp8e9k65m54r0.jpg',
      slug: 'சிப்பிக்குள்-சிந்தா-மழை',
      description: 'Verses reflecting on quiet introspections, nature, emotional resilience, and the inner sanctum of the human soul.'
    },
    {
      titleTamil: 'அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும்',
      transliteration: 'Anbudaiyavalukkum Anbukkuriyaavalukkum',
      year: '2017',
      publisher: 'விஜய பதிப்பகம்',
      cover: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741197427/books/aznatozjb3eaqfavh3nb.jpg',
      slug: 'அன்புடையவளுக்கும்-அன்புக்குரியவளுக்கும்',
      description: 'Debut poetry collection exploring interpersonal affections, heartfelt dedications, and the beginnings of a literary journey.'
    }
  ];

  return (
    <>
      {/* Entity Schemas */}
      <PersonSchema includeFullBio={true} />
      <DeveloperSchema includedSkills={[
        'Full Stack Development',
        'MERN Stack',
        'React.js',
        'Next.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'TypeScript',
        'Applied AI & Automation'
      ]} />
      <TechnicalKeywords />

      {/* SECTION 1: Introduction / Hero (Personal Identity) */}
      <header className="min-h-[calc(100vh-80px)] flex flex-col justify-between py-8 md:py-12 border-b border-color/40">
        <div className="container mx-auto px-4 flex-grow flex items-center">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Disambiguation Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary border border-color text-xs md:text-sm text-secondary font-medium">
                <MapPin className="w-3.5 h-3.5 text-accent-primary" />
                <span>Ajithkumar R · Bengaluru, Karnataka, India</span>
              </div>

              {/* H1 Heading */}
              <div className="space-y-3">
                <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
                  Ajithkumar R. — <span className="text-accent-primary">Tamil Writer</span>, Poet, Screenwriter &amp; Filmmaker
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-secondary font-medium leading-relaxed">
                  Published Tamil author of five poetry books, writing original stories and screenplays, developing independent filmmaking projects, and working across creative and technology domains.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2 items-center">
                <button
                  onClick={openContactForm}
                  className="modern-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
                  aria-label="Contact Ajithkumar R"
                >
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/writer"
                  className="modern-card px-5 py-3 rounded-xl hover:-translate-y-1 transition-all text-foreground font-medium inline-flex items-center gap-2"
                >
                  <PenTool className="w-4 h-4 text-accent-primary" />
                  Writer Profile
                </Link>

                <Link
                  href="/screenwriter"
                  className="modern-card px-5 py-3 rounded-xl hover:-translate-y-1 transition-all text-foreground font-medium inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-accent-primary" />
                  Screenplay Work
                </Link>

                <Link
                  href="/filmmaker"
                  className="modern-card px-5 py-3 rounded-xl hover:-translate-y-1 transition-all text-foreground font-medium inline-flex items-center gap-2"
                >
                  <Film className="w-4 h-4 text-accent-primary" />
                  Filmmaking
                </Link>

                <div className="flex gap-2 text-accent-primary">
                  <a
                    href="https://github.com/ajith2401"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modern-card p-3 rounded-xl hover:-translate-y-1 transition-all hover:bg-card"
                    aria-label="Ajithkumar on GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ajithkumar-r-a6531a232/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modern-card p-3 rounded-xl hover:-translate-y-1 transition-all hover:bg-card"
                    aria-label="Ajithkumar on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <button
                    onClick={openContactForm}
                    className="modern-card p-3 rounded-xl hover:-translate-y-1 transition-all hover:bg-card"
                    aria-label="Email Ajithkumar"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Core Credentials Badges */}
              <div className="pt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-tertiary text-foreground border border-color">
                  5 Published Poetry Books
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-tertiary text-foreground border border-color">
                  Original Screenplays in Development
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-tertiary text-foreground border border-color">
                  Independent Film Vision
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-tertiary text-foreground border border-color">
                  Full Stack MERN Developer
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-tertiary text-foreground border border-color">
                  Anthropic Claude Certified Architect (CCA-F)
                </span>
              </div>
            </div>

            {/* Right Profile Image */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div 
                className="profile-image-container relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 overflow-hidden rounded-2xl border-4 border-card shadow-2xl transition-transform duration-300"
                style={{ transform: 'perspective(1000px)' }}
              >
                <Image 
                  src="https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg"
                  alt="Ajithkumar R — Tamil Writer, Poet, Screenwriter and Filmmaker"
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover"
                  onLoad={() => setIsImageLoaded(true)}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="w-full flex justify-center pt-8">
          <button
            onClick={scrollToContent}
            className="flex flex-col items-center text-secondary hover:text-accent-primary transition-colors"
            aria-label="Scroll to explore all sections"
          >
            <span className="text-xs uppercase tracking-wider font-medium mb-1">Explore Identity &amp; Work</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-accent-primary" />
          </button>
        </div>
      </header>

      {/* SECTION 2: About Ajithkumar R. (Entity Definition & Disambiguation) */}
      <section id="about-entity-section" className="py-16 md:py-20 border-b border-color/40 bg-card/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Entity Profile &amp; Disambiguation</span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              About Ajithkumar R. — Literary Voice &amp; Creative Vision
            </h2>
            <p className="text-lg text-secondary leading-relaxed">
              Ajithkumar R is an Indian Tamil writer, poet, screenwriter, independent filmmaker, and Full Stack software developer based in Bengaluru, Karnataka, India. Born with a deep passion for Tamil literature, his published poetry explores social justice, feminism, human vulnerability, and the contradictions of everyday life.
            </p>
            <div className="p-5 rounded-xl bg-tertiary/60 border border-color space-y-2">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                Clear Disambiguation for Readers &amp; Search Engines
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                Ajithkumar R is a distinct personal entity. He is <strong className="text-foreground">not</strong> Tamil cinema actor Ajith Kumar (Thala), nor is he Malayalam film editor and director B. Ajithkumar (FTII alumnus) or Malayalam author P. Ajith Kumar. This website (<code className="text-xs font-mono text-accent-primary">https://www.ajithkumarr.com</code>) is the official first-party digital home representing Ajithkumar R&apos;s literary books, original screenplays, independent filmmaking pursuits, and software engineering work.
              </p>
            </div>
            <div className="flex gap-4 pt-2">
              <Link 
                href="/about" 
                className="text-accent-primary font-medium hover:underline inline-flex items-center gap-1.5"
              >
                Read full biography &amp; credentials
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: Featured Portfolios & Works (Quick Link Previews) */}
      <section id="featured-portfolios" className="py-14 border-b border-color/40 bg-background/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-accent-primary text-xs font-semibold tracking-wider uppercase mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Core Portfolios &amp; Hubs</span>
              </div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                Featured Works &amp; Creative Portfolios
              </h2>
            </div>
            <p className="text-sm text-secondary max-w-md">
              Quick access to published literature, technical software engineering projects, screenwriting drafts, and long-form writings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Quill */}
            <Link href="/quill" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-2xl">
              <div className="modern-card p-6 rounded-2xl h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover border border-color/60 hover:border-accent-primary/50 relative overflow-hidden bg-card/60">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent-primary transition-colors">
                    Tamil Poetry Collection
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    Explore 600+ curated Tamil poems, reflections, and social commentaries addressing feminism, human emotion, and freedom.
                  </p>
                </div>
                <div className="relative z-10 pt-4 mt-auto">
                  <span className="inline-flex items-center text-accent-primary text-xs font-semibold tracking-wide group-hover:translate-x-1 transition-transform">
                    Browse Quill Writings
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Books / Spotlight */}
            <Link href="/books" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-2xl">
              <div className="modern-card p-6 rounded-2xl h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover border border-color/60 hover:border-accent-primary/50 relative overflow-hidden bg-card/60">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent-primary transition-colors">
                    Published Books
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    5 published Tamil poetry volumes in print, exploring urban existence, tender intimacy, grief, and societal reflections.
                  </p>
                </div>
                <div className="relative z-10 pt-4 mt-auto">
                  <span className="inline-flex items-center text-accent-primary text-xs font-semibold tracking-wide group-hover:translate-x-1 transition-transform">
                    View Published Books
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 3: Devfolio */}
            <Link href="/devfolio" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-2xl">
              <div className="modern-card p-6 rounded-2xl h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover border border-color/60 hover:border-accent-primary/50 relative overflow-hidden bg-card/60">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent-primary transition-colors">
                    Developer Portfolio
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    Full Stack engineering projects, MERN stack web apps, Next.js systems, and Claude Architect AI tools.
                  </p>
                </div>
                <div className="relative z-10 pt-4 mt-auto">
                  <span className="inline-flex items-center text-accent-primary text-xs font-semibold tracking-wide group-hover:translate-x-1 transition-transform">
                    Explore DevFolio Projects
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 4: Screenwriter & Filmmaker */}
            <Link href="/screenwriter" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-2xl">
              <div className="modern-card p-6 rounded-2xl h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover border border-color/60 hover:border-accent-primary/50 relative overflow-hidden bg-card/60">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold">
                    <Film className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent-primary transition-colors">
                    Screenplay &amp; Cinema
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    Narrative film screenplays, character-driven scripts, directorial treatments, and visual storytelling craft.
                  </p>
                </div>
                <div className="relative z-10 pt-4 mt-auto">
                  <span className="inline-flex items-center text-accent-primary text-xs font-semibold tracking-wide group-hover:translate-x-1 transition-transform">
                    Explore Screenplays &amp; Films
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: Tamil Writer & Published Author */}
      <section className="py-16 md:py-20 border-b border-color/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
                <PenTool className="w-4 h-4" />
                <span>Tamil Literature &amp; Poetry</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                Tamil Writer &amp; Published Author (அஜித்குமார் எழுத்தாளர்)
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                As a published Tamil author, Ajithkumar R writes poetry, essays, short stories, and song lyrics that challenge conventional norms and pay close attention to the human condition. His writing engages deeply with feminist perspectives, systemic social equality, love without ownership, and quiet psychological truths.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl modern-card space-y-2">
                  <h4 className="font-bold text-foreground">Poetry &amp; Social Realism</h4>
                  <p className="text-sm text-secondary">
                    Over five collections of modern verse addressing societal hypocrisies, human relationships, and emotional honesty.
                  </p>
                </div>
                <div className="p-4 rounded-xl modern-card space-y-2">
                  <h4 className="font-bold text-foreground">Essays &amp; Short Stories</h4>
                  <p className="text-sm text-secondary">
                    Reflective prose and narratives exploring contemporary Tamil life, identity, and personal philosophies.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/writer"
                  className="modern-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
                >
                  Explore Writer Portfolio &amp; Philosophy
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="modern-card p-6 rounded-2xl space-y-4">
                <h3 className="font-playfair text-xl font-bold text-foreground">Literary Highlights</h3>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                    <span><strong>5 Published Books:</strong> Published with recognized Tamil literary houses including Magizhini, Ezhuthu, Naadodi, Karangal, and Vijaya Pathippagam.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                    <span><strong>Online Archive (Quill):</strong> An open sanctuary of over 600 poems, essays, and reflective thoughts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                    <span><strong>Musical Collaborations:</strong> Lyricist for original Tamil musical compositions including நாளும் புதிது, தாலாட்டு, and அன்பின் கீர்த்தனை.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Published Poetry Books */}
      <section className="py-16 md:py-20 border-b border-color/40 bg-card/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Published Literary Bibliography</span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Published Tamil Poetry Books
            </h2>
            <p className="text-secondary text-base md:text-lg">
              Explore the five published Tamil poetry books authored by Ajithkumar R, traversing love, existential loneliness, feminism, and social justice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedBooks.map((book) => (
              <article key={book.slug} className="modern-card rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-card-hover transition-all group">
                <div>
                  <div className="relative w-full aspect-[3/4] bg-tertiary overflow-hidden">
                    <Image
                      src={book.cover}
                      alt={`${book.titleTamil} (${book.transliteration}) — Poetry Book by Ajithkumar R`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-semibold text-foreground">
                      {book.year}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-xs font-medium text-accent-primary">
                      {book.publisher}
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-foreground group-hover:text-accent-primary transition-colors">
                      {book.titleTamil}
                    </h3>
                    <p className="text-xs text-secondary-500 font-mono italic">
                      {book.transliteration}
                    </p>
                    <p className="text-sm text-secondary line-clamp-3 pt-1">
                      {book.description}
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-color/30 mt-4">
                  <Link
                    href={`/spotlight/${encodeURIComponent(book.slug)}`}
                    className="text-xs font-semibold text-accent-primary hover:underline inline-flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {book.amazon && (
                    <a
                      href={book.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-secondary hover:text-foreground inline-flex items-center gap-1"
                    >
                      Amazon <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/books"
              className="modern-btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
            >
              Browse Complete Books Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: Screenwriter & Story Writer */}
      <section className="py-16 md:py-20 border-b border-color/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="modern-card p-6 md:p-8 rounded-2xl space-y-4 bg-tertiary/40">
                <Clapperboard className="w-8 h-8 text-accent-primary" />
                <h3 className="font-playfair text-2xl font-bold text-foreground">
                  Storytelling Philosophy
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  &ldquo;A compelling screenplay does not begin with spectacle — it begins with an honest conflict, unvarnished human vulnerability, and characters whose desires collide with their moral convictions.&rdquo;
                </p>
                <div className="pt-2 border-t border-color/40 text-xs text-secondary space-y-1">
                  <div><strong>Focus Areas:</strong> Character Arcs, Moral Dilemmas, Dialogue Realism</div>
                  <div><strong>Language:</strong> Tamil (Tamil Nadu Cultural Grounding)</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
                <FileText className="w-4 h-4" />
                <span>Screenplay &amp; Narrative Craft</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                Screenwriter &amp; Story Writer (அஜித்குமார் திரைக்கதை எழுத்தாளர்)
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                Transitioning literary insight onto the cinematic canvas, Ajithkumar R develops original story concepts, treatments, and screenplays. His writing focuses on realistic conversational rhythms, socio-political undercurrents, and emotionally resonant narratives set across Tamil Nadu.
              </p>
              <div className="space-y-3 text-sm text-secondary">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                  <span><strong>Social Drama &amp; Realism:</strong> Stories exploring personal struggles against rigid societal expectations.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                  <span><strong>Psychological &amp; Relationship Dramas:</strong> Examining silence, guilt, intimacy, and unspoken tensions.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                  <span><strong>Short &amp; Feature Scripts:</strong> Developing structured treatments and full-length drafts ready for collaborative review.</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/screenwriter"
                  className="modern-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
                >
                  View Screenwriter Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Filmmaking & Directorial Pursuits */}
      <section className="py-16 md:py-20 border-b border-color/40 bg-card/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
                <Film className="w-4 h-4" />
                <span>Direction &amp; Visual Cinema</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                Filmmaking &amp; Directorial Pursuits (அஜித்குமார் இயக்குநர்)
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                Ajithkumar R approaches filmmaking as an extension of poetic observation: how framing, lighting, pauses, and soundscapes reveal truths that words cannot utter. His directorial pursuits are focused on independent cinema development, exploring human struggles with emotional authenticity.
              </p>
              <div className="p-4 rounded-xl bg-tertiary/40 border border-color text-sm text-secondary">
                <strong className="text-foreground">Transparency on Projects:</strong> Rather than claiming commercial film credits that do not exist, Ajithkumar is actively developing independent projects, short films, and feature treatments. He welcomes collaborations with producers, directors of photography, and independent crews.
              </div>
              <div className="pt-2">
                <Link
                  href="/filmmaker"
                  className="modern-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
                >
                  Explore Directorial Vision &amp; Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="modern-card p-6 rounded-2xl space-y-4">
                <h4 className="font-playfair text-xl font-bold text-foreground">Directorial Pillars</h4>
                <div className="space-y-3 text-sm text-secondary">
                  <div>
                    <h5 className="font-bold text-foreground">1. Visual Poetics</h5>
                    <p>Using imagery, spatial framing, and lighting to echo the emotional state of characters.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">2. Authentic Dialogue</h5>
                    <p>Rooted in real Tamil dialects and cultural nuances, avoiding synthetic exposition.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">3. Social Sensitivity</h5>
                    <p>Treating complex human experiences and marginal voices with dignity and depth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Film Projects & Creative Work in Development */}
      <section className="py-16 md:py-20 border-b border-color/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Film Projects &amp; Creative Works in Development
            </h2>
            <p className="text-secondary text-base md:text-lg">
              Current narrative treatments, short-film concepts, and original feature-length screenplays currently being crafted.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="modern-card p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary">
                  Feature Screenplay Treatment
                </span>
                <h3 className="font-playfair text-xl font-bold text-foreground mt-3">
                  The Burden of Silence (மௌனத்தின் பாரம்)
                </h3>
                <p className="text-sm text-secondary mt-2">
                  A character-driven family drama exploring generational communication gaps, emotional inheritance, and personal redemption in an urban Tamil household.
                </p>
              </div>
              <div className="text-xs text-secondary-500 pt-3 border-t border-color/40">
                Status: Script Draft Complete · Open for Producer Discussion
              </div>
            </div>

            <div className="modern-card p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary">
                  Independent Short Film
                </span>
                <h3 className="font-playfair text-xl font-bold text-foreground mt-3">
                  Antenna on the Wall (சுவர் மீதொரு ஆண்டெனா)
                </h3>
                <p className="text-sm text-secondary mt-2">
                  A poetic short film narrative adapted from themes of existential isolation in modern small towns, focusing on one man&apos;s daily relationship with memory.
                </p>
              </div>
              <div className="text-xs text-secondary-500 pt-3 border-t border-color/40">
                Status: Pre-Production &amp; Location Scouting
              </div>
            </div>

            <div className="modern-card p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary">
                  Musical Short / Visual Poem
                </span>
                <h3 className="font-playfair text-xl font-bold text-foreground mt-3">
                  Nalum Puthithu Visual Journey (நாளும் புதிது)
                </h3>
                <p className="text-sm text-secondary mt-2">
                  A visual music poetry piece combining original lyric composition with evocative cinematography exploring dawn, hope, and new beginnings.
                </p>
              </div>
              <div className="text-xs text-secondary-500 pt-3 border-t border-color/40">
                Status: Musical Track Released · Visual Treatment in Progress
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Selected Writing and Literary Publications (Quill Highlight) */}
      <section className="py-16 md:py-20 border-b border-color/40 bg-card/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
                <BookOpen className="w-4 h-4" />
                <span>The Quill Writing Archive</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                Selected Writings, Poems &amp; Philosophical Essays
              </h2>
              <p className="text-secondary text-base md:text-lg leading-relaxed">
                Browse through an extensive, searchable digital collection of Tamil poetry, philosophical writeups, social critiques, and reflective verses published directly by Ajithkumar R.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Philosophy (தத்துவம்)', 'Poem (கவிதை)', 'Article (கட்டுரை)', 'Short Story', 'Social Realism', 'Love & Loneliness'].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs bg-tertiary text-foreground border border-color">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 text-lg-right">
              <Link
                href="/quill"
                className="modern-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
              >
                Read All Writings on Quill
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Technology & Software Engineering */}
      <section className="py-16 md:py-20 border-b border-color/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
                <Code2 className="w-4 h-4" />
                <span>Software Engineering &amp; AI</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                Full Stack Developer &amp; Claude Certified Architect
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                Balancing literary intuition with technical rigour, Ajithkumar R builds scalable web applications, API microservices, and AI-powered systems. Specialising in the MERN stack (MongoDB, Express, React, Node.js), TypeScript, and Next.js.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl modern-card space-y-1">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent-primary" />
                    Claude Certified Architect – Foundations (CCA-F)
                  </h4>
                  <p className="text-sm text-secondary">
                    Certified by Anthropic on first attempt. Creator of{' '}
                    <a href="https://claude.ajithkumarr.com/" target="_blank" rel="noopener noreferrer" className="text-accent-primary font-medium hover:underline">
                      Claude Cert Prep
                    </a>, an open scenario-based architecture platform for engineers.
                  </p>
                </div>
                <div className="p-4 rounded-xl modern-card space-y-1">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent-primary" />
                    GovTechThon First Prize Winner
                  </h4>
                  <p className="text-sm text-secondary">
                    Led development of MakkalNalamBot / SEVAI, a public-interest chatbot helping citizens discover welfare schemes (reported by The Hindu &amp; The New Indian Express).
                  </p>
                </div>
              </div>
              <div>
                <Link
                  href="/devfolio"
                  className="modern-btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:-translate-y-1 transition-all"
                >
                  Explore Developer Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="modern-card p-6 rounded-2xl space-y-4">
                <h3 className="font-playfair text-xl font-bold text-foreground">Core Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Claude AI / Anthropic', 'System Architecture', 'Git'].map((tech) => (
                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-tertiary text-foreground text-xs font-medium border border-color">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="pt-4 border-t border-color/40 text-xs text-secondary leading-relaxed">
                  Focusing on scalable architectures, intuitive user experience, and meaningful public-interest digital tools.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: Latest Articles and Updates */}
      <section className="py-16 md:py-20 border-b border-color/40 bg-card/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-accent-primary text-sm font-semibold tracking-wider uppercase">
                <FileText className="w-4 h-4" />
                <span>Knowledge &amp; Essays</span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-2">
                Latest Articles, Technical &amp; Literary Insights
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-accent-primary font-medium hover:underline inline-flex items-center gap-1.5"
            >
              Browse all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/react-useeffect-the-complete-guide-to-dos-and-donts" className="modern-card p-6 rounded-2xl hover:shadow-card-hover transition-all group block">
              <span className="text-xs text-accent-primary font-semibold">Technical Architecture</span>
              <h3 className="font-playfair text-lg font-bold text-foreground mt-2 group-hover:text-accent-primary transition-colors">
                React useEffect: The Complete Guide to Do&apos;s and Don&apos;ts
              </h3>
              <p className="text-sm text-secondary mt-2 line-clamp-3">
                Comprehensive guide to mastering lifecycle management and side effects in modern React applications.
              </p>
            </Link>

            <Link href="/blog/building-makkalnalambot-revolutionizing-government-scheme-access-with-whatsapp" className="modern-card p-6 rounded-2xl hover:shadow-card-hover transition-all group block">
              <span className="text-xs text-accent-primary font-semibold">Public-Interest Tech</span>
              <h3 className="font-playfair text-lg font-bold text-foreground mt-2 group-hover:text-accent-primary transition-colors">
                Building MakkalNalamBot: Welfare Scheme Access via WhatsApp
              </h3>
              <p className="text-sm text-secondary mt-2 line-clamp-3">
                The engineering and social impact story behind our award-winning GovTechThon project in Tamil Nadu.
              </p>
            </Link>

            <Link href="/quill" className="modern-card p-6 rounded-2xl hover:shadow-card-hover transition-all group block">
              <span className="text-xs text-accent-primary font-semibold">Literary Philosophy</span>
              <h3 className="font-playfair text-lg font-bold text-foreground mt-2 group-hover:text-accent-primary transition-colors">
                தனிமையின் பேரெல்லைகள் (Boundaries of Solitude)
              </h3>
              <p className="text-sm text-secondary mt-2 line-clamp-3">
                Reflections on creative solitude, internal observation, and how silence nurtures the written word.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 11: Contact & Creative Collaboration */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground">
            Let&apos;s Connect and Create Together
          </h2>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
            Whether you are looking to collaborate on independent screenplays, literary poetry readings, Tamil film projects, or software architecture, I welcome thoughtful conversations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={openContactForm}
              className="modern-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base hover:-translate-y-1 transition-all shadow-lg"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/about"
              className="modern-btn-secondary inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base hover:-translate-y-1 transition-all"
            >
              Learn More About Me
            </Link>
          </div>
          <div className="pt-6 text-sm text-secondary-500">
            Based in Bengaluru, Karnataka, India · Available for global and regional collaborations
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </>
  );
}
