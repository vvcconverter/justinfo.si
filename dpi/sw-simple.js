const CACHE_NAME = 'casino-vodka-cache-v3';
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/index.html#%D0%A1%D0%9A%D0%90%D0%A7%D0%90%D0%A2%D0%AC%20DPI%20-%20%D0%A1%D0%9C%D0%9E%D0%A2%D0%A0%D0%95%D0%A2%D0%AC%20YouTube%208k',
                  '/index.html#СКАЧАТЬ_DPI_СМОТРЕТЬ_YouTube_8k',
                  'index.html#url?q=https://t.me/dpi_skachat',
                ]);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});
self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;   
    event.respondWith(
        fetch(event.request)
            .catch(function() {
                return caches.match(event.request) || caches.match('/index.html');
            })
    );

});
