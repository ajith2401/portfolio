'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

const RatingForm = () => {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    thoughts: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ rating, ...formData });
  };

  return (
    <section className="w-[1440px] h-[895px] py-[120px] px-[297px] mx-auto">
      <div className="glass-container w-[846px] h-[655px] flex flex-col justify-center items-center gap-7 relative mx-auto rounded-[24px] p-[88px_104px]">
        <div className="relative z-10 w-[638px] flex flex-col items-center gap-7">
          {/* Title Section */}
          <div className="text-center mb-3">
            <h2 className="text-[36px] font-semibold leading-[54px] mb-3 text-foreground">
              Share Your Experience
            </h2>
            <p className="text-[20px] leading-[30px] text-foreground/80">
              Give a star rating and let me know your impressions.
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="w-8 h-8 focus:outline-none transition-colors"
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
          <form onSubmit={handleSubmit} className="w-full space-y-7">
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className="glass-input w-full h-[59px] px-10 text-center text-[18px] leading-[27px] rounded-[8px]"
            />

            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              className="glass-input w-full h-[59px] px-10 text-center text-[18px] leading-[27px] rounded-[8px]"
            />

            <textarea
              placeholder="Write your thoughts here..."
              value={formData.thoughts}
              onChange={(e) => setFormData(prev => ({...prev, thoughts: e.target.value}))}
              rows={4}
              className="glass-input w-full h-[121px] px-10 pt-4 text-center text-[18px] leading-[27px] rounded-[8px] resize-none"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default RatingForm;