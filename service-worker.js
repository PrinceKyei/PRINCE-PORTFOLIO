const CACHE_NAME = "todo-cache-v1";
const FILES_TO_CACHE = [
    "./",
    "./Task 5.html",
    "./Task 5.css",
    "./Task 5.js",
    "./manifest.json",
    "./Icon.jpg",
    "./Icon.jpg",
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});