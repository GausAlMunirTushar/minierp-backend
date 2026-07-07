import multer from 'multer';

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'images'));
    return;
  }

  cb(null, true);
};

export const productImageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
