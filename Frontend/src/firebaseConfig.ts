// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD41B20C3RvGBMiIp2Ec1XgV6HxMr2xgpo",
  authDomain: "rcpt-unimelb.firebaseapp.com",
  projectId: "rcpt-unimelb",
  storageBucket: "rcpt-unimelb.firebasestorage.app",
  messagingSenderId: "1015852433847",
  appId: "1:1015852433847:web:6f6a0f4736e089d927e832",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
