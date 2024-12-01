'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Share, Star } from 'lucide-react';
import RatingForm from '@/components/ui/form/RatingForm';
import DecorativeLine from '@/components/ui/DecorativeLine';

const WordCard = ({ author, content, rating = 5 }) => (
  <div className="p-4 sm:p-6 rounded-lg bg-[#1A1A1A] hover:bg-[#242424] transition-colors">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
    <p className="text-xs sm:text-sm text-gray-300 mb-4">{content}</p>
    <p className="text-xs sm:text-sm text-gray-400">{author}</p>
  </div>
);

export default function WritingDetailPage({ params }) {
  const [writing, setWriting] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [writingRes, commentsRes] = await Promise.all([
          fetch(`/api/writings/${params.quill_id}`),
          fetch(`/api/writings/${params.quill_id}/comments`)
        ]);

        if (!writingRes.ok || !commentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [writingData, commentsData] = await Promise.all([
          writingRes.json(),
          commentsRes.json()
        ]);

        setWriting(writingData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.quill_id]);

  if (!writing) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button and Share Section */}
        <div className="py-4 sm:py-6">
          <Link href="/quill" className="inline-flex items-center text-xs sm:text-sm hover:text-primary">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back
          </Link>
        </div>

        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="order-2 md:order-1">
            <div className="mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm text-gray-400">{writing.category}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-xs sm:text-sm text-gray-400">{formatDate(writing.createdAt)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-bold mb-4 sm:mb-8">{writing.title}</h1>
            <div className="flex gap-4">
              <button className="p-1.5 sm:p-2 rounded-full border border-gray-700 hover:bg-gray-800">
                <Share className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/3] w-full">
          <div className="order-1 md:order-2 relative aspect-[4/3] w-full">
          <Image
            src={writing.images?.large || '/placeholder.jpg'}
            alt={writing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            priority
          />
        </div>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="w-full mx-auto -mt-4 sm:-mt-8 mb-8 sm:mb-16">
          <DecorativeLine />
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mb-8 sm:mb-16">
          <div className="prose prose-invert prose-sm sm:prose">
            {writing.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-sm sm:text-base text-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-8 sm:mb-16">
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold">Words About My Words</h2>
            <div className="flex gap-2">
              <button className="p-1.5 sm:p-2 rounded-full border border-gray-700">&larr;</button>
              <button className="p-1.5 sm:p-2 rounded-full border border-gray-700">&rarr;</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {comments.slice(0, 3).map((comment, index) => (
              <WordCard
                key={index}
                author={comment.name}
                content={comment.comment}
                rating={5}
              />
            ))}
          </div>
        </section>

        <RatingForm />

        {/* Related Articles */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="group">
              <div className="relative aspect-[4/3] w-full">
              <Image
                src="/placeholder.jpg"
                alt="Related article"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-lg"
              />
            </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  Title
                </h3>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Article</span>
                  <span>15 November 2024</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}