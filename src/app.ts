import path from 'node:path';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { env } from '@/config/env';
import { globalLimiter } from '@/config/rateLimit';
import { swaggerSpec } from '@/config/swagger';
import { errorHandler } from '@/middlewares/errorHandler';
import { notFound } from '@/middlewares/notFound';
import { requestId } from '@/middlewares/requestId';
import { sanitize } from '@/middlewares/sanitize';
import { routes } from '@/routes';
import { morganStream } from '@/lib/logger';
import { AppError } from '@/utils/AppError';

export const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
);

const allowedOrigins = env.CLIENT_URL.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new AppError(403, 'Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(requestId);
app.use(globalLimiter);
app.use(compression());
app.use(sanitize);
app.use(express.json({ limit: '10mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: morganStream }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';

  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    message: dbState === 1 ? 'Mini ERP backend is healthy' : 'Database connection is unhealthy',
    data: {
      uptime: process.uptime(),
      database: dbStatus,
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'Mini ERP API Docs' }));

app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);
