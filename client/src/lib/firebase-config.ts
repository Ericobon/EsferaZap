// Firebase configuration with automatic redirect handling for localhost
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence 
} from 'firebase/auth';
import { 
  getFirestore,
  connectFirestoreEmulator 
} from 'firebase/firestore';

// InsightEsfera Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrZCmU8SRDlcpTUyZLsZJLPUGMQBKYFkU",
  authDomain: "login-ee5ed.firebaseapp.com",
  projectId: "login-ee5ed",
  storageBucket: "login-ee5ed.firebasestorage.app",
  messagingSenderId: "758485377489",
  appId: "1:758485377489:web:c4220355f73a31e15900f0",
  measurementId: "G-TBR5WL76DX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configure auth persistence
setPersistence(auth, browserLocalPersistence);

// Development mode configuration
if (process.env.NODE_ENV === 'development') {
  // Check if emulators are running
  const useEmulator = false; // Set to true if you have Java and want to use emulators
  
  if (useEmulator) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('🔧 Using Firebase Emulators for local development');
    } catch (error) {
      console.log('📱 Using production Firebase (emulators not available)');
    }
  } else {
    console.log('🔐 Using production Firebase with redirect auth');
    console.log('📝 Auth will redirect to login-ee5ed.firebaseapp.com and back');
  }
}

export { app, auth, db };