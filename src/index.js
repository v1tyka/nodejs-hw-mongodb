import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

const start = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

start();
