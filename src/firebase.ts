// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const googleProvider = new GoogleAuthProvider();
export const ADMIN_EMAIL = 'rhibmsadmin@gmail.com';


const firebaseConfig = {
  apiKey: "AIzaSyDlmXwDz-IXilw1wkcf2TmEzowwyvYYulA",
  authDomain: "rhibmsheritage-bf055.firebaseapp.com",
  projectId: "rhibmsheritage-bf055",
  storageBucket: "rhibmsheritage-bf055.firebasestorage.app",
  messagingSenderId: "921943897352",
  appId: "1:921943897352:web:098bb0f169fbb0d998e8bd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// types
export type { User as FirebaseUser } from 'firebase/auth';
export type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

