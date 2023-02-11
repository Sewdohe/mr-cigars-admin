import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import {
  getMessaging,
  onBackgroundMessage,
  isSupported,
} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-sw.js";

const app = initializeApp({
  apiKey: "AIzaSyAJ8H7o9cjsr7GOdsu4hTkwjp86E9bmndY",
  authDomain: "mr-cigars.firebaseapp.com",
  databaseURL: "https://mr-cigars-default-rtdb.firebaseio.com",
  projectId: "mr-cigars",
  storageBucket: "mr-cigars.appspot.com",
  messagingSenderId: "495206044541",
  appId: "1:495206044541:web:dc95dc455b4153f4f17214",
  measurementId: "G-S78E69BDDF",
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  var promise = new Promise(function (resolve) {
    setTimeout(resolve, 1000);
  }).then(function () {
    return clients.openWindow(event.data.locator);
  });

  event.waitUntil(promise);
});

isSupported().then((isSupported) => {
  if (isSupported) {
    const messaging = getMessaging(app);

    onBackgroundMessage(
      messaging,
      ({ notification: { title, body, image } }) => {
        self.registration.showNotification(title, { body });
      }
    );
  }
});
