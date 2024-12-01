// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "reactchat-cd27b.firebaseapp.com",
  projectId: "reactchat-cd27b",
  storageBucket: "reactchat-cd27b.firebasestorage.app",
  messagingSenderId: "499783256214",
  appId: "1:499783256214:web:c7cf9f5a4fdac63dc9dab7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
