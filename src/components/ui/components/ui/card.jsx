// src/components/ui/card.jsx
import React from 'react';

export function Card({ className = '', ...props }) {
  return (
    <div
      className={`glass-card shimmer premium-border glow-on-hover glass-card-light shimmer-light premium-border-light glow-on-hover-light ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={`text-xl font-semibold ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`text-sm text-gray-500 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />;
}