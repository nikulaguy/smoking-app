/*
 * SmokingApp · handler Web Push, importé dans le service worker généré
 * (workbox importScripts). Affiche la notification JITAI et, au clic,
 * ouvre l'app (au SOS si le payload le demande).
 */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "SmokingApp";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/pwa-192x192.png",
      badge: "/pwa-64x64.png",
      lang: "fr",
      tag: data.tag || "jitai",
      data: { url: data.url || "/" },
      // vibration douce, jamais agressif (anti-métriques doc 04)
      vibrate: [80, 40, 80],
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const c of clients) {
          if ("focus" in c) {
            c.navigate(url);
            return c.focus();
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});
