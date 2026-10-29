'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Award, Sparkles, BookOpen, Code2, Users, ArrowRight } from 'lucide-react';
import eventEmitter from '@/lib/eventEmitter';

export default function AboutClient() {
  const handleOpenContact = () => {
    if (eventEmitter) {
      eventEmitter.emit('showContactModal');
    }
  };

  const coreSkills = [
    'React.js',
    'Next.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'TypeScript',
    'Tailwind CSS',
    'REST APIs',
    'Git',
    'System Integration',
    'Applied AI & Automation'
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      {/* Hero Section */}
      <section className="mb-14 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
          About Me
        </h1>
        <div className="w-16 h-1 bg-accent-primary mb-8 rounded-full" />
        <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-6">
          I&apos;m Ajithkumar — a Full Stack Developer, AI automation specialist, Anthropic-certified Claude Architect, and published Tamil poet based in Bengaluru, Karnataka, India.
        </p>
        <p className="text-base md:text-lg text-secondary leading-relaxed">
          My work spans software engineering, applied AI, and Tamil literature. I build digital products and intelligent tools to solve practical problems, while writing poetry, stories, essays, and lyrics that explore human experiences and social realities. These pursuits may appear different, but they share a common thread: curiosity about people, a desire to question assumptions, and an interest in turning ideas into something meaningful.
        </p>
      </section>

      {/* Software Engineering & Applied AI */}
      <section className="mb-14 md:mb-16 border-t border-color/40 pt-10">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Software Engineering &amp; Applied AI
          </h2>
        </div>
        <p className="text-secondary leading-relaxed mb-4">
          As a Full Stack Developer specialising in the MERN stack, I build web applications, backend services, APIs, and digital products with an emphasis on usability, maintainability, and thoughtful engineering.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          My core technologies include React.js, Next.js, Node.js, Express.js, MongoDB, TypeScript, Tailwind CSS, REST APIs, and Git. My work also extends into automation, data processing, system integration, and AI-powered applications.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          I&apos;m particularly interested in how AI can move beyond demonstrations and become genuinely useful in real-world workflows. That means thinking carefully about system design, context, tool integration, reliability, and the experience of the people using the technology.
        </p>
        <p className="text-secondary leading-relaxed mb-6">
          For me, good engineering isn&apos;t simply about making something work. It&apos;s about understanding the problem, choosing the right approach, and building a solution that remains useful beyond the initial implementation.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {coreSkills.map((skill) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 rounded-lg bg-tertiary text-foreground text-sm font-medium border border-color"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* AI Architecture & Claude Certification */}
      <section className="mb-14 md:mb-16 border-t border-color/40 pt-10">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            AI Architecture &amp; Claude Certification
          </h2>
        </div>
        <p className="text-secondary leading-relaxed mb-4">
          I hold the <strong className="text-foreground">Claude Certified Architect – Foundations (CCA-F)</strong> certification, issued by Anthropic. I passed the certification exam on my first attempt.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          Preparing for the exam presented an interesting challenge: finding practice resources that went beyond memorising concepts and helped develop the architectural reasoning needed to evaluate real-world scenarios.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          That experience led me to build{' '}
          <a
            href="https://claude.ajithkumarr.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            Claude Cert Prep
            <ExternalLink className="w-3.5 h-3.5 inline" />
          </a>
          , a free, independent learning platform for developers preparing for Claude certifications.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          The platform brings together structured study guides, scenario-based mock exams, detailed answer explanations, domain-wise practice, and readiness tracking. Its purpose is to help learners understand why an architectural decision makes sense, when alternative approaches are appropriate, and how to reason through competing technical trade-offs.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          Building the platform became an extension of my own learning journey: identifying a problem, working through it, and creating something that other developers can use.
        </p>
        <p className="text-sm text-secondary-500 italic mb-6">
          Claude Cert Prep is an independent project and is not affiliated with or endorsed by Anthropic.
        </p>

        <div>
          <a
            href="https://www.credly.com/org/anthropic/badge/claude-certified-architect-foundations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white transition-all text-sm font-medium"
          >
            <Award className="w-4 h-4" />
            View my CCA-F certification
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Public-Interest Technology */}
      <section className="mb-14 md:mb-16 border-t border-color/40 pt-10">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Public-Interest Technology
          </h2>
        </div>
        <p className="text-secondary leading-relaxed mb-4">
          One of my most meaningful collaborative projects began at GovTechThon in Tirunelveli, where my team won first prize for a chatbot designed to help people discover government welfare schemes relevant to their circumstances.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          Developed with Siva Subramanian and Venkadesh, the project explored how a conversational interface could make public information easier to access. Instead of navigating complicated information across government departments, people could provide details such as their age, gender, and income to discover potentially relevant schemes.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          The work was reported as MakkalNalamBot by The New Indian Express in 2022 and as the WhatsApp-based SEVAI chatbot by The Hindu in January 2023.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          What made this project especially meaningful was its focus on a practical public problem: helping people discover welfare programmes that they might otherwise struggle to find.
        </p>
        <p className="text-secondary leading-relaxed mb-6">
          It reinforced an idea that continues to influence how I approach technology: a useful product doesn&apos;t have to be complicated to make a difference. Sometimes, the most valuable innovation is making existing resources easier for people to discover and use.
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-secondary font-medium">Read the coverage:</span>
          <a
            href="https://www.newindianexpress.com/states/tamil-nadu/2022/Jul/10/coming-soon-a-virtual-assistant-makkalnalambot-for-info-ongovernment-schemes-2474843.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline inline-flex items-center gap-1"
          >
            The New Indian Express
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-secondary-400">·</span>
          <a
            href="https://www.thehindu.com/news/cities/Madurai/whatsapp-based-chatbot-introduced-in-tirunelveli-to-take-welfare-schemes-to-public/article66342104.ece"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline inline-flex items-center gap-1"
          >
            The Hindu
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Tamil Writer, Poet & Lyricist */}
      <section className="mb-14 md:mb-16 border-t border-color/40 pt-10">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-accent-primary" />
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
            Tamil Writer, Poet &amp; Lyricist
          </h2>
        </div>
        <p className="text-secondary leading-relaxed mb-4">
          Alongside my technical work, I have published five Tamil poetry books exploring feminism, social justice, identity, love, labour, and the complexities of human relationships.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          My writing often turns towards experiences that are overlooked, voices that go unheard, and contradictions that shape everyday life. I&apos;m interested in the relationship between individuals and society, the ideas we inherit, the assumptions we rarely question, and the emotions we struggle to express.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          Beyond poetry, I write short stories, essays, and lyrics. Through these forms, I explore the nuances of contemporary Tamil life, using language to examine personal experiences as well as larger social realities.
        </p>
        <p className="text-secondary leading-relaxed">
          For me, literature is not just an exercise in expression. It is a way of paying attention, questioning the familiar, and finding words for experiences that deserve to be understood.
        </p>
      </section>

      {/* One Curiosity, Different Forms */}
      <section className="mb-14 md:mb-16 border-t border-color/40 pt-10">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground mb-4">
          One Curiosity, Different Forms
        </h2>
        <p className="text-secondary leading-relaxed mb-4">
          I don&apos;t see literature and technology as opposing pursuits. Both begin with paying attention.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          Writing asks me to observe people, question perspectives, and express complex experiences with clarity. Engineering asks me to understand problems, reason through possibilities, and turn ideas into working solutions.
        </p>
        <p className="text-secondary leading-relaxed mb-4">
          One allows me to explore the human experience through words; the other allows me to create tools that people can interact with and use. Both challenge me to think more carefully about what I create, why it matters, and whom it serves.
        </p>
        <blockquote className="border-l-4 border-accent-primary pl-6 py-1 my-6 italic text-foreground text-lg bg-tertiary/40 rounded-r-lg">
          Whether I&apos;m developing an application, exploring an AI architecture problem, or writing a poem in Tamil, I&apos;m driven by the same interest in ideas that challenge me and work that has a purpose.
        </blockquote>
      </section>

      {/* Get in Touch CTA */}
      <section className="border-t border-color/40 pt-10">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground mb-4">
          Get in Touch
        </h2>
        <p className="text-secondary leading-relaxed mb-4">
          I&apos;m open to meaningful conversations and collaborations across software development, applied AI, automation, Tamil literature, writing, and creative projects.
        </p>
        <p className="text-secondary leading-relaxed mb-6">
          Whether you have a technical problem to solve, an idea worth exploring, a literary project in mind, or simply want to connect, I&apos;d be glad to hear from you.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={handleOpenContact}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-primary text-white font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            Contact Me
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://github.com/ajith2401"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-accent-primary text-accent-primary font-medium hover:bg-accent-primary hover:text-white transition-all"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ajithkumar-r-a6531a232/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-accent-primary text-accent-primary font-medium hover:bg-accent-primary hover:text-white transition-all"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}

