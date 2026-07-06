# Mini ERP Backend

Node.js, Express, TypeScript, MongoDB, and Mongoose API for inventory and sales management.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm seed
pnpm dev
```

## Default Seed Users

| Role     | Email                  | Password     |
| -------- | ---------------------- | ------------ |
| Admin    | admin@minierp.com    | Admin123!    |
| Manager  | manager@minierp.com | Manager123!  |
| Employee | employee@minierp.com | Employee123! |

## Main Endpoints

- `POST /api/v1/auth/login`
- `GET /api/v1/products`
- `POST /api/v1/products`
- `PATCH /api/v1/products/:id`
- `DELETE /api/v1/products/:id`
- `POST /api/v1/sales`
- `GET /api/v1/sales`
- `GET /api/v1/dashboard/stats`
