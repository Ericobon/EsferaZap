import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Simplified Firebase configuration using InsightEsfera project
const INSIGHT_FIREBASE_PROJECT_ID = "login-ee5ed";

// Check if Firebase environment variables are available
const hasFirebaseConfig = !!(
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL
);

let app: any = null;
let adminAuth: any = null;
let adminDb: any = null;

if (hasFirebaseConfig) {
  const serviceAccount = {
    type: "service_account",
    project_id: INSIGHT_FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  try {
    app = initializeApp({
      credential: cert(serviceAccount as any),
      projectId: INSIGHT_FIREBASE_PROJECT_ID,
    });
    
    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
    
    console.log("✅ Firebase Admin initialized successfully with InsightEsfera project");
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
  }
} else {
  console.log("⚠️  Firebase server credentials not found - client auth only");
  console.log("📝 To get server credentials (FIREBASE_PRIVATE_KEY & FIREBASE_CLIENT_EMAIL):");
  console.log("   1. Acesse console.firebase.google.com");
  console.log("   2. Selecione projeto 'login-ee5ed'");
  console.log("   3. Configurações > Contas de serviço");
  console.log("   4. Clique 'Gerar nova chave privada'");
  console.log("   5. Use private_key e client_email do arquivo JSON baixado");
}

export { adminAuth, adminDb };
export default app;
