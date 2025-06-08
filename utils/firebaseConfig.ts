import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSGYYWpMCqVYqVPKg5m0e-Kh72XAiJvAE", // Replace with your Firebase API key
    authDomain: "vuet-e0864.firebaseapp.com",
    projectId: "vuet-e0864",
    storageBucket: "vuet-e0864.appspot.com",
    messagingSenderId: "564532154248",
    appId: "1:564532154248:web:5d52a6b950e3b9a3eafa04"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Initialize Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, auth, storage, firestore, firebaseConfig }; 