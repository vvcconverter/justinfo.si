const CACHE_NAME = 'justinfo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dpi/index.html'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache.map(function (url) {
          return new Request(url, { cache: 'reload' });
        })).catch(function (err) {
          console.warn('sw install: cache addAll failed', err);
        });
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (name) {
          return name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  if (event.request.url.indexOf('twitter.com') !== -1 || event.request.url.indexOf('t.me') !== -1 || event.request.url.indexOf('googletagmanager.com') !== -1) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) return response;
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
