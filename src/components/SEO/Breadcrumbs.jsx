// src/components/SEO/Breadcrumbs.jsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ 
  customItems = [], 
  showHome = true, 
  className = "",
  separator = "chevron" // "chevron", "slash", "arrow"
}) {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname if no custom items provided
  const generateBreadcrumbsFromPath = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];
    
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: Home
      });
    }
    
    // Map common routes to friendly names
    const routeMap = {
      'blog': 'Technical Blog',
      'quill': 'Poetry & Writings',
      'devfolio': 'Projects Portfolio',
      'spotlight': 'Published Books',
      'about': 'About',
      'contact': 'Contact',
      'category': 'Category',
      'tag': 'Tag',
      'search': 'Search',
      'archive': 'Archive'
    };
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip ObjectId-like segments (will be replaced by actual titles)
      if (/^[0-9a-f]{24}$/i.test(segment)) {
        return;
      }
      
      // Convert slug to readable name
      const label = routeMap[segment] || 
                   segment.replace(/-/g, ' ')
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = customItems.length > 0 ? customItems : generateBreadcrumbsFromPath();
  
  // Don't render breadcrumbs on home page unless there are custom items
  if (pathname === '/' && customItems.length === 0) {
    return null;
  }
  
  // Don't render if only one item (usually just Home)
  if (breadcrumbItems.length <= 1) {
    return null;
  }
  
  const getSeparator = () => {
    switch (separator) {
      case 'slash':
        return <span className="text-gray-400 dark:text-gray-500 mx-2">/</span>;
      case 'arrow':
        return <span className="text-gray-400 dark:text-gray-500 mx-2">→</span>;
      case 'chevron':
      default:
        return <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-2" />;
    }
  };
  
  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-1 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const Icon = item.icon;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && getSeparator()}
                
                {isLast ? (
                  <span 
                    className="text-gray-900 dark:text-white font-medium flex items-center gap-1"
                    aria-current="page"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      
      {/* Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.label,
              "item": item.href ? `https://www.ajithkumarr.com${item.href}` : undefined
            }))
          })
        }}
      />
    </>
  );
}

// Pre-built breadcrumb configurations for common pages
export const BlogBreadcrumbs = ({ title, category, slug }) => (
  <Breadcrumbs
    customItems={[
      { label: 'Home', href: '/', icon: Home },
      { label: 'Technical Blog', href: '/blog' },
      ...(category ? [{ label: category, href: `/category/${category.toLowerCase().replace(/\s+/g, '-')}` }] : []),
      { label: title, href: `/blog/${slug}`, isLast: true }
    ]}
  />
);

export const WritingBreadcrumbs = ({ title, category, slug }) => (
  <Breadcrumbs
    customItems={[
      { label: 'Home', href: '/', icon: Home },
      { label: 'Poetry & Writings', href: '/quill' },
      ...(category ? [{ label: category, href: `/category/${category.toLowerCase().replace(/\s+/g, '-')}` }] : []),
      { label: title, href: `/quill/${slug}`, isLast: true }
    ]}
  />
);

export const ProjectBreadcrumbs = ({ title, category, slug }) => (
  <Breadcrumbs
    customItems={[
      { label: 'Home', href: '/', icon: Home },
      { label: 'Projects Portfolio', href: '/devfolio' },
      ...(category ? [{ label: category, href: `/category/${category.toLowerCase().replace(/\s+/g, '-')}` }] : []),
      { label: title, href: `/devfolio/${slug}`, isLast: true }
    ]}
  />
);

export const BookBreadcrumbs = ({ title, slug }) => (
  <Breadcrumbs
    customItems={[
      { label: 'Home', href: '/', icon: Home },
      { label: 'Published Books', href: '/spotlight' },
      { label: title, href: `/spotlight/${slug}`, isLast: true }
    ]}
  />
);

export const CategoryBreadcrumbs = ({ category }) => (
  <Breadcrumbs
    customItems={[
      { label: 'Home', href: '/', icon: Home },
      { label: 'Categories', href: '/categories' },
      { label: category, href: `/category/${category.toLowerCase().replace(/\s+/g, '-')}`, isLast: true }
    ]}
  />
);

export const SearchBreadcrumbs = ({ query }) => (
  <Breadcrumbs
    customItems={[
      { label: 'Home', href: '/', icon: Home },
      { label: 'Search Results', href: '/search' },
      { label: `"${query}"`, href: `/search?q=${encodeURIComponent(query)}`, isLast: true }
    ]}
  />
);