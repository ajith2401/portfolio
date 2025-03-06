// app/not-found.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [suggestions, setSuggestions] = useState([]);
  
  useEffect(() => {
    async function fetchSuggestions() {
      const res = await fetch('/api/popular-content');
      const data = await res.json();
      setSuggestions(data);
    }
    
    fetchSuggestions();
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-6">Page Not Found</h1>
      <p className="text-xl mb-8">Sorry, we couldn&apos;t find the page you&lsquo;re looking for.</p>
      
      <Link href="/" className="text-blue-600 hover:underline mb-12 inline-block">
        Return to Home
      </Link>
      
      {suggestions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">You might be interested in:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map(item => (
              <Link
                key={item._id}
                href={`/${item.type}/${item._id}`}
                className="p-4 border rounded hover:bg-gray-50"
              >
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}