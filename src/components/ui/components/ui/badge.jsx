// src/components/ui/badge.jsx
import React from 'react';

export function Badge({ variant = 'default', className = '', children, ...props }) {
  const variants = {
    default: 'bg-accent-primary text-white',
    secondary: 'bg-tertiary text-primary',
    destructive: 'bg-error text-white',
    outline: 'border border-color text-primary',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    info: 'bg-info text-white',
  };

  return (
    <span
      className={`status-badge inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}