import { Storage } from '@google-cloud/storage';
import { adminDb } from './firebase';
import { randomUUID } from 'crypto';

// Google Cloud Storage service for EsferaZap SaaS
export class GCSStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    // Initialize GCS with the same credentials as Firebase
    this.storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID || 'login-ee5ed',
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Optional: path to service account key
    });
    
    this.bucketName = process.env.GCS_BUCKET_NAME || 'esferazap-conversations';
  }

  /**
   * Initialize the GCS bucket if it doesn't exist
   */
  async initializeBucket(): Promise<void> {
    try {
      const [bucketExists] = await this.storage.bucket(this.bucketName).exists();
      
      if (!bucketExists) {
        console.log(`Creating GCS bucket: ${this.bucketName}`);
        await this.storage.createBucket(this.bucketName, {
          location: 'US', // or your preferred location
          storageClass: 'STANDARD',
        });
        console.log(`✅ GCS bucket ${this.bucketName} created successfully`);
      } else {
        console.log(`✅ GCS bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      console.error('❌ Error initializing GCS bucket:', error);
      throw error;
    }
  }

  /**
   * Backup conversations for a specific bot to GCS
   */
  async backupConversations(userId: string, botId: string, conversations: any[]): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `conversations/${userId}/${botId}/backup-${timestamp}.json`;
      
      const file = this.storage.bucket(this.bucketName).file(fileName);
      
      const backupData = {
        userId,
        botId,
        timestamp: new Date().toISOString(),
        totalMessages: conversations.length,
        conversations
      };
      
      await file.save(JSON.stringify(backupData, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            userId,
            botId,
            backupType: 'conversations',
            createdAt: new Date().toISOString()
          }
        }
      });
      
      console.log(`✅ Conversations backed up to GCS: ${fileName}`);
      return fileName;
    } catch (error) {
      console.error('❌ Error backing up conversations:', error);
      throw error;
    }
  }

  /**
   * Restore conversations from GCS backup
   */
  async restoreConversations(fileName: string): Promise<any> {
    try {
      const file = this.storage.bucket(this.bucketName).file(fileName);
      const [contents] = await file.download();
      
      const backupData = JSON.parse(contents.toString());
      console.log(`✅ Conversations restored from GCS: ${fileName}`);
      
      return backupData;
    } catch (error) {
      console.error('❌ Error restoring conversations:', error);
      throw error;
    }
  }

  /**
   * List all backups for a specific user
   */
  async listUserBackups(userId: string): Promise<string[]> {
    try {
      const [files] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `conversations/${userId}/`,
        delimiter: '/'
      });
      
      return files.map(file => file.name);
    } catch (error) {
      console.error('❌ Error listing user backups:', error);
      return [];
    }
  }

  /**
   * Delete old backups (retention policy)
   */
  async cleanupOldBackups(userId: string, retentionDays: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      const [files] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `conversations/${userId}/`
      });
      
      const filesToDelete = files.filter(file => {
        const [metadata] = file.metadata;
        const createdDate = new Date(metadata.timeCreated);
        return createdDate < cutoffDate;
      });
      
      for (const file of filesToDelete) {
        await file.delete();
        console.log(`🗑️ Deleted old backup: ${file.name}`);
      }
      
      console.log(`✅ Cleanup completed. Deleted ${filesToDelete.length} old backups`);
    } catch (error) {
      console.error('❌ Error cleaning up old backups:', error);
    }
  }

  /**
   * Upload WhatsApp media files
   */
  async uploadMedia(userId: string, botId: string, mediaBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    try {
      const fileExtension = fileName.split('.').pop() || 'bin';
      const uniqueFileName = `media/${userId}/${botId}/${randomUUID()}.${fileExtension}`;
      
      const file = this.storage.bucket(this.bucketName).file(uniqueFileName);
      
      await file.save(mediaBuffer, {
        metadata: {
          contentType: mimeType,
          metadata: {
            userId,
            botId,
            originalFileName: fileName,
            uploadedAt: new Date().toISOString()
          }
        }
      });
      
      // Generate a signed URL for access
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      console.log(`✅ Media uploaded to GCS: ${uniqueFileName}`);
      return signedUrl;
    } catch (error) {
      console.error('❌ Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Get storage usage statistics for a user
   */
  async getUserStorageStats(userId: string): Promise<{ totalFiles: number; totalSizeBytes: number }> {
    try {
      const [files] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `conversations/${userId}/`
      });
      
      const [mediaFiles] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `media/${userId}/`
      });
      
      const allFiles = [...files, ...mediaFiles];
      const totalSizeBytes = allFiles.reduce((total, file) => {
        return total + (parseInt(file.metadata.size || '0'));
      }, 0);
      
      return {
        totalFiles: allFiles.length,
        totalSizeBytes
      };
    } catch (error) {
      console.error('❌ Error getting storage stats:', error);
      return { totalFiles: 0, totalSizeBytes: 0 };
    }
  }

  /**
   * Export user data for GDPR compliance
   */
  async exportUserData(userId: string): Promise<string> {
    try {
      // Get all user files
      const [conversationFiles] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `conversations/${userId}/`
      });
      
      const [mediaFiles] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `media/${userId}/`
      });
      
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        conversations: conversationFiles.map(f => f.name),
        media: mediaFiles.map(f => f.name),
        totalFiles: conversationFiles.length + mediaFiles.length
      };
      
      const exportFileName = `exports/${userId}/user-data-export-${Date.now()}.json`;
      const file = this.storage.bucket(this.bucketName).file(exportFileName);
      
      await file.save(JSON.stringify(exportData, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            userId,
            exportType: 'user-data',
            createdAt: new Date().toISOString()
          }
        }
      });
      
      console.log(`✅ User data exported: ${exportFileName}`);
      return exportFileName;
    } catch (error) {
      console.error('❌ Error exporting user data:', error);
      throw error;
    }
  }

  /**
   * Delete all user data (GDPR right to be forgotten)
   */
  async deleteUserData(userId: string): Promise<void> {
    try {
      const [allFiles] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `conversations/${userId}/`
      });
      
      const [mediaFiles] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `media/${userId}/`
      });
      
      const [exportFiles] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `exports/${userId}/`
      });
      
      const filesToDelete = [...allFiles, ...mediaFiles, ...exportFiles];
      
      for (const file of filesToDelete) {
        await file.delete();
      }
      
      console.log(`✅ Deleted ${filesToDelete.length} files for user ${userId}`);
    } catch (error) {
      console.error('❌ Error deleting user data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const gcsStorage = new GCSStorageService();