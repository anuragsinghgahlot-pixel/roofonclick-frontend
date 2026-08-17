/**
 * RoofOnClick Background Service Worker
 * Handles native Web Push notifications and notification click actions.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'RoofOnClick Notification';
    const options = {
      body: data.body || '',
      icon: data.icon || '/logos/roofonclick-brand-logo.png',
      badge: data.badge || '/logos/roofonclick-brand-logo.png',
      tag: data.tag || 'roofonclick-general',
      renotify: true,
      data: {
        actionUrl: data.url || data.data?.actionUrl || '/',
        notificationId: data.data?.notificationId,
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('[SW] Failed to parse push payload:', err);
    event.waitUntil(
      self.registration.showNotification('RoofOnClick Notification', {
        body: event.data.text() || 'You have a new update.',
        icon: '/logos/roofonclick-brand-logo.png',
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.actionUrl || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a tab is already open with the app, focus it and navigate
      for (const client of windowClients) {
        if ('focus' in client) {
          if (client.url.includes(self.location.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      // If no tab is open, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
