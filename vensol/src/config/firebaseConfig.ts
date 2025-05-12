// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey: string = import.meta.env.VITE_FIREBASE_KEY
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "vensol-f6cbc.firebaseapp.com",
  projectId: "vensol-f6cbc",
  storageBucket: "vensol-f6cbc.firebasestorage.app",
  messagingSenderId: "983969948104",
  appId: "1:983969948104:web:77e7c38b88582df0a3a0fd",
  measurementId: "G-1L9SGMYL53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);