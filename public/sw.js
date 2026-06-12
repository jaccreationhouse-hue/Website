const CACHE_NAME = 'jac-media-v1';

// Static resources to cache immediately upon service worker install
const PRE_CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/favicon.svg'
];

// Install event - Cache the shell immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

// Activate event - Delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Cache interception and resolution
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // CMS and other cross-origin API responses own their own cache policy.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/v1/')) {
    return;
  }

  // Bypass service worker for development HMR / WebSocket connections
  if (
    url.hostname.includes('localhost') && 
    (url.pathname.includes('hot-update') || url.pathname.includes('@vite'))
  ) {
    return;
  }

  // Bypass cache for large video range requests (Vite handles this differently)
  if (url.pathname.endsWith('.mp4') || url.pathname.includes('/video/')) {
    return;
  }

  // Check if it is a static asset (images, fonts) -> Cache First
  const isStaticAsset = 
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)$/) ||
    url.pathname.includes('/assets/');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        }).catch(() => {
          // Silent fallback on network failures
        });
      })
    );
  } else {
    // For HTML, main bundle JS, CSS -> Stale While Revalidate
    // Loads from cache instantly, but runs network fetch in background to refresh cache.
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Return offline fallback if no connection and not cached
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
