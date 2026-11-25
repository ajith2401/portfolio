'use client';
// Client shell for the writing page: back link, header, reader controls, approved reviews, rating form.
// The article body arrives pre-rendered from the server as `children`; related works come from the server too.
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import RatingForm from '@/components/ui/form/RatingForm';
import DecorativeLine from '@/components/ui/DecorativeLine';
import SharedContentHeader from '@/components/layout/QuillPageHeader';
import WordCard from '@/components/ui/card/WordCard';
import { useGetCommentsQuery } from '@/services/api';
import { writingPath } from '@/lib/content-contract/seo.js';
import ReaderShell from './ReaderShell';
import { notoSerifTamil, notoSansTamil } from './reader-fonts';

const getLocalStorage = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const BackButtonWithParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPage = searchParams.get('returnPage') || getLocalStorage('quillPage', '1');
  const category = getLocalStorage('quillCategory', '');
  const search = getLocalStorage('quillSearch', '');

  const handleBack = () => {
    const backUrl = new URL('/quill', window.location.origin);
    backUrl.searchParams.set('page', returnPage);
    if (category && category !== 'All Writings') backUrl.searchParams.set('category', category);
    if (search) backUrl.searchParams.set('search', search);
    router.push(backUrl.toString());
  };

  return (
    <div className="py-4 sm:py-6 md:py-8">
      <button onClick={handleBack} className="inline-flex items-center text-xs sm:text-sm hover:text-primary min-h-11">
        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" aria-hidden="true" />
        Back to Writings
      </button>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const RelatedWorks = ({ related }) => {
  if (!related?.length) return null;
  return (
    <section className="mb-8 md:mb-16 mt-16 md:mt-28" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">You Might Also Like</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 list-none p-0">
        {related.map((w) => (
          <li key={w.id}>
            <Link href={writingPath(w.slug)} className="block w-full">
              <article className="clean-container rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-[var(--card-hover-shadow)]">
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image
                    src={w.images?.small || w.images?.medium || '/placeholder.jpg'}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-[rgba(140,140,140,0.15)]">{w.category}</span>
                  <h3 className="font-work-sans text-lg font-medium">{w.title}</h3>
                  {w.excerpt && <p className="text-sm line-clamp-3 opacity-80">{w.excerpt}</p>}
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default function WritingDetailClient({ writing, quillId, headings = [], related = [], children }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const { data: comments = [] } = useGetCommentsQuery(
    { contentType: 'Writing', contentId: quillId },
    { skip: !isMounted || !quillId },
  );

  const lang = writing.language === 'English' ? 'en' : 'ta';

  return (
    <div className={`min-h-screen text-foreground tamil-quill not-dark-black ${notoSerifTamil.variable} ${notoSansTamil.variable}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {isMounted ? (
          <Suspense fallback={<div className="py-4 sm:py-6 md:py-8" />}>
            <BackButtonWithParams />
          </Suspense>
        ) : (
          <div className="py-4 sm:py-6 md:py-8" />
        )}

        <SharedContentHeader content={writing} contentType="Writing" />

        <div className="w-full mx-auto mt-4 md:mt-8 mb-8 sm:mb-12 md:mb-16">
          <DecorativeLine />
        </div>

        <ReaderShell headings={headings} lang={lang}>{children}</ReaderShell>

        <div className="w-full border-b border-dashed border-[#949494] opacity-50 my-8 md:my-12" />

        <section className="mb-8 md:mb-14 mt-16 md:mt-36" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">Words About My Words</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {comments.length > 0 ? comments.slice(0, 3).map((comment, index) => (
              <WordCard
                key={comment._id || index}
                author={comment.name}
                content={comment.comment}
                rating={comment.rating || 5}
                date={formatDate(comment.createdAt)}
              />
            )) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </section>

        <RatingForm contentType="Writing" contentId={quillId} />

        <div className="w-full border-b border-dashed border-[#949494] opacity-50 my-8 md:my-12" />

        <RelatedWorks related={related} />
      </div>
    </div>
  );
}
