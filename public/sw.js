/* Self-destructing service worker.
 * The site used to ship a next-pwa/Workbox service worker (unmaintained; it cached pages and /api GETs).
 * Browsers that still have it registered re-fetch /sw.js on their next visit and receive THIS file, which
 * deletes every cache, unregisters itself and reloads open tabs so they leave the old worker's control.
 * Nothing registers a service worker any more. Safe to delete this file once old clients have aged out. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) { /* ignore */ }
    try { await self.registration.unregister(); } catch (e) { /* ignore */ }
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => { try { c.navigate(c.url); } catch (e) { /* ignore */ } });
    } catch (e) { /* ignore */ }
  })());
});
