import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA13qh8HqRrjcWXuagMih9gvWtyIH0P2E8",
  authDomain: "fitness-42b90.firebaseapp.com",
  projectId: "fitness-42b90",
  storageBucket: "fitness-42b90.firebasestorage.app",
  messagingSenderId: "631936509667",
  appId: "1:631936509667:web:15d4dc450ae84efe50c7d6",
  measurementId: "G-T9GE6Z71Y6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ส่งออก Services ที่เราจะใช้
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);