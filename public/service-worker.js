const CACHE_NAME = 'yaygara-v1.7';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/locales/tr.json',
  '/locales/en.json',
  '/icons/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core assets');
      return cache.addAll(CORE_ASSETS).catch(err => {
        console.warn('[SW] Pre-cache failed (some assets might be missing), continuing...', err);
        // Continue even if some assets fail to cache (e.g. 404)
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network First for app, Cache First for decks
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDeckRequest = url.pathname.includes('/decks/');

  // 1. Navigation Requests (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return response;
        })
        .catch(() => {
          // If offline, try the specific URL, then fall back to root /
          return caches.match(event.request).then((response) => {
            return response || caches.match('/') || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 2. Deck Requests (Cache First)
  if (isDeckRequest) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Other Assets (Network First, then Cache)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for assets (JS, CSS, etc.)
        if (response && response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});