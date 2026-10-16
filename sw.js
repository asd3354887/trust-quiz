/* quiz PWA: network-first shell, enables Add to Home Screen */
const CACHE = 'quiz-shell-trustquiz_v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const u = new URL(e.request.url);
    if (r.ok && u.origin === location.origin && /\.(png|js|json|html)$/i.test(u.pathname)) {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return r;
  }).catch(() => caches.match(e.request)));
});
