import path from 'node:path';

import swaggerJsdoc from 'swagger-jsdoc';

import { env } from '@/config/env';

const definition: swaggerJsdoc.OAS3Definition = {
  openapi: '3.0.3',
  info: {
    title: 'Mini ERP API',
    version: '1.0.0',
    description:
      'REST API for the Mini ERP Inventory & Sales Management System — authentication, ' +
      'role-based product management, sale creation with automatic stock control, and dashboard reporting.',
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api/v1`,
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Login and JWT issuance' },
    { name: 'Products', description: 'Product catalog CRUD, image upload, search and pagination' },
    { name: 'Categories', description: 'Product category CRUD used to drive category dropdowns' },
    { name: 'Sales', description: 'Sale creation with automatic stock reduction, sale history' },
    { name: 'Dashboard', description: 'Aggregate statistics and low-stock monitoring' },
    { name: 'Setup', description: 'Authenticated app bootstrap payload' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token returned by POST /auth/login, sent as `Authorization: Bearer <token>`.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1c2b3a4d5e6f7a8b9c0d1' },
          name: { type: 'string', example: 'Admin User' },
          email: { type: 'string', format: 'email', example: 'admin@minierp.com' },
          role: { type: 'string', enum: ['admin', 'manager', 'employee'], example: 'admin' },
          roles: {
            type: 'array',
            items: { type: 'string', enum: ['admin', 'manager', 'employee'] },
          },
          permissions: {
            type: 'array',
            items: { type: 'string' },
            example: ['dashboard.view', 'products.view', 'products.create', 'sales.create'],
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          expiresIn: { type: 'string', example: '7d' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f1c2b3a4d5e6f7a8b9c0d1' },
          name: { type: 'string', example: 'Wireless Mouse' },
          sku: { type: 'string', example: 'WM-1001' },
          category: { type: 'string', example: 'Electronics' },
          purchasePrice: { type: 'number', example: 8.5 },
          sellingPrice: { type: 'number', example: 14.99 },
          stockQuantity: { type: 'number', example: 42 },
          image: { type: 'string', example: '/uploads/products/1710000000000-123456789.png' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f1c2b3a4d5e6f7a8b9c0d1' },
          name: { type: 'string', example: 'Electronics' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SaleItemInput: {
        type: 'object',
        required: ['product', 'quantity'],
        properties: {
          product: { type: 'string', description: 'Product id', example: '65f1c2b3a4d5e6f7a8b9c0d1' },
          quantity: { type: 'integer', minimum: 1, example: 2 },
        },
      },
      SaleItem: {
        type: 'object',
        properties: {
          product: { type: 'string' },
          name: { type: 'string', example: 'Wireless Mouse' },
          sku: { type: 'string', example: 'WM-1001' },
          quantity: { type: 'integer', example: 2 },
          unitPrice: { type: 'number', example: 14.99 },
          lineTotal: { type: 'number', example: 29.98 },
        },
      },
      Sale: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          items: { type: 'array', items: { $ref: '#/components/schemas/SaleItem' } },
          grandTotal: { type: 'number', example: 29.98 },
          createdBy: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      DashboardStats: {
        type: 'object',
        properties: {
          totalProducts: { type: 'integer', example: 120 },
          totalSales: { type: 'integer', example: 58 },
          lowStockProducts: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
            description: 'Products with stockQuantity < 5',
          },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 42 },
          totalPages: { type: 'integer', example: 5 },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'A valid email is required' },
              },
            },
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Missing, invalid, or expired authentication token',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
      },
      Forbidden: {
        description: 'Authenticated user role is not permitted to perform this action',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
      },
      NotFound: {
        description: 'Resource does not exist',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
      },
      ValidationError: {
        description: 'Request failed schema validation',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

// glob (used internally by swagger-jsdoc) treats backslashes as escape characters,
// so paths built with path.join must be normalized to forward slashes on Windows.
const toGlobPath = (...segments: string[]) => path.join(...segments).split(path.sep).join('/');

const options: swaggerJsdoc.Options = {
  definition,
  apis: [
    toGlobPath(__dirname, '../modules/**/*.routes.ts'),
    toGlobPath(__dirname, '../modules/**/*.routes.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
