// Service Worker for Web Push Notifications
self.addEventListener("push", function (event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "DHV-Lingoo 📚";
    const options = {
        body: data.body || "Đến giờ học rồi! Hãy dành vài phút luyện tập tiếng Anh nhé 🔥",
        icon: "/images/logo.png",
        badge: "/images/logo.png",
        tag: data.tag || "study-reminder",
        data: {
            url: data.url || "/dashboard",
        },
        actions: [
            { action: "open", title: "Học ngay" },
            { action: "close", title: "Để sau" },
        ],
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    if (event.action === "close") return;

    const url = event.notification.data?.url || "/dashboard";
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url.includes("/dashboard") && "focus" in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});

self.addEventListener("install", function () {
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});
