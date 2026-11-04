// src/app/filmmaker/page.js
import React from 'react';
import Link from 'next/link';
import { 
  Film, 
  Clapperboard, 
  ArrowRight, 
  CheckCircle2, 
  PenTool, 
  Eye, 
  HelpCircle,
  Sparkles,
  Camera,
  PlayCircle
} from 'lucide-react';
import PersonSchema from '@/components/schema/PersonSchema';

export const metadata = {
  title: "Ajithkumar R — Independent Filmmaker & Director (அஜித்குமார் இயக்குநர்)",
  description: "Official filmmaking portfolio of Ajithkumar R. Exploring independent visual cinema, directorial concepts, short-film development, and narrative realism in Tamil storytelling.",
  keywords: [
    "Ajith director",
    "Ajith Kumar director",
    "Ajithkumar director",
    "Ajith filmmaker",
    "Ajith Kumar filmmaker",
    "Ajithkumar filmmaker",
    "Ajith independent filmmaker",
    "Ajith Kumar film director",
    "Ajithkumar film portfolio",
    "Tamil filmmaker Ajithkumar",
    "அஜித்குமார் இயக்குநர்",
    "தமிழ் திரைப்பட இயக்குநர் அஜித்குமார்"
  ],
  alternates: {
    canonical: "https://www.ajithkumarr.com/filmmaker",
  },
  openGraph: {
    title: "Ajithkumar R — Independent Filmmaker & Director",
    description: "Official filmmaking and directorial portfolio of Ajithkumar R. Developing independent cinema, short films, and visual narrative storytelling.",
    url: "https://www.ajithkumarr.com/filmmaker",
    type: "profile",
    images: [
      {
        url: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar R — Independent Filmmaker and Director"
      }
    ],
    locale: "ta_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajithkumar R — Independent Filmmaker & Director",
    description: "Directorial vision and independent filmmaking development by Ajithkumar R.",
    images: ["https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg"],
    creator: "@ajithkumarr"
  }
};

export default function FilmmakerPage() {
  const filmPursuits = [
    {
      title: "Antenna on the Wall (சுவர் மீதொரு ஆண்டெனா)",
      type: "Independent Short Film",
      role: "Writer & Director",
      synopsis: "A quiet psychological portrait of an ageing electronics mechanic observing the changing life of an urban neighbourhood from his rooftop. Exploring silence, detachment, and emotional observation.",
      status: "Pre-Production · Location Scouting & Casting Phase",
      medium: "Digital Cinema / Natural Light Aesthetic"
    },
    {
      title: "The Burden of Silence (மௌனத்தின் பாரம்)",
      type: "Feature Film Directorial Concept",
      role: "Screenwriter & Co-Director in Development",
      synopsis: "A multi-generational domestic drama exploring how emotional debt and unspoken grievances shape relationships across decades in southern Tamil Nadu.",
      status: "Directorial Treatment & Visual Style Guide Ready",
      medium: "Feature Independent Cinema"
    },
    {
      title: "Visual Poetry & Lyric Compositions",
      type: "Musical Poetry Video Series",
      role: "Lyricist & Conceptual Director",
      synopsis: "Original Tamil compositions combining poetic lyrical meter with evocative visual framing (e.g. நாளும் புதிது, தாலாட்டு, அன்பின் கீர்த்தனை).",
      status: "Musical Tracks Available · Visual Adaptations in Production",
      medium: "Cinematic Visuals & Acoustic Soundscapes"
    }
  ];

  const faqs = [
    {
      question: "Who is Ajithkumar R the filmmaker and director?",
      answer: "Ajithkumar R is an independent filmmaker, screenwriter, and published Tamil author based in Bengaluru, Karnataka, India. He focuses on independent cinema, character-driven narratives, and visual realism grounded in contemporary Tamil culture."
    },
    {
      question: "What are Ajithkumar R's released directorial credits?",
      answer: "Ajithkumar R is in active development with independent filmmaking projects and short films. Rather than claiming fictional commercial credits, he transparently presents original treatments, short film scripts, and visual poetry projects currently in development and pre-production."
    },
    {
      question: "Is Ajithkumar R the filmmaker related to actor Ajith Kumar or director B. Ajithkumar?",
      answer: "No. Ajithkumar R is an independent creative individual based in Bengaluru. He is distinct from Tamil actor Ajith Kumar (and the commercial directors who direct his films) and distinct from Malayalam film editor and director B. Ajithkumar."
    },
    {
      question: "How can cinematographers, crew, and producers collaborate with Ajithkumar R?",
      answer: "Passionate collaborators, cinematographers, sound designers, and independent producers can reach out through the contact form on his website or via email at ajith24ram@gmail.com."
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
          <span className="text-foreground font-medium">Filmmaker</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary border border-color text-xs font-semibold text-accent-primary uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>Independent Cinema &amp; Visual Direction</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Ajithkumar R. — Independent Filmmaker &amp; Director
          </h1>
          <p className="text-xl text-secondary max-w-3xl leading-relaxed">
            Exploring visual storytelling, realistic pacing, and character interiority through independent Tamil cinema and directorial concepts.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Directorial Vision in Development
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Independent Short Films
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Visual Poetry &amp; Music
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Authentic Social Realism
            </span>
          </div>
        </header>

        {/* Section: Directorial Vision & Philosophy */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-6">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Directorial Vision &amp; Aesthetic Principles
          </h2>
          <div className="prose dark:prose-invert max-w-none text-secondary space-y-4 leading-relaxed">
            <p>
              Directing cinema, for Ajithkumar R, is an extension of poetic observation: how the camera moves, where shadows fall, and how a performer breathes inside a frame. Rather than relying on melodrama or sensory overload, his directorial vision prioritizes emotional authenticity, spatial geography, and psychological subtext.
            </p>
            <div className="grid md:grid-cols-3 gap-4 pt-2 not-prose">
              <div className="p-5 rounded-xl modern-card space-y-2">
                <Camera className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-foreground text-base">Atmospheric Naturalism</h3>
                <p className="text-sm text-secondary">
                  Favoring natural lighting, authentic tactile locations, and uncluttered compositions that honor the reality of living spaces.
                </p>
              </div>
              <div className="p-5 rounded-xl modern-card space-y-2">
                <Eye className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-foreground text-base">Observational Restraint</h3>
                <p className="text-sm text-secondary">
                  Giving scenes room to breathe so that unspoken glances, pauses, and environmental ambiences reveal emotional undercurrents.
                </p>
              </div>
              <div className="p-5 rounded-xl modern-card space-y-2">
                <PlayCircle className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-foreground text-base">Social Truth</h3>
                <p className="text-sm text-secondary">
                  Focusing on common people, ethical dilemmas, everyday dignity, and marginal struggles with honesty and respect.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Projects in Development */}
        <section className="mb-16 border-t border-color/40 pt-10">
          <div className="mb-8">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
              Directorial Works &amp; Film Projects in Development
            </h2>
            <p className="text-sm text-secondary mt-1">
              Honest overview of independent filmmaking pursuits, concepts, and pre-production projects.
            </p>
          </div>

          <div className="space-y-6">
            {filmPursuits.map((item, idx) => (
              <article key={idx} className="modern-card p-6 md:p-8 rounded-2xl space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary">
                      {item.type}
                    </span>
                    <h3 className="font-playfair text-2xl font-bold text-foreground mt-2">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg bg-tertiary border border-color text-secondary font-medium">
                    Role: {item.role}
                  </span>
                </div>

                <p className="text-secondary leading-relaxed text-base">
                  <strong>Concept:</strong> {item.synopsis}
                </p>

                <div className="pt-2 border-t border-color/40 grid sm:grid-cols-2 gap-4 text-xs text-secondary">
                  <div>
                    <span className="text-secondary-400 uppercase tracking-wider font-semibold block mb-1">Visual Medium &amp; Style</span>
                    {item.medium}
                  </div>
                  <div>
                    <span className="text-secondary-400 uppercase tracking-wider font-semibold block mb-1">Current Status</span>
                    <span className="text-foreground font-medium">{item.status}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-xl bg-tertiary/50 border border-color text-xs text-secondary leading-relaxed">
            <strong className="text-foreground">Commitment to Integrity:</strong> Ajithkumar R values transparent professional attribution. He does not fabricate commercial theatrical credits or inflate roles. His filmmaking identity represents an active, dedicated path of independent cinema study, short-film direction, and narrative development.
          </div>
        </section>

        {/* Section: Connecting Literature & Screenplay */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-6">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Explore Associated Creative Disciplines
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="modern-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-accent-primary">
                <Clapperboard className="w-5 h-5" />
                <h3 className="font-playfair text-xl font-bold text-foreground">Screenplay Writing</h3>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                Discover Ajithkumar R&apos;s original screenplays, scene breakdowns, treatments, and dialogue writing crafted specifically for cinematic execution.
              </p>
              <Link href="/screenwriter" className="text-accent-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                View Screenplay Treatments <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="modern-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-accent-primary">
                <PenTool className="w-5 h-5" />
                <h3 className="font-playfair text-xl font-bold text-foreground">Published Tamil Literature</h3>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                Review the five published poetry books that establish Ajithkumar R&apos;s literary roots, cultural depth, and poetic perspectives.
              </p>
              <Link href="/writer" className="text-accent-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                View Literary Portfolio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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

        {/* Collaboration Footer */}
        <footer className="border-t border-color/40 pt-10 text-center space-y-4">
          <h2 className="font-playfair text-2xl font-bold text-foreground">
            Collaborate on Independent Film Projects
          </h2>
          <p className="text-sm text-secondary max-w-lg mx-auto">
            Open to creative discussions with independent cinematographers, sound designers, actors, and producers.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="modern-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm"
            >
              Get in Touch for Filmmaking Conversations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}

