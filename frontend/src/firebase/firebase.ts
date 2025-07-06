import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This is your correct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCYdHPqrB3zJ5IaMYRyzbO-TRNjL0JGeU",
  authDomain: "hackquest-bbe17.firebaseapp.com",
  projectId: "hackquest-bbe17",
  storageBucket: "hackquest-bbe17.appspot.com", // Use .appspot.com for storage
  messagingSenderId: "642660827314",
  appId: "1:642660827314:web:1fca5fcb791bbdaef589ab",
  measurementId: "G-E8G33CFKYB"
};

// Initialize Firebase and export the services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;