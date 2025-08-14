import multer, { type Request, type FileFilterCallback } from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

export class MediaHandler {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async processImage(buffer: Buffer, filename: string): Promise<string> {
    try {
      const outputPath = path.join(this.uploadDir, `processed_${filename}`);
      
      await sharp(buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  }

  async saveFile(buffer: Buffer, filename: string): Promise<string> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      return filePath;
    } catch (error) {
      console.error('File save error:', error);
      throw new Error('Failed to save file');
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  deleteFile(filename: string): void {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('File deletion error:', error);
    }
  }

  validateFileType(mimetype: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.includes(mimetype);
  }

  getFileExtension(mimetype: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'text/plain': '.txt',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
    };
    return extensions[mimetype] || '';
  }

  generateFilename(originalName: string, mimetype: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(mimetype) || path.extname(originalName);
    return `${timestamp}_${randomString}${extension}`;
  }
}

export const mediaHandler = new MediaHandler();