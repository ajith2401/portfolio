'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import RatingForm from '@/components/ui/form/RatingForm';
import DecorativeLine from '@/components/ui/DecorativeLine';
import QuillPageHeader from '@/components/layout/QuillPageHeader';

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

const truncateBody = (text) => {
  if (!text) return '';
  
  // Remove special characters and multiple spaces
  const cleanText = text
    .replace(/[!,.?":;]/g, '') // Remove special characters
    .replace(/\n/g, ' ') // Remove newlines
    .replace(/\s+/g, ' ') // Remove multiple spaces
    .trim(); // Remove leading/trailing spaces

  // Get first 5 words
  const words = cleanText.split(' ').slice(0, 3);
  
  // Only add ... if there are more words
  const hasMoreWords = cleanText.split(' ').length > 5;
  return `${words.join(' ')}${hasMoreWords ? ' ...' : ''}`;
};

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
        <QuillPageHeader writing={writing} />

        {/* Decorative Line */}
        <div className="w-full mx-auto lg:mt-8 sm:-mt-8 mb-8 sm:mb-16">
          <DecorativeLine />
        </div>

        {/* Content Section */}
        <div className="w-full max-w-[1064px] mx-auto mb-36 px-4 sm:px-6 lg:px-8 relative font-merriweather text-lg leading-[34px]">
        <div className="prose prose-lg w-full">
          {writing.body.split('\n').map((paragraph, index) => (
            <p 
              key={index} 
              className="mb-4 text-foreground font-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="w-full border-b border-dashed border-[#949494] opacity-50" />

        {/* Reviews Section */}
        <section className="left-20 mt-36 mb-8 sm:mb-14">
          <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">Words About My Words</h2>
            <div className="flex gap-2">
              <button className="p-1.5 sm:p-2 rounded-full border border-gray-700">&larr;</button>
              <button className="p-1.5 sm:p-2 rounded-full border border-gray-700">&rarr;</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {comments ? comments.slice(0, 3).map((comment, index) => (
              <WordCard
                key={index}
                author={comment.name}
                content={comment.comment}
                rating={5}
              />
            )) : " "}
          </div>
        </section>

        <RatingForm/>

        <div className="w-full border-b border-dashed border-[#949494] opacity-50" />

        {/* Related Articles */}
        <section className="left-20 mb-8 sm:mb-16 mt-28">
          <h2 className="lg:text-5xl sm:text-2xl font-bold mb-4 sm:mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((_, index) => (
              <Link 
                href={`/quill/${writing._id}`} 
                key={writing._id}
                className="w-full md:w-[410.67px] group"
              >
                <div className="flex flex-col gap-6 p-4 rounded-lg transition-all duration-300 ease-in-out 
                  hover:shadow-[var(--card-hover-shadow)] 
                  hover:translate-y-[var(--card-hover-transform)] 
                  hover:bg-[var(--card-hover-bg)]"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-[231.38px] rounded-lg overflow-hidden">
                    <Image
                      src={writing.images?.large || '/placeholder.jpg'}
                      alt={writing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 410px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                      quality={75}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-work-sans text-lg font-medium leading-[21px] transition-colors duration-300 group-hover:text-primary">
                    {writing.title}
                  </h3>
                
                  <p className="font-merriweather text-sm text-foreground leading-[21px] mb-4">
                    {truncateBody(writing.body)}
                  </p>

                  {/* Category and Date Container */}
                  <div className="flex justify-between items-center">
                    {/* Category Tag */}
                    <div className="flex items-center justify-center px-2 py-1.5 bg-[rgba(140,140,140,0.1)] rounded transition-colors duration-300 group-hover:bg-[rgba(140,140,140,0.2)]">
                      <span className="font-work-sans text-xs font-medium leading-[14px] text-gray-400">
                        {writing.category}
                      </span>
                    </div>

                    {/* Date */}
                    <span className="font-work-sans text-xs font-medium leading-[14px] text-gray-400">
                      {formatDate(writing.createdAt)}
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div className="w-full border-b border-dashed border-[#949494] opacity-25" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}