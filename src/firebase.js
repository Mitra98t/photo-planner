// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS_Z6gKVtT50reSAIqU72w60N4UvgtKiA",
  authDomain: "photo-planner-saw-fad8c.firebaseapp.com",
  projectId: "photo-planner-saw-fad8c",
  storageBucket: "photo-planner-saw-fad8c.appspot.com",
  messagingSenderId: "560669824813",
  appId: "1:560669824813:web:f87bfafb9b537eec1fa5a4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
