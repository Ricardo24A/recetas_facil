import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXsIwgxdpXbaZnvTIig6r5b-GulFTTTb0",
  authDomain: "recetas-facil-e3c32.firebaseapp.com",
  projectId: "recetas-facil-e3c32",
  storageBucket: "recetas-facil-e3c32.firebasestorage.app",
  messagingSenderId: "554680193656",
  appId: "1:554680193656:web:2e2d9ced58da8ddd3d938d",
  measurementId: "G-Y1ZT6J08H9"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);



