'use client';

import { useState, useEffect } from 'react';
import SubscriptionForm from './SubscriptionForm';
import eventEmitter from '@/lib/eventEmitter';

const SubscriptionModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check if user already subscribed (from localStorage)
  useEffect(() => {
    const hasSubscribed = localStorage.getItem('subscribed') === 'true';
    
    // Don't show modal if already subscribed
    if (hasSubscribed) return;
    
    // Check if user dismissed modal recently
    const dismissedTimestamp = localStorage.getItem('subscription_dismissed');
    if (dismissedTimestamp) {
      const dismissedTime = parseInt(dismissedTimestamp, 10);
      const currentTime = Date.now();
      
      // If dismissed within the last 7 days, don't show modal
      if (currentTime - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }
    
    // Count time on page
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);
    
    // Scroll detection
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Set hasScrolled to true if scrolled 25% of page
      if (scrollPosition > (pageHeight - windowHeight) * 0.25) {
        setHasScrolled(true);
      }
    };
    
    // User interaction detection
    const handleInteraction = () => {
      setHasInteracted(true);
    };
    
    // Check URL for resubscribe parameter
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('resubscribe') === 'true') {
        setShowModal(true);
      }
    };
    
    // Listen for manual show modal events
    const handleShowSubscribeModal = (preferences = {}) => {
      setShowModal(true);
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleInteraction);
    
    // Add event listener for subscription modal trigger
    if (eventEmitter) {
      eventEmitter.on('showSubscriptionModal', handleShowSubscribeModal);
    }
    
    // Check URL parameters on mount
    checkUrlParams();
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleInteraction);
      
      if (eventEmitter) {
        eventEmitter.off('showSubscriptionModal', handleShowSubscribeModal);
      }
    };
  }, []);
  
  // Decide when to show modal
  useEffect(() => {
    // Show after 30 seconds or significant scroll and interaction
    if ((timeOnPage > 30 || (hasScrolled && hasInteracted)) && 
        localStorage.getItem('subscribed') !== 'true') {
      setShowModal(true);
    }
  }, [timeOnPage, hasScrolled, hasInteracted]);
  
  const handleClose = () => {
    setShowModal(false);
    
    // Save dismissed timestamp for 7-day cooldown
    localStorage.setItem('subscription_dismissed', Date.now().toString());
  };
  
  if (!showModal) return null;
  
  return <SubscriptionForm onClose={handleClose} />;
};

export default SubscriptionModal;