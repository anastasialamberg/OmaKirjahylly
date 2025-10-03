import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwBqNkdSLfrLxHEOOQXc_nWrbEuFAX0nI",
  authDomain:"kirjahylly-619c7.firebaseapp.com",
  projectId: "kirjahylly-619c7",
  storageBucket: "kirjahylly-619c7.firebasestorage.app",
  messagingSenderId: "937349323108",
  appId: "G-8PT2ZS6RRW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);