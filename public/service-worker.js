const CACHE_NAME = "cupid-cache-v1";

const FILES_TO_CACHE = [
  "homepage.html",
  "quiz.html",
  "match.html",
  "styles.css",
  "script.js",
  "quiz.js",
  "cc1.jpeg",
  "cc2.jpeg",
  "cc3.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
