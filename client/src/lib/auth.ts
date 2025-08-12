import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  company?: string;
  createdAt: string;
}

export const signUp = async (email: string, password: string, name: string, company?: string): Promise<AuthUser> => {
  if (!auth || !db) {
    // Demo mode - return mock user
    const mockUser: AuthUser = {
      uid: "demo-user",
      email: email,
      displayName: name,
    };
    return mockUser;
  }

  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user document in Firestore
  const userData: UserData = {
    uid: user.uid,
    name,
    email,
    company,
    createdAt: new Date().toISOString(),
  };
  
  await setDoc(doc(db, "users", user.uid), userData);
  
  return user as AuthUser;
};

export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  if (!auth) {
    // Demo mode - return mock user
    const mockUser: AuthUser = {
      uid: "demo-user", 
      email: email,
      displayName: "Demo User",
    };
    return mockUser;
  }

  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user as AuthUser;
};

export const logOut = async (): Promise<void> => {
  if (!auth) {
    // Demo mode - do nothing
    return;
  }
  await signOut(auth);
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  if (!db) {
    // Demo mode - return mock user data
    return {
      uid: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
      company: "Demo Company",
      createdAt: new Date().toISOString(),
    };
  }

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  }
  return null;
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  if (!auth) {
    // Demo mode - simulate logged in demo user
    const mockUser: AuthUser = {
      uid: "demo-user",
      email: "demo@example.com", 
      displayName: "Demo User",
    };
    setTimeout(() => callback(mockUser), 100);
    return () => {}; // Return empty cleanup function
  }

  return onAuthStateChanged(auth, (user) => {
    callback(user as AuthUser | null);
  });
};
