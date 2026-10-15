import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveUploadDir = () => {
  const relUploads = path.resolve(__dirname, '../../../uploads');
  const cwdBackendUploads = path.resolve(process.cwd(), 'backend/uploads');
  const cwdUploads = path.resolve(process.cwd(), 'uploads');

  const dir = fs.existsSync(relUploads)
    ? relUploads
    : fs.existsSync(cwdBackendUploads)
    ? cwdBackendUploads
    : cwdUploads;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const uploadDir = resolveUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `electrical-photo-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter
});
