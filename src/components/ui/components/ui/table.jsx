// src/components/ui/table.jsx
import React from 'react';

export function Table({ className = '', ...props }) {
  return (
    <table
      className={`w-full caption-bottom text-sm ${className}`}
      {...props}
    />
  );
}

export function TableHeader({ className = '', ...props }) {
  return (
    <thead className={`[&_tr]:border-b ${className}`} {...props} />
  );
}

export function TableHead({ className = '', ...props }) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

export function TableBody({ className = '', ...props }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />;
}

export function TableRow({ className = '', ...props }) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50 ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = '', ...props }) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

export function TableFooter({ className = '', ...props }) {
  return (
    <tfoot
      className={`border-t bg-gray-50 font-medium text-gray-900 ${className}`}
      {...props}
    />
  );
}

export function TableCaption({ className = '', ...props }) {
  return (
    <caption
      className={`mt-4 text-sm text-gray-500 ${className}`}
      {...props}
    />
  );
}