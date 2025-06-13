// src/app/not-found.js
import Link from 'next/link';
import { Search, Home, BookOpen, Code, PenTool, Sparkles } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Ajithkumar',
  description: 'The page you are looking for does not exist. Explore our blog, poetry, projects, or return to homepage.',
  robots: 'noindex,nofollow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The page you're looking for doesn't exist or may have been moved. 
            Let's get you back on track!
          </p>
          
          {/* Search Suggestion */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700 mb-8">
            <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-2">
              <Search className="w-5 h-5 mr-2" />
              <span className="text-sm">Looking for something specific?</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try searching our content or explore the sections below
            </p>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Home */}
          <Link 
            href="/"
            className="group p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-3">
              <Home className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Home
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Return to the homepage and start fresh
            </p>
          </Link>

          {/* Tech Blog */}
          <Link 
            href="/blog"
            className="group p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-3">
              <Code className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Tech Blog
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore React, Next.js, and MERN stack tutorials
            </p>
          </Link>

          {/* Poetry & Writings */}
          <Link 
            href="/quill"
            className="group p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-3">
              <PenTool className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Tamil Poetry
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover Tamil poetry, philosophy, and creative writings
            </p>
          </Link>

          {/* Projects Portfolio */}
          <Link 
            href="/devfolio"
            className="group p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-3">
              <Code className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Projects
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View AI/ML projects and web applications
            </p>
          </Link>
        </div>

        {/* Published Books Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-8 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6 text-amber-600 mr-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Published Tamil Poetry Books
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Explore my collection of 5 published Tamil poetry books
          </p>
          <Link 
            href="/spotlight"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View Books
          </Link>
        </div>

        {/* Popular Content Suggestions */}
        <div className="text-left bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Popular Content You Might Enjoy
          </h3>
          <div className="space-y-3">
            <Link 
              href="/blog"
              className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              → React Hooks Complete Guide
            </Link>
            <Link 
              href="/blog"
              className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              → Next.js SEO Best Practices
            </Link>
            <Link 
              href="/quill"
              className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
            >
              → Tamil Poetry Collection
            </Link>
            <Link 
              href="/devfolio"
              className="block text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
            >
              → AI Disease Prediction System
            </Link>
          </div>
        </div>

        {/* Contact Option */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still can't find what you're looking for?
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get in Touch
          </Link>
        </div>

        {/* SEO-friendly footer */}
        <div className="mt-12 text-xs text-gray-500 dark:text-gray-400">
          <p>
            Ajithkumar - Tamil Writer, Poet & Full Stack Developer | 
            React.js, Next.js, Node.js, MongoDB | 
            Published Tamil Poetry Books
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 blur-3xl"></div>
      </div>
    </div>
  );
}