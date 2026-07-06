import http from 'node:http';

import mongoose from 'mongoose';

import { app } from '@/app';
import { connectDatabase } from '@/config/database';
import { env } from '@/config/env';

let server: http.Server;

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('MongoDB connected');

    server = app.listen(env.PORT, () => {
      console.log(`Mini ERP backend listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully.`);

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
  console.error('Unhandled rejection', reason);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception', error);
  process.exit(1);
});

startServer();
