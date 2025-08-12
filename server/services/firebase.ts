import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Check if Firebase environment variables are available
const hasFirebaseConfig = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_CLIENT_ID
);

let app: any = null;
let adminAuth: any = null;
let adminDb: any = null;

if (hasFirebaseConfig) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };

  try {
    app = initializeApp({
      credential: cert(serviceAccount as any),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    
    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
    
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
  }
} else {
  console.log("⚠️  Firebase environment variables not found - running without Firebase");
}

export { adminAuth, adminDb };
export default app;
