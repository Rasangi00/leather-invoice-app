const CACHE_NAME = 'dons-leather-atelier-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap'
];

// Install Event: cache the static app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell and static resources');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      // Force immediate activation of the service worker
      return self.skipWaiting();
    })
  );
});

// Activate Event: clean up any stale old caches from prior versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing stale cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Closes open tabs running older workers immediately
      return self.clients.claim();
    })
  );
});

// Fetch Event: apply network-first with cache-fallback for documents/XHR, 
// and cache-first/stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching for external non-GET requests (such as API or dev server sockets)
  if (event.request.method !== 'GET') return;

  // For navigate / HTML requests, try Network first, then fall back to Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If response is valid, clone and cache it
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network failed, fall back to cached main shell
          return caches.match('/');
        })
    );
    return;
  }

  // For other assets (images, CSS, JS, fonts), use Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately, but fetch update in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, cacheCopy);
              });
            }
          })
          .catch(() => {
            // Ignore background fetch failures (offline state)
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network and populate the cache
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const cacheCopy = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, cacheCopy);
        });
        return networkResponse;
      });
    })
  );
});
