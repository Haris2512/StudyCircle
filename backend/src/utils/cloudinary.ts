// Utilitas untuk mengelola pengunggahan file ke layanan Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { env } from '../config/env';

if (env.CLOUDINARY_URL) {
  // It will automatically configure itself from the CLOUDINARY_URL env var
  cloudinary.config({
    secure: true
  });
}

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string, originalName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!env.CLOUDINARY_URL) {
      return reject(new Error('CLOUDINARY_URL is not configured.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: originalName.split('.')[0] + '-' + Date.now(),
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error('Unknown Cloudinary upload error'));
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
