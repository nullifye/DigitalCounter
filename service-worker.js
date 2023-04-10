var revision = "00017";

var cacheName = "digitalcounter";
var filesToCache = [
  "index.html",
  "js/app.js",
  "css/app.css",
  "img/badge.png",
  "img/android-icon-48x48.png",
  "img/android-icon-72x72.png",
  "img/android-icon-96x96.png",
  "img/android-icon-144x144.png",
  "img/android-icon-192x192.png",
  "img/android-icon-512x512.png",
  "img/ms-icon-70x70.png",
  "img/ms-icon-150x150.png",
  "img/ms-icon-310x310.png",
  "sound/click.mp3",
  "sound/ding.mp3",
  "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
  "https://fonts.googleapis.com/icon?family=Material+Icons+Round"
];

self.addEventListener("install", function(event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  return self.clients.claim();

});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

function scheduleNotification() {
  return self.registration.showNotification('A Zikr A Day', {
    body   : 'Have you recited zikr today?',
    icon   : 'img/badge.png',
    badge  : 'img/badge.png',
    vibrate: [100, 50, 100]
  });
}

self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'aZikraDay') {
    event.waitUntil(scheduleNotification());
  }
});

self.addEventListener('notificationclick', function(event) {
  const rootUrl = new URL('./', location).href; 
  const     pwa = rootUrl + "index.html?utm_source=standalone&utm_medium=pwa";
  event.notification.close();

  event.waitUntil(
    clients.matchAll().then(function(matchedClients) {
      for (let client of matchedClients) {
        if (client.url == pwa) {
          return client.focus();
        }
      }

      return clients.openWindow(pwa);
    })
  );
});
