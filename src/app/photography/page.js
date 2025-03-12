// src/app/photography/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useGetPhotoServicesQuery } from '@/services/api';

// Components for the page
const PhotoServiceCard = ({ service }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        {service.images?.thumbnail ? (
          <Image 
            src={service.images.thumbnail} 
            alt={service.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{service.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
        
        <div className="mt-2 flex items-baseline gap-2">
          {service.discountPrice ? (
            <>
              <span className="text-xl font-bold text-indigo-600">₹{service.discountPrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{service.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-indigo-600">₹{service.price}</span>
          )}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {service.features && service.features.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="inline-block bg-gray-100 px-2 py-1 text-xs rounded">
              {feature}
            </span>
          ))}
          {service.features && service.features.length > 3 && 
            <span className="inline-block px-2 py-1 text-xs">+{service.features.length - 3} more</span>
          }
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">{service.duration}</span>
          <Link 
            href={`/photography/${service.slug}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const CategoryFilter = ({ categories, activeCategory, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 text-sm rounded-full transition-colors ${
          activeCategory === 'all' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Services
      </button>
      
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 text-sm rounded-full transition-colors ${
            activeCategory === category 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default function PhotographyPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const searchParams = useSearchParams();

  // Get category from URL if present
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  // RTK Query hook to fetch photography services
  const { data, error, isLoading } = useGetPhotoServicesQuery({ 
    category: activeCategory !== 'all' ? activeCategory : '' 
  });

  const services = data?.services || [];
  
  // Extract unique categories from services
  const categories = React.useMemo(() => {
    if (!services.length) return [];
    return [...new Set(services.map(service => service.category))];
  }, [services]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Photography Services</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional photography services for all occasions - weddings, portraits, and more.
          Capture your special moments with high-quality photography.
        </p>
      </div>
      
      {/* Category Filter */}
      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        onChange={handleCategoryChange} 
      />
      
      {/* Services Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">Error loading services: {error.message || 'Something went wrong'}</p>
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <PhotoServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No services found in this category.</p>
        </div>
      )}
    </div>
  );
}