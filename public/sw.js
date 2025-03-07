// This is the service worker with the offline-first behavior

const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline';

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        OFFLINE_URL,
        '/favicon.ico',
        // Add other important assets here
      ]);
    })
  );
});

// Fetch event handles all requests
self.addEventListener('fetch', function(event) {
  // Skip for non-GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .catch(function() {
        // If the fetch fails (offline), try to return any resource from the cache
        return caches.match(event.request)
          .then(function(response) {
            // If there's a cached version, return it
            if (response) {
              return response;
            }
            
            // If there's no cached version, return the offline page
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// Activate event is triggered when the service worker is activated
self.addEventListener('activate', function(event) {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});