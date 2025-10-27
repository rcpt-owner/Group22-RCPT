// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Read API key from Vite env variables (populated from .env in development)
// Note: Firebase Web API keys are NOT secrets. They are intentionally public and
// may appear in URLs (e.g., the Firebase Auth handler). Protect data with
// Firebase Security Rules / backend token verification, not by hiding this key.

// Read API key from Vite env variables (populated from .env in development)
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
console.log("Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);
// Fail fast if the key is missing to avoid silent misconfigurations
if (!FIREBASE_API_KEY) {
  throw new Error(
    "Missing VITE_FIREBASE_API_KEY. Create Frontend/.env and set it before running the app."
  );
}

// All values pulled from environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY, // safely sourced from import.meta.env
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
