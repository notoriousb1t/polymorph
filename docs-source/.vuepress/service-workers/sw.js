import { get, set } from 'idb-keyval';

const version = '0.0.0';
const cachePrefix = 'polymorph-workbench-';
const staticCacheName = `${cachePrefix}static-${version}`;
const fontCacheName = `${cachePrefix}fonts`;
const expectedCaches = [staticCacheName, fontCacheName];

addEventListener('install', event => {
  event.waitUntil((async () => {
    const asyncActiveVersion = get('active-version');
    const cache = await caches.open(staticCacheName);

    await cache.addAll([
      './',
      'svgo-worker.js'
    ]);

    const activeVersion = await asyncActiveVersion;

    // If it's a major version change, don't skip waiting
    if (!activeVersion || activeVersion.split('.')[0] === version.split('.')[0]) {
      self.skipWaiting();
    }
  })());
});

addEventListener('activate', event => {
  event.waitUntil((async () => {
    // remove caches beginning "svgomg-" that aren't in expectedCaches
    for (const cacheName of await caches.keys()) {
      if (!cacheName.startsWith(cachePrefix)) continue;
      if (!expectedCaches.includes(cacheName)) await caches.delete(cacheName);
    }

    await set('active-version', version);
  })());
});

async function handleFontRequest(request) {
  const match = await caches.match(request);
  if (match) return match;

  const [response, fontCache] = Promise.all([
    await fetch(request),
    await caches.open(fontCacheName)
  ]);

  fontCache.put(request, response.clone());
  return response;
}

addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.host == 'fonts.gstatic.com') {
    event.respondWith(handleFontRequest(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});