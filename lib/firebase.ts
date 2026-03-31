import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { TransferRequest } from './types';

// In a real application, these would be populated by AI Studio or the user's environment variables.
// Since the automatic setup failed, we provide a placeholder config.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyPlaceholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Helper to save a transfer request to Firestore
export const saveTransferRequest = async (transfer: TransferRequest) => {
  try {
    await setDoc(doc(db, 'transfers', transfer.id), transfer);
  } catch (error) {
    console.error("Error saving transfer request to Firestore:", error);
    // Fallback to localStorage for MVP if Firebase isn't configured properly
    localStorage.setItem(`transfer_${transfer.id}`, JSON.stringify(transfer));
  }
};

// Helper to get a transfer request from Firestore
export const getTransferRequest = async (id: string): Promise<TransferRequest | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'transfers', id));
    if (docSnap.exists()) {
      return docSnap.data() as TransferRequest;
    }
  } catch (error) {
    console.error("Error getting transfer request from Firestore:", error);
    const local = localStorage.getItem(`transfer_${id}`);
    if (local) return JSON.parse(local) as TransferRequest;
  }
  return null;
};

// Helper to listen to transfer updates
export const subscribeToTransfer = (id: string, callback: (transfer: TransferRequest) => void) => {
  try {
    return onSnapshot(doc(db, 'transfers', id), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as TransferRequest);
      }
    });
  } catch (error) {
    console.error("Error subscribing to transfer in Firestore:", error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};

export { db };
