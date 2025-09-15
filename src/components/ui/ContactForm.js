'use client';

import { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { ThemeContext } from '../theme/themeProvider';

const ContactForm = ({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md p-6 rounded-xl shadow-xl transition-all duration-300 transform modern-card animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:bg-tertiary text-secondary hover:text-primary"
          aria-label="Close contact form"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-semibold mb-6 text-primary">
          Get in Touch
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-secondary"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`modern-input ${errors.name ? 'border-error' : ''}`}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
          </div>
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-secondary"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`modern-input ${errors.email ? 'border-error' : ''}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
          </div>
          
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium mb-1 text-secondary"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`modern-input ${errors.subject ? 'border-error' : ''}`}
              placeholder="What is this regarding?"
            />
            {errors.subject && <p className="mt-1 text-sm text-error">{errors.subject}</p>}
          </div>
          
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1 text-secondary"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={`modern-input resize-vertical ${errors.message ? 'border-error' : ''}`}
              placeholder="Your message here..."
            />
            {errors.message && <p className="mt-1 text-sm text-error">{errors.message}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="modern-btn w-full disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitStatus === 'success' && (
            <div className="mt-4 p-3 bg-success/10 text-success rounded-xl border border-success/20">
              Thank you! Your message has been sent successfully.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 p-3 bg-error/10 text-error rounded-xl border border-error/20">
              Oops! Something went wrong. Please try again later.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;