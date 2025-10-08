import 'dotenv/config';
import { setupServer } from '../src/server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

await initMongoConnection();
setupServer();
