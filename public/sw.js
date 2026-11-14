// Service Worker for Galal Ahmad PWA
// STRICT PRIVACY POLICY: Never cache sensitive, authenticated, or clinical routes.
const CACHE_NAME = 'galal-web-v2';

const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/assets/logo.png',
  '/assets/logo-white.png',
  '/manifest.json'
];

// Sensitive surfaces that must NEVER be cached by the service worker under any circumstance
const NEVER_CACHE_PREFIXES = [
  '/api',
  '/admin',
  '/counselor',
  '/profile',
  '/login',
  '/register',
  '/forgot-password'
];

function isSensitiveRoute(pathname) {
  return NEVER_CACHE_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// Install: Cache initial static public shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up older cache versions
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
    })
  );
  self.clients.claim();
});

// Message listener: Allow application to instruct SW to clear caches (e.g. on logout)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_USER_CACHE') {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
});

// Fetch: Strictly enforce network-only for sensitive / authenticated routes
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests and external URLs
  if (req.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // 1. Strictly bypass Service Worker cache for all sensitive / authenticated / API paths
  if (isSensitiveRoute(url.pathname)) {
    event.respondWith(
      fetch(req).catch(() => {
        // If offline and accessing sensitive route, DO NOT return any cached data.
        // Return a privacy-preserving offline notice.
        return new Response(
          JSON.stringify({
            error: 'Offline',
            message: 'هذه الصفحة غير متاحة في وضع عدم الاتصال حفاظاً على خصوصية بياناتك.'
          }),
          {
            status: 503,
            statusText: 'Service Unavailable (Offline Protected)',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store'
            }
          }
        );
      })
    );
    return;
  }

  // 2. Navigation requests (Public Pages/HTML): Network-first with cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          // Verify response does not mandate no-store
          const cacheControl = networkRes.headers.get('Cache-Control') || '';
          if (networkRes && networkRes.status === 200 && !cacheControl.includes('no-store')) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('/');
        })
    );
    return;
  }

  // 3. Static Assets (_next/static, images, fonts, icons): Cache-first with network fallback
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/assets') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
