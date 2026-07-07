import http from 'node:http';

import mongoose from 'mongoose';

import { app } from '@/app';
import { connectDatabase } from '@/config/database';
import { env } from '@/config/env';
import logger from '@/lib/logger';

let server: http.Server;

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('MongoDB connected');

    server = app.listen(env.PORT, () => {
      logger.info(`Mini ERP backend listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully.`);

  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    return;
  }

  await mongoose.connection.close();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error(reason, 'Unhandled rejection');
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal(error, 'Uncaught exception');
  process.exit(1);
});

startServer();
