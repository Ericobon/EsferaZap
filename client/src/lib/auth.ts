import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface AuthUser extends User {
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
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user as AuthUser;
};

export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  }
  return null;
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user as AuthUser | null);
  });
};
