import http from 'node:http';

import { app } from '@/app';
import { connectDatabase } from '@/config/database';
import { env } from '@/config/env';
import logger from '@/lib/logger';
import { ensureDefaultRoles } from '@/modules/role/role.service';

let server: http.Server;

const SHUTDOWN_TIMEOUT_MS = 10000;

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('MongoDB connected');

    await ensureDefaultRoles();
    logger.info('Default roles ensured');

    server = app.listen(env.PORT, () => {
      logger.info(`Mini ERP backend listening on port ${env.PORT}`);
    });

    server.timeout = 30000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
};

const forceExit = (signal: string) => {
  logger.error(`${signal} could not close connections in time, forcefully shutting down`);
  process.exit(1);
};

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully.`);

  const timer = setTimeout(() => forceExit(signal), SHUTDOWN_TIMEOUT_MS);

  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }

    await import('mongoose').then((m) => m.default.connection.close(false));
    clearTimeout(timer);
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    clearTimeout(timer);
    logger.fatal(error, 'Error during shutdown');
    process.exit(1);
  }
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
