// src/components/ErrorBoundary.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Send error to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      this.reportError(error, errorInfo);
    }
  }

  reportError = (error, errorInfo) => {
    try {
      // Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: `${error.name}: ${error.message}`,
          fatal: false,
          event_category: 'Error',
          event_label: errorInfo.componentStack?.split('\n')[1]?.trim() || 'Unknown'
        });
      }

      // Send to custom error tracking endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorId: this.state.errorId,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          props: this.props.errorContext || {}
        }),
      }).catch(err => {
        console.warn('Failed to report error:', err);
      });
    } catch (reportingError) {
      console.warn('Error reporting failed:', reportingError);
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Determine error type for better messaging
      const errorType = this.getErrorType(this.state.error);
      
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {errorType.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {errorType.message}
            </p>

            {/* Error ID for support */}
            {this.state.errorId && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Error ID: <code className="font-mono">{this.state.errorId}</code>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Still having trouble?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                  Development Error Details
                </summary>
                <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-xs">
                  <div className="font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div className="mt-2 font-mono text-red-500 dark:text-red-300 whitespace-pre-wrap text-xs">
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  getErrorType(error) {
    if (!error) {
      return {
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'
      };
    }

    // Network errors
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to our servers. Please check your internet connection and try again.'
      };
    }

    // Chunk loading errors (common in React apps)
    if (error.message?.includes('ChunkLoadError') || error.message?.includes('Loading chunk')) {
      return {
        title: 'Loading Error',
        message: 'Failed to load some resources. This usually happens after an app update. Please refresh the page.'
      };
    }

    // Rendering errors
    if (error.message?.includes('Cannot read property') || error.message?.includes('Cannot read properties')) {
      return {
        title: 'Display Error',
        message: 'There was a problem displaying this content. Our team has been notified and we\'re working to fix it.'
      };
    }

    // Database/API errors
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      return {
        title: 'Content Not Found',
        message: 'The content you\'re looking for might have been moved or is temporarily unavailable.'
      };
    }

    // Generic error
    return {
      title: 'Unexpected Error',
      message: 'Something unexpected happened. Our team has been notified and we\'re working to resolve the issue.'
    };
  }
}

// HOC for easier usage
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for manual error reporting
export function useErrorHandler() {
  return (error, errorInfo = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Manual error report:', error, errorInfo);
    }

    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message || error.toString(),
          fatal: false,
          event_category: 'Manual Error',
          event_label: errorInfo.context || 'Unknown'
        });
      }

      // Send to custom endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorId: Date.now().toString(36) + Math.random().toString(36).substr(2),
          message: error.message || error.toString(),
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          context: errorInfo,
          type: 'manual'
        }),
      }).catch(err => {
        console.warn('Failed to report manual error:', err);
      });
    }
  };
}

export default ErrorBoundary;