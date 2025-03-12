// src/components/ui/badge.jsx
import React from 'react';

export function Badge({ variant = 'default', className = '', children, ...props }) {
  const variants = {
    default: 'bg-gray-900 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-200 text-gray-900',
    success: 'bg-green-500 text-white',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}