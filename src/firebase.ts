import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBqQS_6mg6iFfxtqh9j06W35n4AX1qfoRA",
    authDomain: "manivarma-blog.firebaseapp.com",
    projectId: "manivarma-blog",
    storageBucket: "manivarma-blog.firebasestorage.app",
    messagingSenderId: "909047480859",
    appId: "1:909047480859:web:9b31a30606365cb12c6ebe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { app, db, messaging };
