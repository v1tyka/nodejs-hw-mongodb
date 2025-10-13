import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function initMongoConnection() {
  try {
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const user = process.env.MONGODB_USER;
    const db = process.env.MONGODB_DB;

    console.log('🔍 Checking Mongo ENV vars:');
    console.log('MONGODB_USER:', process.env.MONGODB_USER);
    console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD);
    console.log('MONGODB_URL:', process.env.MONGODB_URL);
    console.log('MONGODB_DB:', process.env.MONGODB_DB);

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
    throw error;
  }
}

export default initMongoConnection;
