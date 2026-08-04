// Minimal service worker for Web Push reminders. No caching/offline
// strategy is implemented on purpose — this file's only job is to receive
// push events while the app isn't in the foreground and route a click back
// into the right in-app page.

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Reminder", body: event.data.text() };
  }

  const title = payload.title || "Reminder";
  const options = {
    body: payload.body || "",
    icon: "/brand/nexora-mark-512.png",
    badge: "/brand/nexora-mark-512.png",
    data: { url: payload.url || "/notifications" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin === self.location.origin && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
