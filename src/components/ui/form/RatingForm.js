// src/components/ui/form/RatingForm.jsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useParams } from 'next/navigation';

const RatingForm = ({ contentType = 'Writing', contentId }) => {
  const params = useParams();
  // Use provided contentId or get it from route params
  const id = contentId || params.blog_id || params.quillId || '';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });

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
    
    setIsSubmitting(true);
    
    try {
      // Use unified API endpoint
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
          rating: rating,
          parentId: id,
          parentModel: contentType === 'techblog' ? 'TechBlog' : 'Writing'
        }),
      });
      
      if (response.ok) {
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
        
      } else {
        const error = await response.json();
        setSubmitMessage(`Error: ${error.message || 'Failed to submit'}`);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-[1440px] py-8 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 mx-auto">
      <div className="glass-container w-full max-w-[846px] flex flex-col justify-center items-center gap-4 sm:gap-7 relative mx-auto rounded-lg sm:rounded-[24px] p-6 sm:p-12 md:p-[88px_104px]">
        <div className="relative z-10 w-full max-w-[638px] flex flex-col items-center gap-4 sm:gap-7">
          {/* Title Section */}
          <div className="text-center mb-2 sm:mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-semibold leading-normal sm:leading-[54px] mb-2 sm:mb-3 text-foreground">
              Share Your Experience
            </h2>
            <p className="text-base sm:text-lg md:text-[20px] leading-normal sm:leading-[30px] text-foreground/80">
              Give a star rating and let me know your impressions.
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="w-6 h-6 sm:w-8 sm:h-8 focus:outline-none transition-colors"
              >
                <Star
                  className={`w-full h-full ${
                    star <= rating 
                      ? 'text-[#FFC400] fill-[#FFC400] stroke-[#FFC300]' 
                      : 'dark:text-[#D4D4D4] dark:fill-[#D4D4D4] text-[#C0C0C0] fill-[#C0C0C0]'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-7">
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className="glass-input w-full h-12 sm:h-[59px] px-4 sm:px-10 text-center text-base sm:text-lg leading-normal sm:leading-[27px] rounded-md sm:rounded-lg"
              required
            />

            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              className="glass-input w-full h-12 sm:h-[59px] px-4 sm:px-10 text-center text-base sm:text-lg leading-normal sm:leading-[27px] rounded-md sm:rounded-lg"
              required
            />

            <textarea
              placeholder="Write your thoughts here..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({...prev, comment: e.target.value}))}
              rows={4}
              className="glass-input w-full h-24 sm:h-[121px] px-4 sm:px-10 pt-3 sm:pt-4 text-center text-base sm:text-lg leading-normal sm:leading-[27px] rounded-md sm:rounded-lg resize-none"
              required
            />
            
            {submitMessage && (
              <div className={`text-center p-2 rounded ${submitMessage.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {submitMessage}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-[59px] bg-primary text-white rounded-md sm:rounded-lg font-medium text-base sm:text-lg transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
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