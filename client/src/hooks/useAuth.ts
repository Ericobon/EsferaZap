import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle network errors gracefully
  const isNetworkError = error && 'message' in (error as any) && (error as any).message.includes('fetch');
  
  return {
    user,
    isLoading: isLoading && !isNetworkError,
    isAuthenticated: !!user,
    error,
  };
}
