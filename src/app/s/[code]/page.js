import { redirect, notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import { TechBlog, Writing, Book, Project } from '@/models';
import { isValidShortCode } from '@/utils/shortCode';

export const dynamic = 'force-dynamic';

const LOOKUPS = [
  { Model: TechBlog, section: 'blog' },
  { Model: Writing, section: 'quill' },
  { Model: Book, section: 'spotlight' },
  { Model: Project, section: 'devfolio' },
];

export async function generateMetadata({ params }) {
  const { code } = await params;
  if (!isValidShortCode(code)) return { title: 'Link' };

  try {
    await connectDB();
    for (const { Model, section } of LOOKUPS) {
      const doc = await Model.findOne({ shortCode: code })
        .select('title excerpt description shortDescription images coverImage slug _id')
        .lean();
      if (doc) {
        const title = doc.title || 'Ajithkumar R';
        const description = doc.excerpt || doc.shortDescription || doc.description || 'Explore works by Ajithkumar R';
        const image = doc.images?.large || doc.images?.medium || doc.coverImage || 'https://www.ajithkumarr.com/opengraph-image.jpg';
        const identifier = doc.slug ? encodeURI(doc.slug) : doc._id.toString();
        const fullUrl = `https://www.ajithkumarr.com/${section}/${identifier}`;

        return {
          title: `${title} | Ajithkumar R`,
          description,
          openGraph: {
            title,
            description,
            url: fullUrl,
            siteName: 'Ajithkumar R',
            images: [{ url: image, width: 1200, height: 630, alt: title }],
            type: 'article',
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
          },
        };
      }
    }
  } catch (err) {
    console.error('ShortUrl metadata error:', err);
  }

  return { title: 'Ajithkumar R' };
}

export default async function ShortUrlRedirect({ params }) {
  const { code } = await params;

  if (!isValidShortCode(code)) {
    notFound();
  }

  await connectDB();

  for (const { Model, section } of LOOKUPS) {
    const doc = await Model.findOne({ shortCode: code }).select('slug _id').lean();
    if (doc) {
      const identifier = doc.slug ? encodeURI(doc.slug) : doc._id.toString();
      redirect(`/${section}/${identifier}`);
    }
  }

  notFound();
}
