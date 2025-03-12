// src/components/ui/dialog.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Dialog = ({ open, onOpenChange, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onOpenChange?.(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-background rounded-lg shadow-xl m-4"
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const DialogHeader = ({ children, className = '' }) => {
  return <div className={`mb-6 ${className}`}>{children}</div>;
};

export const DialogTitle = ({ children, className = '' }) => {
  return <h2 className={`text-xl font-semibold text-foreground ${className}`}>{children}</h2>;
};

export const DialogDescription = ({ children, className = '' }) => {
  return <p className={`text-sm text-gray-500 mt-2 ${className}`}>{children}</p>;
};

export const DialogTrigger = ({ children, asChild }) => {
  return children;
};