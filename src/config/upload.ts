import fs from 'node:fs';
import path from 'node:path';

import multer from 'multer';

const productUploadDir = path.join(process.cwd(), 'uploads', 'products');

fs.mkdirSync(productUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, productUploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, uniqueName);
  },
});

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'images'));
    return;
  }

  cb(null, true);
};

export const productImageUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
