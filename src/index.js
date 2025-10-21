import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_ULOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const start = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_ULOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

start();
