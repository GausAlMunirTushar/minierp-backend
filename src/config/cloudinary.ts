import { v2 as cloudinary } from 'cloudinary';

import { env } from '@/config/env';
import logger from '@/lib/logger';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

type UploadResult = {
  url: string;
  publicId: string;
};

const sanitizePublicId = (originalname: string): string => {
  const nameWithoutExt = originalname.replace(/\.[^.]+$/, '');

  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return `${sanitized}-${Date.now()}`;
};

export const uploadProductImage = (file: Express.Multer.File): Promise<UploadResult> =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'minierp/products',
        public_id: sanitizePublicId(file.originalname),
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          logger.error(error, 'Cloudinary upload failed');
          return reject(new Error('Image upload failed'));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(file.buffer);
  });

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (error) {
    logger.error({ publicId, error }, 'Cloudinary image deletion failed');
  }
};
