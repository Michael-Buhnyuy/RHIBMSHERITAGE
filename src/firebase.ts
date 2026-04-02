// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "rhibmsheritage.firebaseapp.com",
  projectId: "rhibmsheritage",
  storageBucket: "rhibmsheritage.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123456:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// types
export type { User as FirebaseUser } from 'firebase/auth';
export type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

