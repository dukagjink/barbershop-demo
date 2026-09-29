/* Barbershop Bingo – staff app service worker: shows new-booking notifications.
   No caching: the website always loads fresh from the internet. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  const url = new URL(d.url || './?staff#staff', self.registration.scope).href;
  e.waitUntil(
    self.registration.showNotification(d.title || 'Barbershop Bingo', {
      body: d.body || '', tag: d.tag || undefined, icon: 'icon-192.png', badge: 'icon-192.png', data: { url }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) { if ('focus' in w) { w.postMessage('refresh'); return w.focus(); } }
    return self.clients.openWindow(url);
  }));
});
