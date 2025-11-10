const CACHE_NAME = 'vodka-casino-cache-v1';
const urlsToCache = [
  '/',
  '/infors.htm',
  '/assets/css/style.css',
  '/assets/images/vodka-casino.jpg',
  '/assets/images/mobile.jpg',
  '/favicon.ico'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});