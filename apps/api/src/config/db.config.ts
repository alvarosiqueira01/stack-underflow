import mongoose from 'mongoose';
import { env } from './env.config';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${env.mongoUri}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
