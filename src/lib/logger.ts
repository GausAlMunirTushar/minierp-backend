import pino from 'pino';

import { env } from '@/config/env';

const isProduction = env.NODE_ENV === 'production';

const logger = pino({
  level: isProduction ? 'info' : 'debug',
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }),
  mixin() {
    return {};
  },
});

export default logger;

export const morganStream = {
  write: (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const statusCode = Number(trimmed.match(/\s(\d{3})\s/)?.[1] || 0);

    if (statusCode >= 500) {
      logger.error({ type: 'http' }, trimmed);
    } else if (statusCode >= 400) {
      logger.warn({ type: 'http' }, trimmed);
    } else {
      logger.info({ type: 'http' }, trimmed);
    }
  },
};
