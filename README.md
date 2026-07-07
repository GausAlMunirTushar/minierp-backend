# Mini ERP Backend

Node.js, Express, TypeScript, MongoDB, and Mongoose API for the Mini ERP Inventory & Sales Management System — JWT authentication, role-based authorization, product CRUD with image upload, sale creation with automatic stock control, and dashboard reporting.

## Tech Stack

- Node.js, Express 4, TypeScript 5
- MongoDB, Mongoose 8
- JWT (`jsonwebtoken`) + `bcryptjs` password hashing
- Zod request validation
- Multer disk-storage image uploads
- `swagger-jsdoc` + `swagger-ui-express` API documentation

## Prerequisites

- Node.js 20+
- pnpm
- A running MongoDB instance (a local single-node instance works; sale creation automatically falls back to a non-transactional path when the server isn't a replica set)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm seed   # creates the default admin/manager/employee users
pnpm dev    # starts the API on http://localhost:4000
```

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `PORT` | HTTP port the API listens on | `4000` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/minierp` |
| `JWT_SECRET` | Secret used to sign access tokens | — (required) |
| `JWT_EXPIRES_IN` | Access token lifetime | `7d` |
| `BCRYPT_SALT_ROUNDS` | bcrypt hashing cost | `12` |
| `CLIENT_URL` | Comma-separated list of allowed CORS origins (frontend URL) | `http://localhost:5173` |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the API in watch mode (`ts-node-dev`) |
| `pnpm build` | Type-check and compile to `dist/` |
| `pnpm start` | Run the compiled build (`dist/server.js`) |
| `pnpm seed` | Upsert the default admin/manager/employee accounts |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Run Prettier |

## Default Seed Users

Created/updated by `pnpm seed` (see `src/seeders/`):

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@minierp.com | Password123! |
| Manager | manager@minierp.com | Password123! |
| Employee | employee@minierp.com | Password123! |

## API Documentation

Interactive Swagger UI is served once the API is running:

- UI: `http://localhost:4000/api-docs`
- Raw OpenAPI JSON: `http://localhost:4000/api-docs.json`

Every route is documented with request/response schemas, required roles, and error responses. Authenticate first via `POST /auth/login`, then use the "Authorize" button in Swagger UI with the returned `accessToken` to try protected endpoints.

## Main Endpoints

All routes are prefixed with `/api/v1`.

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Authenticate and receive a JWT |
| GET | `/setup` | Authenticated | App bootstrap payload (current user + permissions) |
| GET | `/products` | Admin, Manager, Employee | Paginated product list (search, category filter, sort) |
| POST | `/products` | Admin, Manager | Create a product (image required, `multipart/form-data`) |
| GET | `/products/:id` | Admin, Manager, Employee | Product detail |
| PATCH | `/products/:id` | Admin, Manager | Update a product (image optional) |
| DELETE | `/products/:id` | Admin | Delete a product |
| POST | `/sales` | Admin, Manager, Employee | Create a sale (reduces stock, calculates grand total) |
| GET | `/sales` | Admin, Manager | Paginated sale history |
| GET | `/dashboard/stats` | Admin, Manager, Employee | Total products, total sales, low-stock (`< 5`) products |

## Response Format

Success:

```json
{ "success": true, "message": "Operation successful", "data": {}, "meta": {} }
```

Error:

```json
{ "success": false, "message": "Readable error message", "errors": [] }
```

## Project Structure

```
src/
  app.ts                 # Express app, middleware, Swagger mount
  server.ts              # HTTP server bootstrap + graceful shutdown
  routes.ts              # Mounts feature routers under /api/v1
  config/                # env, database, multer upload, swagger spec
  middlewares/           # authenticate, authorize, validate, errorHandler, notFound
  modules/
    auth/                # login
    user/                # user model, role -> permission map
    product/              # product CRUD, image upload, search/pagination
    sale/                # sale creation, stock control, sale history
    dashboard/           # aggregate stats
    setup/               # authenticated app bootstrap payload
  seeders/               # seed data: users, roles, categories (run via `pnpm seed`)
  utils/                 # AppError, catchAsync, queryBuilder, sendResponse
```

Each module follows the same shape: `*.routes.ts` -> `*.controller.ts` -> `*.service.ts`, with `*.validation.ts` (Zod schemas) and `*.model.ts`/`*.interface.ts` where the module owns data.
