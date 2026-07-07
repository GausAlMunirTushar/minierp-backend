import path from 'node:path';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from '@/config/env';
import { errorHandler } from '@/middlewares/errorHandler';
import { notFound } from '@/middlewares/notFound';
import { routes } from '@/routes';

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = env.CLIENT_URL.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mini ERP backend is healthy',
  });
});

app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);
