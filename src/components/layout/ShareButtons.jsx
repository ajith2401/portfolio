// src/components/ui/ShareButtons.jsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, Check, Share } from 'lucide-react';

const ShareButtons = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Only access window on client side
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      
      // Fallback for browsers without clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = 0;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setIsCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setIsCopied(false), 2000);
        } else {
          throw new Error('Copy command failed');
        }
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        toast.error('Failed to copy link');
      }
    }
  };

  const handleShare = (platform) => {
    if (!shareUrl) return;
    
    const title = document.title;
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(title + ': ' + shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${shareUrl}`)}`;
        break;
      case 'native':
        // Use Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: title,
            url: shareUrl
          }).catch(err => console.error('Error sharing:', err));
          return;
        }
        // If Web Share API is not available, copy the link instead
        handleCopyLink();
        return;
      default:
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-dm-sans text-base font-medium">SHARE</p>
      <div className="flex items-center gap-3">
        {/* Copy Link Button */}
        <button 
          onClick={handleCopyLink}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
          aria-label="Copy link to clipboard"
        >
          {isCopied ? 
            <Check className="h-5 w-5 text-green-600" /> : 
            <Copy className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          }
        </button>
        
        {/* Native Share Button (visible on mobile) */}
        <button
          onClick={() => handleShare('native')}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
          aria-label="Share via native sharing"
        >
          <Share className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        
        {/* WhatsApp Button */}
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
          aria-label="Share on WhatsApp"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" fill="currentColor"/>
          </svg>
        </button>
        
        {/* Facebook Button */}
        <button
          onClick={() => handleShare('facebook')}
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
          aria-label="Share on Facebook"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </button>
        
        {/* Twitter Button */}
        <button
          onClick={() => handleShare('twitter')}
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
          aria-label="Share on Twitter"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
        </button>
        
        {/* Email Button */}
        <button
          onClick={() => handleShare('email')}
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
          aria-label="Share via Email"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-700 dark:text-gray-300"
          >
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;