// Service Worker для управления push-уведомлениями
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "icon-192.png",
      badge: "icon-192.png",
      vibrate: [200, 100, 200],
      tag: "form-reward",
      renotify: true,
      actions: [
        { action: "open", title: "Открыть приложение" },
        { action: "close", title: "Закрыть" },
      ],
      data: data,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "open") {
    clients.openWindow("/");
  }
});

// Установка Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
