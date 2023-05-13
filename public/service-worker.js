/* eslint-disable no-restricted-globals */
const staticCacheName = "site-static";

self.addEventListener("install", (evt) => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(["/", "/fallback.html"]);
      // cache.addAll(["/", "/index.html", "/fallback.html"]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    (async function () {
      try {
        var res = await fetch(event.request);
        var cache = await caches.open("cache");
        cache.put(event.request.url, res.clone());
        return res;
      } catch (error) {
        return caches.match("/fallback.html");
      }
    })()
  );
});

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
