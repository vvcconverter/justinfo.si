const CACHE = 'casino-vodka-cache-v3';
const URLS = [
  '/',
  '/index.html',
  '/index.html#ДОКАЗАТЕЛЬСТВА_МОШЕННИЧЕСТВА_WhiteBird',
  '/index.html#СКАЧАТЬ_DPI_СМОТРЕТЬ_YouTube_8k',
  '/index.html#url?q=https://t.me/dpi_skachat'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE && caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(e.request, response.clone()));
    return response;
  })));
});
