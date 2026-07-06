import mongoose from 'mongoose';

import { env } from '@/config/env';

/**
 * Opens the MongoDB connection used by the application.
 *
 * @returns Mongoose connection promise
 */
export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.DATABASE_URL);
};

/**
 * Closes the active MongoDB connection.
 *
 * @returns Close operation promise
 */
export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
};
