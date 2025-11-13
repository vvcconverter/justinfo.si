const CACHE_NAME = 'vvc-cache-v5';
const FILES_TO_CACHE = [
  '/',
  '/cache/',
  '/cache/lib/',
  '/cache/AsyncHelpers.js',
  '/cache/VVCPlayer.mjs',
  '/cache/lib/bootstrap.min.js',
  '/cache/lib/mp4box.all.min.js',
  '/cache/lib/three.module.min.js',
  '/cache/lib/uPlot.esm.min.js',
  '/img/',
  '/img/apple-touch-icon.png',
  '/img/favicon.ico',
  '/img/favicon.svg',
  '/img/VVC-Converter Telegram.svg',
  '/img/vvc-converter.png',
  '/img/web-app-manifest-192x192.png',
  '/img/web-app-manifest-512x512.png',
  '/index.html',
  '/project_structure.txt',
  '/webplayervvc-cache/',
  '/webplayervvc-cache/AsyncHelpers.js',
  '/webplayervvc-cache/bitstreams.json',
  '/webplayervvc-cache/bootstrap.min.js',
  '/webplayervvc-cache/decoderWorker.js',
  '/webplayervvc-cache/favicon.ico',
  '/webplayervvc-cache/mp4box.all.min.js',
  '/webplayervvc-cache/project_structure.txt',
  '/webplayervvc-cache/shell.mjs',
  '/webplayervvc-cache/street.mp4',
  '/webplayervvc-cache/styles.css',
  '/webplayervvc-cache/three.module.min.js',
  '/webplayervvc-cache/uPlot.esm.min.js',
  '/webplayervvc-cache/VVCPlayer.mjs',
  '/webplayervvc-cache/vvdecapp.js',
  '/webplayervvc-cache/vvdecapp.wasm',
  '/webplayervvc-cache/wasm_test-server.py'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
