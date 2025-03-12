// src/components/ui/separator.jsx
import React from 'react';

export function Separator({ orientation = 'horizontal', className = '', ...props }) {
  return (
    <div
      className={`shrink-0 bg-gray-200 ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      } ${className}`}
      {...props}
    />
  );
}