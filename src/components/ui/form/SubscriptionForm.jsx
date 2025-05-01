'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SubscriptionForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    blog: true,
    quill: false,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md clean-container rounded-xl p-6 shadow-lg animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close subscription form"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Stay Updated</h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            Subscribe to receive notifications about new content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubscribe}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg bg-background border ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <p className="block text-sm font-medium text-foreground mb-2">
              I want to subscribe to:
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.blog}
                  onChange={() => handleCheckboxChange('blog')}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-foreground">Tech Blog Updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.quill}
                  onChange={() => handleCheckboxChange('quill')}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-foreground">Tamil Writings (Quill)</span>
              </label>
            </div>
            {errors.preferences && (
              <p className="mt-1 text-sm text-red-500">{errors.preferences}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {/* Privacy note */}
        <p className="mt-4 text-xs text-center text-secondary-500">
          By subscribing, you agree to receive email notifications. 
          You can unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionForm;