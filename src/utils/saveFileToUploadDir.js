import path from 'node:path';
import fs from 'node:fs/promises';
import { UPLOAD_DIR, TEMP_ULOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_ULOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename)
  );

  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
