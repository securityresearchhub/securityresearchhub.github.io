importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBqQS_6mg6iFfxtqh9j06W35n4AX1qfoRA",
    authDomain: "manivarma-blog.firebaseapp.com",
    projectId: "manivarma-blog",
    storageBucket: "manivarma-blog.firebasestorage.app",
    messagingSenderId: "909047480859",
    appId: "1:909047480859:web:9b31a30606365cb12c6ebe"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
