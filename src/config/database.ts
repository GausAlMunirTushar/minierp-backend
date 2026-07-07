import mongoose from 'mongoose';

import { env } from '@/config/env';
import logger from '@/lib/logger';

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (error) => {
  logger.error(error, 'MongoDB connection error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB connection re-established');
});

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.DATABASE_URL, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close(false);
};
