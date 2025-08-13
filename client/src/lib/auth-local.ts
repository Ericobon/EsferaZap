// Local authentication for development without Firebase setup
// This allows testing the UI without Firebase configuration

interface LocalUser {
  uid: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
}

const STORAGE_KEY = 'esferazap-local-auth';

export const localAuth = {
  // Simulate sign up
  signUp: async (email: string, password: string, name: string, company?: string, phone?: string): Promise<LocalUser> => {
    const user: LocalUser = {
      uid: `local-${Date.now()}`,
      email,
      name,
      company,
      phone,
    };
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    return user;
  },

  // Simulate sign in
  signIn: async (email: string, password: string): Promise<LocalUser> => {
    // For demo, accept any email/password
    const user: LocalUser = {
      uid: `local-${Date.now()}`,
      email,
      name: email.split('@')[0], // Use email prefix as name
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    return user;
  },

  // Get current user
  getCurrentUser: (): LocalUser | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  }
};

// Auto-login for development
if (process.env.NODE_ENV === 'development') {
  const demoUser = localAuth.getCurrentUser();
  if (!demoUser) {
    console.log('🔧 Development mode: You can use any email/password to test');
  }
}