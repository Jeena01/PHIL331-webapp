// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA_KdEMCw0YCZwQ7bBWq0UfT1Keqv0pjPE',
  authDomain: 'philproj-58c07.firebaseapp.com',
  projectId: 'philproj-58c07',
  storageBucket: 'philproj-58c07.firebasestorage.app',
  messagingSenderId: '918832186488',
  appId: '1:918832186488:web:5504f11488e4a3a1a9998d',
  measurementId: 'G-WQW4NQTHLN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
