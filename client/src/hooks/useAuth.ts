import { useState, useEffect } from "react";
import { onAuthStateChange, AuthUser, getUserData, UserData } from "@/lib/auth";

interface UseAuthReturn {
  user: AuthUser | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      try {
        setUser(user);
        
        if (user) {
          const data = await getUserData(user.uid);
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication error");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { user, userData, loading, error };
};
