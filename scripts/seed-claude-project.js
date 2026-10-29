const { MongoClient } = require('mongodb');

async function seedClaudeCertPrep() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://writerajithdev:sFCKeLxlgnTwJBIC@portfolio.5tfqx.mongodb.net/?retryWrites=true&w=majority&appName=Portfolio";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const existing = await db.collection('projects').findOne({ slug: 'claude-cert-prep' });
    if (existing) {
      console.log('Project claude-cert-prep already exists.');
      return;
    }

    const doc = {
      title: 'Claude Cert Prep — Certification Learning Platform',
      slug: 'claude-cert-prep',
      shortDescription: 'An independent, free learning platform for developers preparing for Anthropic Claude certifications (CCA-F, CCAR-P, CCDV-F) with scenario-based practice questions and architectural frameworks.',
      longDescription: `## Overview\n\nClaude Cert Prep is an independent, free educational platform built to help software engineers, cloud architects, and AI practitioners prepare rigorously for Anthropic's Claude certifications, starting with the Claude Certified Architect – Foundations (CCA-F) track.\n\n### Motivation & Architectural Challenge\n\nWhile preparing for and passing the CCA-F exam on my first attempt, I noticed a critical gap in the ecosystem: most available prep material merely tested rote syntax rather than real-world architectural judgment (context window optimization, tool choice trade-offs, multi-turn prompt engineering, safety guardrails, and latency/cost trade-offs).\n\n### Key Features\n\n- **Scenario-Based Questions:** High-fidelity questions testing architectural decision-making grounded in Anthropic's official blueprints and documentation.\n- **Domain-Weighted Mock Exams:** Practice exams reflecting the exact domain distributions of the certification tracks.\n- **Comprehensive Answer Explanations:** Every option carries architectural rationale detailing *why* the correct approach is optimal and *why* plausible distractors fail in production.\n- **Learning Modules & Concept Guides:** In-depth technical guides covering MCP (Model Context Protocol), Tool Choice, Message Batches, RAG vs. Long-Context, and Prompt Injection Defense.\n\n### Tech Stack & Architecture\n\n- **Framework:** Next.js 15 (App Router), React 19, TypeScript\n- **Database:** MongoDB with Mongoose\n- **Styling:** Tailwind CSS\n- **Authentication & Testing:** NextAuth.js, Vitest\n- **Deployment:** Vercel with edge caching and streaming`,
      category: 'AI/ML',
      status: 'published',
      featured: true,
      technologies: [
        'Next.js',
        'TypeScript',
        'React',
        'Anthropic Claude API',
        'MongoDB',
        'Tailwind CSS',
        'Vitest'
      ],
      liveUrl: 'https://claude.ajithkumarr.com/',
      githubUrl: 'https://github.com/ajith2401',
      images: {
        thumbnail: 'https://claude.ajithkumarr.com/opengraph-image',
        medium: 'https://claude.ajithkumarr.com/opengraph-image',
        large: 'https://claude.ajithkumarr.com/opengraph-image'
      },
      publishedAt: new Date('2026-07-24T00:00:00.000Z'),
      createdAt: new Date('2026-07-24T00:00:00.000Z'),
      updatedAt: new Date()
    };

    await db.collection('projects').insertOne(doc);
    console.log('Successfully inserted Claude Cert Prep project into MongoDB!');
  } catch (err) {
    console.error('Error seeding project:', err);
  } finally {
    await client.close();
  }
}

seedClaudeCertPrep();

