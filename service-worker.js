var revision = "00005";

var cacheName = "digitalcounter";
var filesToCache = [
  "index.html",
  "js/app.js",
  "css/app.css",
  "img/android-icon-48x48.png",
  "img/android-icon-72x72.png",
  "img/android-icon-96x96.png",
  "img/android-icon-144x144.png",
  "img/android-icon-192x192.png",
  "img/android-icon-512x512.png",
  "img/ms-icon-70x70.png",
  "img/ms-icon-150x150.png",
  "img/ms-icon-310x310.png",
  "sound/click.m4a",
  "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
  "https://fonts.googleapis.com/icon?family=Material+Icons+Round"
];

self.addEventListener("install", function(e) {
  self.skipWaiting();

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", function(e) {
  return self.clients.claim();

});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
