import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check if Firebase environment variables are available
const hasFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

let app: any = null;
let auth: any = null;
let db: any = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("✅ Firebase client initialized successfully");
  } catch (error) {
    console.error("❌ Firebase client initialization error:", error);
  }
} else {
  console.log("⚠️  Firebase environment variables not found - running in demo mode");
}

export { auth, db };
export default app;
