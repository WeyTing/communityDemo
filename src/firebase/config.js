// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgBarVuNnHUf3WIop6xV1PZyL9SN-Pmao",
  authDomain: "minisocial-446f6.firebaseapp.com",
  projectId: "minisocial-446f6",
  storageBucket: "minisocial-446f6.firebasestorage.app",
  messagingSenderId: "980726336207",
  appId: "1:980726336207:web:d5b621b81ce60b902445ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
