import type { IStorage } from '../storage';
import { MemStorage } from '../storage';
import { FirebaseStorage } from './firebase-storage';
import { adminDb } from '../services/firebase';

/**
 * Storage factory that chooses between MemStorage and FirebaseStorage
 * based on Firebase availability and environment configuration
 */
class StorageFactory {
  private static instance: IStorage | null = null;

  static getInstance(): IStorage {
    if (!this.instance) {
      this.instance = this.createStorage();
    }
    return this.instance;
  }

  private static createStorage(): IStorage {
    // Check if Firebase is available and configured
    const useFirebase = !!(adminDb && process.env.FIREBASE_PROJECT_ID);
    
    // Allow override via environment variable
    const forceMemStorage = process.env.FORCE_MEM_STORAGE === 'true';
    
    if (useFirebase && !forceMemStorage) {
      try {
        console.log('🔥 Initializing Firebase Storage for multi-tenant SaaS');
        return new FirebaseStorage();
      } catch (error) {
        console.error('❌ Failed to initialize Firebase Storage, falling back to MemStorage:', error);
        return new MemStorage();
      }
    } else {
      console.log('💾 Using MemStorage (development mode)');
      if (!useFirebase) {
        console.log('⚠️  Firebase not configured. For production SaaS, configure Firebase credentials.');
      }
      return new MemStorage();
    }
  }

  // Method to switch storage implementation (useful for testing)
  static setStorage(storage: IStorage): void {
    this.instance = storage;
  }

  // Method to reset storage (useful for testing)
  static reset(): void {
    this.instance = null;
  }
}

// Export the singleton instance
export const storage = StorageFactory.getInstance();

// Export types and classes for direct use if needed
export { IStorage, MemStorage, FirebaseStorage };
export default StorageFactory;