import React from 'react';
import PersonSchema from '@/components/schema/PersonSchema';

export const metadata = {
  title: 'About Ajithkumar | Tamil Writer & Full Stack Developer',
  description:
    'Learn about Ajithkumar — a published Tamil poet with 5 poetry books and a Full Stack MERN Developer from Tamil Nadu, India. Exploring feminism, social justice and human emotion through literature and code.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Ajithkumar | Tamil Writer & Full Stack Developer',
    description:
      'Learn about Ajithkumar — published Tamil poet and Full Stack MERN Developer from Tamil Nadu, India.',
    url: 'https://www.ajithkumarr.com/about',
  },
};

export default function About() {
  return (
    <>
      <PersonSchema />

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">
            About Me
          </h1>
          <div className="w-16 h-1 bg-accent-primary mb-8" />
          <p className="text-lg text-secondary leading-relaxed">
            I&apos;m <strong className="text-primary">Ajithkumar</strong> — a published Tamil poet, writer, lyricist, and Full
            Stack MERN Developer based in Bangalore, Karnataka, India. I balance literary creativity
            with technical expertise, exploring themes of feminism, social justice, and human
            emotion through both words and code.
          </p>
        </section>

        {/* Writer */}
        <section className="mb-16">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
            Writer &amp; Poet
          </h2>
          <p className="text-secondary leading-relaxed mb-4">
            I have published <strong>5 Tamil poetry books</strong>, each delving into the lived
            experiences of people at the margins — women, labourers, dreamers — through the lens of
            contemporary Tamil literature. My writing has been described as lyrical, politically
            aware, and deeply human.
          </p>
          <p className="text-secondary leading-relaxed">
            Beyond poetry, I write short stories, essays, and lyrics that capture the complexity of
            modern Tamil identity. Literature, for me, is both a mirror and a map.
          </p>
        </section>

        {/* Developer */}
        <section className="mb-16">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
            Full Stack Developer
          </h2>
          <p className="text-secondary leading-relaxed mb-4">
            As a MERN stack developer, I build performant, accessible web applications using{' '}
            <strong className="text-primary">React.js, Next.js, Node.js, Express, and MongoDB</strong>. I care about clean
            architecture, thoughtful UX, and code that lasts.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {[
              'React.js', 'Next.js', 'Node.js',
              'MongoDB', 'Express', 'Tailwind CSS',
              'TypeScript', 'REST APIs', 'Git',
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-2 rounded-lg bg-tertiary text-primary text-sm font-medium text-center border border-color"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-16">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
            Philosophy
          </h2>
          <blockquote className="border-l-4 border-accent-primary pl-6 italic text-secondary text-lg">
            &ldquo;Literature and technology are two languages for the same curiosity — both ask:
            what does it mean to be alive, and how can we make that experience better for others?&rdquo;
          </blockquote>
        </section>

        {/* Contact CTA */}
        <section>
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Get in Touch</h2>
          <p className="text-secondary leading-relaxed mb-6">
            Whether you want to collaborate on a project, discuss Tamil literature, or just say
            hello — I&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:ajith24ram@gmail.com"
              className="px-6 py-3 rounded-full bg-accent-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Email Me
            </a>
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
    </>
  );
}
