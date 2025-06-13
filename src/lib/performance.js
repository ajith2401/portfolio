// src/lib/performance.js
'use client';

// Core Web Vitals monitoring for SEO
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Dynamic import to avoid SSR issues
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    // Send metrics to analytics
    function sendToAnalytics(metric) {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          event_label: metric.id,
          non_interaction: true,
          custom_parameter_1: metric.rating, // good, needs-improvement, poor
        });
      }

      // Custom analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }),
        }).catch(err => console.warn('Failed to send web vitals:', err));
      }

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          entries: metric.entries
        });
      }
    }

    // Monitor all Core Web Vitals
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);

    // Additional performance monitoring
    monitorNavigationTiming();
    monitorResourceTiming();
    setupPerformanceObserver();
  }).catch(err => {
    console.warn('Failed to load web-vitals:', err);
  });
}

// Monitor navigation timing
function monitorNavigationTiming() {
  if (!window.performance || !window.performance.getEntriesByType) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = window.performance.getEntriesByType('navigation')[0];
      if (!navigation) return;

      const metrics = {
        // DNS lookup time
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        
        // TCP connection time
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        
        // SSL negotiation time
        sslNegotiation: navigation.secureConnectionStart > 0 
          ? navigation.connectEnd - navigation.secureConnectionStart 
          : 0,
        
        // Time to first byte
        ttfb: navigation.responseStart - navigation.requestStart,
        
        // Response download time
        responseDownload: navigation.responseEnd - navigation.responseStart,
        
        // DOM processing time
        domProcessing: navigation.domComplete - navigation.domLoading,
        
        // Page load complete time
        pageLoadComplete: navigation.loadEventEnd - navigation.navigationStart
      };

      // Send to analytics
      if (window.gtag) {
        Object.entries(metrics).forEach(([key, value]) => {
          if (value > 0) {
            window.gtag('event', 'navigation_timing', {
              event_category: 'Performance',
              event_label: key,
              value: Math.round(value),
              non_interaction: true
            });
          }
        });
      }

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Navigation Timing]', metrics);
      }
    }, 1000);
  });
}

// Monitor resource loading performance
function monitorResourceTiming() {
  if (!window.performance || !window.performance.getEntriesByType) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const resources = window.performance.getEntriesByType('resource');
      
      // Categorize resources
      const resourceTypes = {
        scripts: [],
        stylesheets: [],
        images: [],
        fonts: [],
        other: []
      };

      resources.forEach(resource => {
        const type = getResourceType(resource.name);
        const timing = {
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize || 0,
          cached: resource.transferSize === 0 && resource.decodedBodySize > 0
        };

        resourceTypes[type].push(timing);
      });

      // Find slow resources
      const slowResources = resources
        .filter(r => r.duration > 1000) // Slower than 1 second
        .map(r => ({
          name: r.name,
          duration: Math.round(r.duration),
          size: r.transferSize || 0
        }));

      if (slowResources.length > 0) {
        console.warn('[Slow Resources]', slowResources);
        
        // Report slow resources
        if (window.gtag) {
          slowResources.forEach(resource => {
            window.gtag('event', 'slow_resource', {
              event_category: 'Performance',
              event_label: resource.name,
              value: resource.duration,
              non_interaction: true
            });
          });
        }
      }

      // Log resource summary in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Resource Timing Summary]', {
          scripts: resourceTypes.scripts.length,
          stylesheets: resourceTypes.stylesheets.length,
          images: resourceTypes.images.length,
          fonts: resourceTypes.fonts.length,
          totalResources: resources.length,
          slowResources: slowResources.length
        });
      }
    }, 2000);
  });
}

// Setup Performance Observer for additional metrics
function setupPerformanceObserver() {
  if (!window.PerformanceObserver) return;

  try {
    // Observe long tasks (blocking the main thread)
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Log tasks longer than 50ms
        if (entry.duration > 50) {
          console.warn(`[Long Task] ${Math.round(entry.duration)}ms`, entry);
          
          if (window.gtag) {
            window.gtag('event', 'long_task', {
              event_category: 'Performance',
              value: Math.round(entry.duration),
              non_interaction: true
            });
          }
        }
      });
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Observe layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.hadRecentInput) return; // Ignore user-initiated shifts
        
        console.log(`[Layout Shift] Score: ${entry.value}`, entry);
      });
    });

    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

    // Observe largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      console.log(`[LCP Element]`, {
        element: lastEntry.element,
        value: lastEntry.startTime,
        url: lastEntry.url
      });
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  } catch (error) {
    console.warn('Performance Observer setup failed:', error);
  }
}

// Helper function to categorize resources
function getResourceType(url) {
  if (url.includes('.js')) return 'scripts';
  if (url.includes('.css')) return 'stylesheets';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i)) return 'images';
  if (url.match(/\.(woff|woff2|ttf|otf|eot)$/i)) return 'fonts';
  return 'other';
}

// Monitor page visibility changes (for bounce rate calculation)
export function monitorPageVisibility() {
  if (typeof window === 'undefined') return;

  let startTime = Date.now();
  let isVisible = !document.hidden;

  function handleVisibilityChange() {
    const now = Date.now();
    const timeSpent = now - startTime;

    if (document.hidden && isVisible) {
      // Page became hidden
      if (window.gtag && timeSpent > 1000) { // Only track if spent more than 1 second
        window.gtag('event', 'page_visibility', {
          event_category: 'Engagement',
          event_label: 'hidden',
          value: Math.round(timeSpent / 1000),
          non_interaction: true
        });
      }
      isVisible = false;
    } else if (!document.hidden && !isVisible) {
      // Page became visible
      startTime = now;
      isVisible = true;
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Track time spent on page before unload
  window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - startTime;
    
    if (window.gtag && timeSpent > 1000) {
      window.gtag('event', 'time_on_page', {
        event_category: 'Engagement',
        value: Math.round(timeSpent / 1000),
        non_interaction: true
      });
    }
  });
}

// Monitor scroll depth for engagement tracking
export function monitorScrollDepth() {
  if (typeof window === 'undefined') return;

  let maxScroll = 0;
  const milestones = [25, 50, 75, 90, 100];
  const triggered = new Set();

  function updateScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const scrollPercent = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100
    );

    maxScroll = Math.max(maxScroll, scrollPercent);

    // Trigger milestone events
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !triggered.has(milestone)) {
        triggered.add(milestone);
        
        if (window.gtag) {
          window.gtag('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: `${milestone}%`,
            value: milestone,
            non_interaction: true
          });
        }
      }
    });
  }

  // Throttle scroll events
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

// Initialize all monitoring
export function initAllPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Wait for the page to load before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initPerformanceMonitoring();
        monitorPageVisibility();
        monitorScrollDepth();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      initPerformanceMonitoring();
      monitorPageVisibility();
      monitorScrollDepth();
    }, 1000);
  }
}