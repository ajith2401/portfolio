'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SubscriptionForm from './SubscriptionForm';
import eventEmitter from '@/lib/eventEmitter';

const SubscriptionModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();
  
  // Check if the current path is a content detail page
  const isContentDetailPage = () => {
    // Match patterns for individual content pages:
    // - /quill/[id] (writings)
    // - /blog/[id] (blog posts)
    // - /devfolio/[id] (portfolio items)
    const contentPathRegex = /^\/(quill|blog|devfolio)\/[a-zA-Z0-9]+/;
    return contentPathRegex.test(pathname);
  };
  
  // Should we show subscription modal for this user on this page?
  const shouldShowForUser = () => {
    // Don't show if user already subscribed
    if (localStorage.getItem('subscribed') === 'true') {
      return false;
    }
    
    // Check if user dismissed modal recently
    const dismissedTimestamp = localStorage.getItem('subscription_dismissed');
    if (dismissedTimestamp) {
      const dismissedTime = parseInt(dismissedTimestamp, 10);
      const currentTime = Date.now();
      
      // If dismissed within the last 7 days, don't show modal
      if (currentTime - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return false;
      }
    }
    
    // Also check if this specific content page has been seen
    const viewedContentPages = JSON.parse(localStorage.getItem('viewed_content_pages') || '[]');
    if (viewedContentPages.includes(pathname)) {
      return false;
    }
    
    return true;
  };

  // Check if user already subscribed (from localStorage)
  useEffect(() => {
    const mounted = typeof window !== 'undefined';
    if (!mounted) return;
    
    // Check if this is a content page and if we should show subscription
    const isContentPage = isContentDetailPage();
    const shouldShow = shouldShowForUser();
    
    // For content detail pages: show after a short delay (but only if appropriate)
    if (isContentPage && shouldShow) {
      // Record this content page as viewed to avoid showing too often
      const viewedContentPages = JSON.parse(localStorage.getItem('viewed_content_pages') || '[]');
      localStorage.setItem('viewed_content_pages', JSON.stringify([...viewedContentPages, pathname]));
      
      // Set a delay before showing the subscription modal (10 seconds)
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    }
    
    // For non-content pages or if we shouldn't show yet: use regular timing logic
    
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
    const handleShowSubscribeModal = () => {
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
  }, [pathname]);
  
  // Decide when to show modal for non-content pages
  useEffect(() => {
    // Only run this effect if not already showing the modal
    // and we're not on a content detail page
    if (showModal || isContentDetailPage()) {
      return;
    }
    
    // Show after 30 seconds or significant scroll and interaction
    if ((timeOnPage > 30 || (hasScrolled && hasInteracted)) && 
        localStorage.getItem('subscribed') !== 'true') {
      setShowModal(true);
    }
  }, [timeOnPage, hasScrolled, hasInteracted, showModal]);
  
  const handleClose = () => {
    setShowModal(false);
    
    // Save dismissed timestamp for 7-day cooldown
    localStorage.setItem('subscription_dismissed', Date.now().toString());
  };
  
  if (!showModal) return null;
  
  return <SubscriptionForm onClose={handleClose} />;
};

export default SubscriptionModal;