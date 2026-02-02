const CACHE_NAME = 'yaygara-v1.8';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/tr/',
  '/en/',
  '/manifest.json',
  '/locales/tr.json',
  '/locales/en.json',
  '/decks/baslangic.tr.json',
  '/decks/zihin-acici.tr.json',
  '/decks/karanlik-seruven.tr.json',
  '/decks/uygarligin-izleri.tr.json',
  '/decks/argo.tr.json',
  '/icons/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install: Cache core assets (be lenient about missing ones)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core assets');
      return Promise.all(
        CORE_ASSETS.map(url => {
          return cache.add(url).catch(err => console.warn(`[SW] Failed to cache ${url}:`, err));
        })
      );
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

// Fetch: Logic for Network-First with Cache Fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDeckRequest = url.pathname.includes('/decks/');

  // 1. Navigation (HTML/Pages)
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
          // If offline, try to match the request, then try localized roots, then generic root
          return caches.match(event.request).then((response) => {
            if (response) return response;

            // Fallback strategy for SPA routing
            const lang = url.pathname.split('/')[1]; // Get 'tr' or 'en'
            if (lang === 'tr' || lang === 'en') {
              return caches.match(`/${lang}/`) || caches.match('/') || caches.match('/index.html');
            }
            return caches.match('/') || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 2. Deck Requests (Cache First as per requirement)
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

  // 3. Static Assets (Network First with Cache fallback as per requirement)
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
        return caches.match(event.request);
      })
  );
});