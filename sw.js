const staticAssets = [
  "./",
  "./styles.css",
  "./app.js",
  "./fallback.json",
  "./images/grass.jpg",
];

// cache static assets when service worker is installed
self.addEventListener("install", async (e) => {
  const cache = await caches.open("news-static");
  cache.addAll(staticAssets);
});

// network call made
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

const cacheFirst = async (req) => {
  // check the cache for current response
  const cachedResponse = await caches.match(req);

  // return cached content if it exists, else fetch from the network
  return cachedResponse || fetch(req);
};

const networkFirst = async (req) => {
  const cache = await caches.open("news-dynamic");

  // try to fetch news from network, and use cached data if failed
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedResponse = await cache.match(req);
    return cachedResponse || (await caches.match("./fallback.json"));
  }
};
