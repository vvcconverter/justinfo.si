const CACHE_NAME = 'vvc-cache-v5';
const FILES_TO_CACHE = [
  '/webplayervvc-cache/AsyncHelpers.js',
  '/webplayervvc-cache/bitstreams.json',
  '/webplayervvc-cache/bootstrap.min.js',
  '/webplayervvc-cache/decoderWorker.js',
  '/webplayervvc-cache/favicon.ico',
  '/webplayervvc-cache/mp4box.all.min.js',
  '/webplayervvc-cache/project_structure.txt',
  '/webplayervvc-cache/shell.mjs',
  '/webplayervvc-cache/styles.css',
  '/webplayervvc-cache/three.module.min.js',
  '/webplayervvc-cache/uPlot.esm.min.js',
  '/webplayervvc-cache/VVCPlayer.mjs',
  '/webplayervvc-cache/vvdecapp.js',
  '/webplayervvc-cache/wasm_test-server.py',
  '/webplayervvc-cache/vvdecapp.wasm',
  '/webplayervvc-cache/street.mp4',
  '/sw.js'
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