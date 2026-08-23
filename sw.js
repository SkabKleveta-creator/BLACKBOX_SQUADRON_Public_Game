/* BLACKBOX SQUADRON v0.4.2 — mobile input/audio hotfix */
const CACHE_NAME = "blackbox-squadron-v0.4.2-input-hotfix";
const APP_SHELL = [
  "./",
  "./index.html",
  "./blackbox-squadron-v0.2.3.html",
  "./hardening-hotfix-v0.4.1.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function injectHardeningHotfix(response) {
  if (!response) return response;
  const text = await response.text();
  const tag = '<script src="./hardening-hotfix-v0.4.1.js?v=042"></script>';
  const body = text.includes("hardening-hotfix-v0.4.1.js")
    ? text.replace(/<script src="\.\/hardening-hotfix-v0\.4\.1\.js[^\"]*"><\/script>/, tag)
    : text.replace("</body>", tag + "</body>");
  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.delete("content-length");
  return new Response(body, {status: response.status, statusText: response.statusText, headers});
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith("/blackbox-squadron-v0.2.3.html")) {
    event.respondWith(
      fetch(req)
        .then(res => injectHardeningHotfix(res))
        .catch(async () => injectHardeningHotfix(await caches.match("./blackbox-squadron-v0.2.3.html")))
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then(cached => cached || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
