import mongoose from 'mongoose';
import config from './env.js';

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose.
 * Gracefully handles missing MONGODB_URI or failed connection without crashing the app.
 */
export const connectDB = async () => {
  const uri = config.mongoUri;

  if (!uri || uri.includes('<username>') || uri.includes('example.mongodb.net')) {
    console.warn(
      '\n⚠️ [MongoDB] MONGODB_URI is not configured or using placeholder credentials in server/.env.\n' +
      '   Database features will remain disconnected until a valid connection string is provided.\n'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || null
});

export default connectDB;

