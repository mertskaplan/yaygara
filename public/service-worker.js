const CACHE_NAME = 'yaygara-v1.6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/tr/index.html',
  '/en/index.html',
  '/manifest.json',
  '/locales/tr.json',
  '/locales/en.json',
  '/decks/baslangic.tr.json',
  '/decks/zihin-acici.tr.json',
  '/decks/karanlik-seruven.tr.json',
  '/decks/uygarligin-izleri.tr.json',
  '/decks/argo.tr.json',
  '/assets/index-fOfd1tOd.css',
  '/assets/index-oui5GQ56.js',
  '/icons/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/image.png'
];

// Pre-cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching critical assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDeckRequest = url.pathname.includes('/decks/');

  // For navigation requests, use Network-First with multiple fallbacks
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[SW] Offline navigation fallback: ', event.request.url);
          return caches.match(event.request).then(response => {
            return response || caches.match('/') || caches.match('/index.html') || caches.match('/tr/index.html') || caches.match('/en/index.html');
          });
        })
    );
    return;
  }

  // Network First for everything except decks
  if (!isDeckRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache First for deck files
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return networkResponse;
      });
    })
  );
});