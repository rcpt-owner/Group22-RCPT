// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// All values pulled from environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "rcpt-unimelb.firebaseapp.com",
  projectId: "rcpt-unimelb",
  storageBucket: "rcpt-unimelb.firebasestorage.app",
  messagingSenderId: "1015852433847",
  appId: "1:1015852433847:web:6f6a0f4736e089d927e832",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth + provider for use in your app
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
