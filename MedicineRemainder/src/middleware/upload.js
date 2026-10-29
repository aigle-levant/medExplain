import multer from 'multer';
import path from 'path';

// Allowed MIME types for prescriptions
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf'
];

// Extension mapping in case curl or clients send application/octet-stream
const EXTENSION_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf'
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // If MIME type is directly valid
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }

  // If client sent application/octet-stream (common in curl), resolve via file extension
  if (EXTENSION_MAP[ext]) {
    file.mimetype = EXTENSION_MAP[ext];
    return cb(null, true);
  }

  return cb(
    new Error(
      `Invalid file type: ${file.mimetype}. Only images (JPEG, PNG, WEBP) and PDF files are allowed.`
    ),
    false
  );
};

export const uploadPrescription = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  },
  fileFilter
});
