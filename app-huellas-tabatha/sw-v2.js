const CACHE_NAME = "huellas-cuentos-v1";
const urlsToCache = [
  "index.html",
  "css/styles.css",
  "js/script.js",
  "tanyi/menu.html",
  "tanyi/cuento.html",
  "tanyi/assets/portada.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
