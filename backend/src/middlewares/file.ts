import multer, { Options } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TEMP_PATH = process.env.UPLOAD_PATH_TEMP || 'temp';
const UPLOAD_DIR = path.join(__dirname, 'public', TEMP_PATH);
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter: Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый тип файла. Разрешены: JPEG, PNG, GIF, WebP'));
  }
};

const fileMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export default fileMiddleware;
