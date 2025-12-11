import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCkcbeai06wOEcAElf8Mt1Z-iWza0UyksA",
  authDomain: "principie-ftracker.firebaseapp.com",
  projectId: "principie-ftracker",
  storageBucket: "principie-ftracker.firebasestorage.app",
  messagingSenderId: "560201670998",
  appId: "1:560201670998:web:4285d36408a77de292f6f7",
  measurementId: "G-F7EVR1S237"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);