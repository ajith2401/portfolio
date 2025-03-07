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
      <div className={`
        relative w-full max-w-md p-6 rounded-xl shadow-xl transition-all duration-300 transform
        bg-background
        ${isDark ? 'border-slate-800' : ' border-sky-100'}
        animate-fade-in-up
      `}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className={`
            absolute top-4 right-4 p-2 rounded-full transition-colors
            ${isDark ? 'hover:bg-slate-800' : 'hover:bg-sky-50'}
          `}
          aria-label="Close contact form"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>
        
        <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Get in Touch
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 rounded-md border transition-colors
                ${isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-400' 
                  : 'bg-white border-sky-200 text-slate-900 focus:border-primary-600'}
                ${errors.name ? 'border-red-500' : ''}
                focus:outline-none focus:ring-1 focus:ring-primary
              `}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 rounded-md border transition-colors
                ${isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-400' 
                  : 'bg-white border-sky-200 text-slate-900 focus:border-primary-600'}
                ${errors.email ? 'border-red-500' : ''}
                focus:outline-none focus:ring-1 focus:ring-primary
              `}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div>
            <label 
              htmlFor="subject" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 rounded-md border transition-colors
                ${isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-400' 
                  : 'bg-white border-sky-200 text-slate-900 focus:border-primary-600'}
                ${errors.subject ? 'border-red-500' : ''}
                focus:outline-none focus:ring-1 focus:ring-primary
              `}
              placeholder="What is this regarding?"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
          </div>
          
          <div>
            <label 
              htmlFor="message" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={`
                w-full px-4 py-2 rounded-md border transition-colors
                ${isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-primary-400' 
                  : 'bg-white border-sky-200 text-slate-900 focus:border-primary-600'}
                ${errors.message ? 'border-red-500' : ''}
                focus:outline-none focus:ring-1 focus:ring-primary
              `}
              placeholder="Your message here..."
            />
            {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full px-6 py-3 rounded-full transition-all duration-300
              ${isDark
                ? 'bg-primary-400 text-slate-900 hover:bg-primary-300'
                : 'bg-primary-600 text-white hover:bg-primary-700'}
              hover:shadow-lg
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
              Thank you! Your message has been sent successfully.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
              Oops! Something went wrong. Please try again later.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;