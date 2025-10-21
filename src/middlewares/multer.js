import multer from 'multer';
import { TEMP_ULOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_ULOAD_DIR);
  },
  filename: function (req, file, cb) {
    const preffix = Date.now();
    cb(null, `${preffix})${file.originalname}`);
  },
});

export const upload = multer({ storage });
