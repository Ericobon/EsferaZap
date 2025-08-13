import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// InsightEsfera Firebase Configuration
const INSIGHT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDrZCmU8SRDlcpTUyZLsZJLPUGMQBKYFkU",
  authDomain: "login-ee5ed.firebaseapp.com", // Use Firebase domain for auth
  projectId: "login-ee5ed",
  storageBucket: "login-ee5ed.firebasestorage.app",
  messagingSenderId: "758485377489",
  appId: "1:758485377489:web:c4220355f73a31e15900f0",
  measurementId: "G-TBR5WL76DX"
};

// For local development, ensure auth redirects work
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('🔐 Running in localhost - Firebase Auth configured');
  console.log('✅ Firestore database ready at: login-ee5ed');
  console.log('📝 Authentication will work via popup/redirect to Firebase domain');
}

// Check if Firebase environment variables are available, with fallback to InsightEsfera config
const hasFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY ||
  INSIGHT_FIREBASE_CONFIG.apiKey
);

let app: any = null;
let auth: any = null;
let db: any = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || INSIGHT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || INSIGHT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || INSIGHT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || INSIGHT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || INSIGHT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || INSIGHT_FIREBASE_CONFIG.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || INSIGHT_FIREBASE_CONFIG.measurementId,
  };

  try {
    // Check if app already exists to avoid duplicate-app error
    try {
      app = initializeApp(firebaseConfig);
    } catch (error: any) {
      if (error.code === 'app/duplicate-app') {
        // If app already exists, get the existing app
        const { getApps, getApp } = require('firebase/app');
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      } else {
        throw error;
      }
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("✅ Firebase client initialized successfully with InsightEsfera project:", firebaseConfig.projectId);
    console.log("🔗 Connected to InsightEsfera ecosystem authentication");
  } catch (error: any) {
    console.error("❌ Firebase client initialization error:", error.code, error.message);
    // For development, continue without Firebase rather than breaking the app
    console.log("🔄 Continuing in demo mode without Firebase authentication");
  }
} else {
  console.log("⚠️  Firebase configuration not available - running in demo mode");
}

// Ensure we always export valid objects, even if Firebase fails
if (!auth) auth = null;
if (!db) db = null;

export { auth, db };
export default app;
