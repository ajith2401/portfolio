'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SubscriptionForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    blog: true,
    quill: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!preferences.blog && !preferences.quill) {
      newErrors.preferences = 'Please select at least one subscription option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to subscribe');
      }

      // Save to localStorage for returning visitors
      localStorage.setItem('subscribed', 'true');
      localStorage.setItem('subscribedEmail', email);
      
      // Success notification
      toast.success('Successfully subscribed!');
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
    
    // Clear preference error if at least one is selected
    if (errors.preferences && !preferences[preference]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.preferences;
        return newErrors;
      });
    }
  };

  return (
    <div className="subscription-modal-overlay fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="subscription-modal-content relative w-full max-w-md modern-card rounded-xl p-6 shadow-lg animate-fade-in-up z-[10000]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-tertiary transition-colors"
          aria-label="Close subscription form"
        >
          <X className="w-5 h-5 text-muted" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Stay Updated</h2>
          <p className="text-secondary">
            Subscribe to receive notifications about new content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubscribe}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`modern-input w-full px-4 py-3 rounded-lg ${
                errors.email ? 'border-error' : ''
              } relative z-[10001]`}
              placeholder="your@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium text-secondary mb-2">
              I want to subscribe to:
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.blog}
                  onChange={() => handleCheckboxChange('blog')}
                />
                <span className="text-primary">Tech Blog Updates</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.quill}
                  onChange={() => handleCheckboxChange('quill')}
                />
                <span className="text-primary">Tamil Writings (Quill)</span>
              </label>
            </div>
            {errors.preferences && (
              <p className="mt-1 text-sm text-red-500">{errors.preferences}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`modern-btn w-full py-2 px-4 rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {/* Privacy note */}
        <p className="mt-4 text-xs text-center text-muted">
          By subscribing, you agree to receive email notifications.
          You can unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionForm;