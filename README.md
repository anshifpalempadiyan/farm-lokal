# Backend Take-Home Assignment – FarmLokal

## Overview
This project implements a performance-focused backend service for product listing.
It demonstrates efficient database querying, Redis-based caching, idempotent webhook handling,
and clean separation of concerns.

The solution is designed to handle large datasets while keeping APIs fast and reliable.

---

## Tech Stack
- Node.js + Express
- TypeScript
- MySQL (mysql2)
- Redis
- Axios
- dotenv

---

## Setup Instructions

### 1. Install dependencies
npm install

### 2. Environment variables
Create a `.env` file with the following:

PORT=3000

MYSQL_HOST=localhost
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=farmlokal

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

OAUTH_TOKEN_URL=https://example.com/oauth/token
OAUTH_CLIENT_ID=test_client_id
OAUTH_CLIENT_SECRET=test_client_secret
OAUTH_SCOPE=read:products

> OAuth variables are used only for external API integration.

---

### 3. Start services
MySQL and Redis must be running.

---

### 4. Run the server
npm run dev

Expected output:
- MySQL connected
- Redis connected
- Server running on port 3000

---

## API Documentation

### GET /products
Returns a paginated list of products.

#### Query Parameters
- page
- limit
- category
- minPrice
- maxPrice
- sort (price_asc, price_desc, created_asc, created_desc)

#### Example
GET /products?page=1&limit=20&sort=price_desc

---

## Performance Optimizations
- Indexed MySQL queries
- Redis caching for product listing
- Deterministic cache keys
- Cache-first read strategy

Redis cache behavior was validated by serving responses even when MySQL was stopped.

---

## Webhook Handling
- Webhook events are idempotent
- Duplicate events are ignored using Redis
- Webhook always returns HTTP 200

---

## OAuth & External APIs
- OAuth client-credentials flow implemented
- Access tokens cached in Redis with TTL
- Redis locking prevents parallel token refresh
- OAuth logic is isolated from core APIs

---

## Error Handling
- Centralized error middleware
- Graceful startup failure handling
- No sensitive information exposed

---

## Testing Notes
The system was tested for:
- Cache hit and miss behavior
- Pagination, filtering, and sorting
- Database failure scenarios
- Redis caching correctness
- Webhook idempotency

---

## Trade-offs
- Cursor pagination was not implemented to keep the solution simple and readable
- TTL-based cache invalidation was chosen over manual invalidation
- OAuth flow uses mock configuration for demonstration

---

## Status
All mandatory requirements of the assignment are completed.
Optional features were intentionally excluded to maintain focus and clarity.
