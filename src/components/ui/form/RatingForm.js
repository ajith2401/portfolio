// src/components/ui/form/RatingForm.jsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAddCommentMutation } from '@/services/api';

const RatingForm = ({ contentType = 'Writing', contentId }) => {
  const params = useParams();
  // Use provided contentId or get it from route params
  const id = contentId || params.blog_id || params.quill_id || '';
  
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');
  
  // RTK Query mutation hook
  const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setSubmitMessage('Please select a rating');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.comment) {
      setSubmitMessage('Please fill out all fields');
      return;
    }
    
    try {
      // Use RTK Query mutation with corrected field names
      await addComment({
        name: formData.name,
        email: formData.email,
        comment: formData.comment,
        rating: rating,
        contentId: id,  // This will be mapped to parentId in the API service
        contentType: contentType === 'TechBlog' ? 'TechBlog' : 'Writing'
      }).unwrap();
      
      setSubmitMessage('Thank you for your feedback!');
      setRating(0);
      setFormData({
        name: '',
        email: '',
        comment: ''
      });
      
      // Reset message after 3 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <section className="w-full max-w-[1440px] py-8 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 mx-auto">
      <div className="modern-card w-full max-w-[846px] flex flex-col justify-center items-center gap-4 sm:gap-7 relative mx-auto rounded-xl p-6 sm:p-12 md:p-[88px_104px]">
        <div className="relative z-10 w-full max-w-[638px] flex flex-col items-center gap-4 sm:gap-7">
          {/* Title Section */}
          <div className="text-center mb-2 sm:mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-semibold leading-normal sm:leading-[54px] mb-2 sm:mb-3 text-primary">
              Share Your Experience
            </h2>
            <p className="text-base sm:text-lg md:text-[20px] leading-normal sm:leading-[30px] text-secondary">
              Give a star rating and let me know your impressions.
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="w-8 h-8 sm:w-10 sm:h-10 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                aria-label={`Rate ${star} stars`}
              >
                                <Star
                  className={`w-full h-full transition-all duration-200`}
                  strokeWidth={2}
                  style={{
                    color: star <= rating ? '#f59e0b' : '#94a3b8',
                    fill: star <= rating ? '#f59e0b' : 'transparent',
                    stroke: star <= rating ? '#f59e0b' : '#94a3b8',
                    filter: star <= rating ? 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))' : 'none'
                  }}
                /> </button>
            ))}                         
             </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-7">
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className="modern-input w-full h-12 sm:h-[59px] px-4 sm:px-10 text-center text-base sm:text-lg leading-normal sm:leading-[27px] rounded-md sm:rounded-lg"
              required
            />

            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              className="modern-input w-full h-12 sm:h-[59px] px-4 sm:px-10 text-center text-base sm:text-lg leading-normal sm:leading-[27px] rounded-md sm:rounded-lg"
              required
            />

            <textarea
              placeholder="Write your thoughts here..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({...prev, comment: e.target.value}))}
              rows={4}
              className="modern-input w-full h-24 sm:h-[121px] px-4 sm:px-10 pt-3 sm:pt-4 text-center text-base sm:text-lg leading-normal sm:leading-[27px] rounded-md sm:rounded-lg resize-none"
              required
            />
            
            {submitMessage && (
              <div className={`text-center p-2 rounded ${submitMessage.includes('Error') ? 'bg-error/10 text-error border border-error/20' : 'bg-success/10 text-success border border-success/20'}`}>
                {submitMessage}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="modern-btn w-full h-12 sm:h-[59px] text-white rounded-md sm:rounded-lg font-medium text-base sm:text-lg transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RatingForm;