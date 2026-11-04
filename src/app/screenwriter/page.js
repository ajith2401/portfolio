// src/app/screenwriter/page.js
import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Clapperboard, 
  ArrowRight, 
  CheckCircle2, 
  Film, 
  HelpCircle,
  Sparkles,
  PenTool,
  Compass
} from 'lucide-react';
import PersonSchema from '@/components/schema/PersonSchema';

export const metadata = {
  title: "Ajithkumar R — Tamil Screenwriter & Story Writer (அஜித்குமார் திரைக்கதை எழுத்தாளர்)",
  description: "Official screenwriting portfolio of Ajithkumar R. Developing original character-driven Tamil screenplays, story treatments, and dialogues rooted in social realism and authentic narrative conflict.",
  keywords: [
    "Ajith screenwriter",
    "Ajith Kumar screenwriter",
    "Ajithkumar screenwriter",
    "Ajith screenplay writer",
    "Ajith Kumar screenplay writer",
    "Ajithkumar screenplay writer",
    "Tamil screenplay writer Ajithkumar",
    "Tamil film writer Ajith Kumar",
    "Ajith Kumar story writer",
    "Ajithkumar scriptwriter",
    "Ajith Kumar screenplay writer portfolio",
    "அஜித்குமார் திரைக்கதை எழுத்தாளர்",
    "தமிழ் திரைப்பட எழுத்தாளர் அஜித்குமார்"
  ],
  alternates: {
    canonical: "https://www.ajithkumarr.com/screenwriter",
  },
  openGraph: {
    title: "Ajithkumar R — Tamil Screenwriter & Story Writer",
    description: "Official screenwriting portfolio of Ajithkumar R. Developing original character-driven Tamil screenplays, story treatments, and dialogues rooted in social realism.",
    url: "https://www.ajithkumarr.com/screenwriter",
    type: "profile",
    images: [
      {
        url: "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg",
        width: 1200,
        height: 630,
        alt: "Ajithkumar R — Tamil Screenwriter"
      }
    ],
    locale: "ta_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajithkumar R — Tamil Screenwriter & Story Writer",
    description: "Official screenplay portfolio of Ajithkumar R — Developing original Tamil screenplays and cinematic stories.",
    images: ["https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg"],
    creator: "@ajithkumarr"
  }
};

export default function ScreenwriterPage() {
  const screenplayProjects = [
    {
      title: "The Burden of Silence (மௌனத்தின் பாரம்)",
      format: "Feature Film Screenplay",
      genre: "Social & Family Drama",
      logline: "When an estranged son returns to his ancestral hometown in southern Tamil Nadu following a family dispute, three generations must confront inherited emotional debts and unspoken truths that silence has calcified.",
      stage: "Full Draft Complete · Seeking Producer & Directorial Collaboration",
      themes: "Family dynamics, intergenerational guilt, social expectations, emotional redemption"
    },
    {
      title: "Antenna on the Wall (சுவர் மீதொரு ஆண்டெனா)",
      format: "Independent Short Film",
      genre: "Psychological Realism / Poetic Drama",
      logline: "An ageing repairman living alone in a rapidly modernizing semi-urban town forms an obsessive habit of observing the quiet lives of his neighbors through television antennae and rooftop reflections.",
      stage: "Screenplay Polished · Storyboard & Pre-production in Development",
      themes: "Urban loneliness, modern estrangement, human empathy, memory"
    },
    {
      title: "The Unforgiven Shore (மன்னிக்கப்படாத கரை)",
      format: "Feature Film Treatment",
      genre: "Social Thriller / Rural Conflict",
      logline: "In a coastal fishing community undergoing aggressive land development, a young community worker finds herself trapped between state bureaucracy, local syndicates, and her own moral conscience.",
      stage: "Detailed Narrative Treatment & Character Bible Complete",
      themes: "Ecological displacement, community resistance, ethical dilemma"
    }
  ];

  const faqs = [
    {
      question: "Is Ajithkumar R a screenwriter in Tamil cinema?",
      answer: "Ajithkumar R is a screenwriter and story writer developing original Tamil screenplays and feature treatments. Coming from a background as a published Tamil author of five poetry books, he writes character-driven narratives focused on authentic dialogue, emotional depth, and social realism."
    },
    {
      question: "What genres does Ajithkumar R write for screenplays?",
      answer: "His screenwriting focuses primarily on social dramas, relationship and family conflicts, psychological character studies, and rural-urban realistic narratives set in contemporary Tamil Nadu."
    },
    {
      question: "Is Ajithkumar R the screenwriter related to Tamil cinema actor Ajith Kumar?",
      answer: "No. Ajithkumar R is an independent Tamil author, screenwriter, and filmmaker based in Bengaluru. He is distinct from Tamil cinema actor Ajith Kumar and Malayalam screenwriter/director B. Ajithkumar."
    },
    {
      question: "How can directors or producers collaborate with Ajithkumar R for scripts?",
      answer: "Producers, independent filmmakers, and directors interested in reviewing script treatments, character bibles, or collaborating on original Tamil screenplays can connect via the contact form on his official website or by emailing ajith24ram@gmail.com."
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
          <span className="text-foreground font-medium">Screenwriter</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary border border-color text-xs font-semibold text-accent-primary uppercase tracking-wider">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Screenwriting &amp; Dramatic Narrative</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Ajithkumar R. — Tamil Screenwriter &amp; Story Writer
          </h1>
          <p className="text-xl text-secondary max-w-3xl leading-relaxed">
            Crafting original character-driven Tamil screenplays, narrative treatments, and authentic dialogue rooted in cultural specificity and emotional realism.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Feature Screenplay Treatments
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Short Film Scripts
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Dialogue Writing &amp; Subtext
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-tertiary border border-color text-secondary">
              Literary Background
            </span>
          </div>
        </header>

        {/* Section: Screenwriting Approach & Philosophy */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-6">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Storytelling Philosophy &amp; Narrative Craft
          </h2>
          <div className="prose dark:prose-invert max-w-none text-secondary space-y-4 leading-relaxed">
            <p>
              Having published five collections of Tamil poetry and numerous reflective essays, Ajithkumar R views screenwriting not as a mechanical puzzle of plot formulas, but as the delicate art of dramatizing human interiority.
            </p>
            <p>
              Cinema demands that internal contradictions manifest externally — in the choices characters make under pressure, in the words they leave unsaid, and in the physical spaces they inhabit.
            </p>
            <div className="grid md:grid-cols-3 gap-4 pt-2 not-prose">
              <div className="p-5 rounded-xl modern-card space-y-2">
                <Compass className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-foreground text-base">Cultural Specificity</h3>
                <p className="text-sm text-secondary">
                  Rooted in authentic Tamil socio-cultural milieus, regional vernaculars, and tangible living environments.
                </p>
              </div>
              <div className="p-5 rounded-xl modern-card space-y-2">
                <FileText className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-foreground text-base">Dialogue Economy</h3>
                <p className="text-sm text-secondary">
                  Dialogues that sound like real people talking to survive, conceal, love, or defend — never synthetic plot exposition.
                </p>
              </div>
              <div className="p-5 rounded-xl modern-card space-y-2">
                <Film className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-foreground text-base">Visual Subtext</h3>
                <p className="text-sm text-secondary">
                  Allowing pauses, gaze, soundscapes, and framing to carry the emotional payload of the scene.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Original Scripts & Narrative Treatments in Development */}
        <section className="mb-16 border-t border-color/40 pt-10">
          <div className="mb-8">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
              Screenplays &amp; Treatments in Development
            </h2>
            <p className="text-sm text-secondary mt-1">
              Selected original projects developed with structured treatments, character bibles, and full scene breakdowns.
            </p>
          </div>

          <div className="space-y-6">
            {screenplayProjects.map((project, idx) => (
              <article key={idx} className="modern-card p-6 md:p-8 rounded-2xl space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary">
                      {project.format}
                    </span>
                    <h3 className="font-playfair text-2xl font-bold text-foreground mt-2">
                      {project.title}
                    </h3>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg bg-tertiary border border-color text-secondary font-medium">
                    {project.genre}
                  </span>
                </div>

                <p className="text-secondary leading-relaxed text-base">
                  <strong>Logline:</strong> {project.logline}
                </p>

                <div className="pt-2 border-t border-color/40 grid sm:grid-cols-2 gap-4 text-xs text-secondary">
                  <div>
                    <span className="text-secondary-400 uppercase tracking-wider font-semibold block mb-1">Themes</span>
                    {project.themes}
                  </div>
                  <div>
                    <span className="text-secondary-400 uppercase tracking-wider font-semibold block mb-1">Development Status</span>
                    <span className="text-foreground font-medium">{project.stage}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-tertiary/40 border border-color text-xs text-secondary text-center">
            Note: Full screenplay drafts, step outlines, and treatments are shared selectively under mutual confidentiality for serious production or directorial discussions.
          </div>
        </section>

        {/* Section: Connection to Author Identity & Directorial Vision */}
        <section className="mb-16 border-t border-color/40 pt-10 space-y-6">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Connecting Literature, Scriptwriting &amp; Direction
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="modern-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-accent-primary">
                <PenTool className="w-5 h-5" />
                <h3 className="font-playfair text-xl font-bold text-foreground">Published Tamil Literature</h3>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                Explore Ajithkumar R&apos;s five published poetry collections, which provide the emotional foundation, poetic imagery, and sociological depth behind his screenplay storytelling.
              </p>
              <Link href="/writer" className="text-accent-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                View Writer Profile &amp; Books <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="modern-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-accent-primary">
                <Film className="w-5 h-5" />
                <h3 className="font-playfair text-xl font-bold text-foreground">Independent Directorial Vision</h3>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                Learn about Ajithkumar R&apos;s directorial pursuits, independent film development, visual staging principles, and creative collaborations in visual cinema.
              </p>
              <Link href="/filmmaker" className="text-accent-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                Explore Filmmaking Pursuits <ArrowRight className="w-3.5 h-3.5" />
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
            Interested in Reviewing a Screenplay or Collaborating?
          </h2>
          <p className="text-sm text-secondary max-w-lg mx-auto">
            Open to creative discussions with producers, directors, script consultants, and independent cinematographers.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="modern-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm"
            >
              Get in Touch for Screenplay Discussions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}

