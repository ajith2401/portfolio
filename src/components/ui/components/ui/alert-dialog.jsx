// src/components/ui/alert-dialog.jsx
'use client';

import React from 'react';
import { Dialog } from './dialog';

export const AlertDialog = ({ open, onOpenChange, children }) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>{children}</Dialog>;
};

export const AlertDialogContent = ({ children, className = '' }) => {
  return <div className={`p-6 max-w-md mx-auto ${className}`}>{children}</div>;
};

export const AlertDialogHeader = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const AlertDialogTitle = ({ children, className = '' }) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};

export const AlertDialogDescription = ({ children, className = '' }) => {
  return <p className={`text-sm text-gray-500 mt-2 ${className}`}>{children}</p>;
};

export const AlertDialogFooter = ({ children, className = '' }) => {
  return <div className={`flex justify-end space-x-2 mt-6 ${className}`}>{children}</div>;
};

export const AlertDialogAction = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const AlertDialogCancel = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};