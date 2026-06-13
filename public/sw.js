self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // We need a fetch event handler to satisfy the PWA installability criteria,
  // even if it just passes the request through.
  e.respondWith(fetch(e.request).catch(() => new Response("Offline")));
});
