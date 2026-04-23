import { redirect, notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import { TechBlog, Writing, Book, Project } from '@/models';
import { isValidShortCode } from '@/utils/shortCode';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: 'noindex,nofollow',
};

const LOOKUPS = [
  { Model: TechBlog, section: 'blog' },
  { Model: Writing, section: 'quill' },
  { Model: Book, section: 'spotlight' },
  { Model: Project, section: 'devfolio' },
];

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
