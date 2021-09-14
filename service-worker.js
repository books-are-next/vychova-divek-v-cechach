/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-368874c';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./resources.html","./vychova_divek_v_cechach_001.html","./vychova_divek_v_cechach_002.html","./vychova_divek_v_cechach_005.html","./vychova_divek_v_cechach_006.html","./vychova_divek_v_cechach_007.html","./vychova_divek_v_cechach_008.html","./vychova_divek_v_cechach_009.html","./vychova_divek_v_cechach_010.html","./vychova_divek_v_cechach_011.html","./vychova_divek_v_cechach_012.html","./vychova_divek_v_cechach_013.html","./vychova_divek_v_cechach_014.html","./vychova_divek_v_cechach_015.html","./vychova_divek_v_cechach_016.html","./vychova_divek_v_cechach_017.html","./resources/image001_fmt.jpeg","./resources/image002_fmt.jpeg","./resources/index.xml","./resources/obalka_vychova_divek_v_fmt.jpeg","./resources/upoutavka_eknihy_fmt.jpeg","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
