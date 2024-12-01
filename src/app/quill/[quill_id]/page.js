'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Share, Star } from 'lucide-react';
import RatingForm from '@/components/ui/form/RatingForm';
import DecorativeLine from '@/components/ui/DecorativeLine';

const WordCard = ({ author, content, rating = 5 }) => (
  <div className="p-6 rounded-lg bg-[#1A1A1A] hover:bg-[#242424] transition-colors">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
    <p className="text-sm text-gray-300 mb-4">{content}</p>
    <p className="text-sm text-gray-400">{author}</p>
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
    return <div>Loading...</div>;
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button and Share Section */}
        <div className="py-6">
          <Link href="/quill" className="inline-flex items-center text-sm hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>

        {/* Header Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-400">{writing.category}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-400">{formatDate(writing.createdAt)}</span>
            </div>
            <h1 className="text-4xl text-foreground font-bold mb-8">{writing.title}</h1>
            <div className="flex gap-4">
              <button className="p-2 rounded-full border border-gray-700 hover:bg-gray-800">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative h-[400px]">
            <Image
              src={writing.images?.large || '/placeholder.jpg'}
              alt={writing.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>

    {/* Decorative Line */}
        <div className="w-full mx-auto -mt-8 mb-16">
          <DecorativeLine />
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mb-16">
          <div className="prose prose-invert">
            {writing.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Words About My Words</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-gray-700">&larr;</button>
              <button className="p-2 rounded-full border border-gray-700">&rarr;</button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
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

       <RatingForm/>

        {/* Related Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="group">
                <div className="relative h-48 mb-4">
                  <Image
                    src="/placeholder.jpg"
                    alt="Related article"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  Title
                </h3>
                <div className="flex justify-between text-sm text-gray-400">
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