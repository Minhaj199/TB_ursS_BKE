# LINK SHORT – Backend

A **scalable URL shortener backend** built with **Express 5 (TypeScript)**, following **MVC architecture**, using **MongoDB** for storage, **Redis** for caching and rate-limiting, and **Node.js Cluster module** for load balancing.

---

## Features

- **Authentication**
  - JWT-based authentication (access + refresh tokens).
  - Supports login/signup with **email or phone**.
  - Secure password hashing using **bcrypt**.

- **URL Shortening**
  - Generate unique short URLs using **nanoid**.
  - Enforce **100 URL creation limit per user per day** (tracked with Redis).
  - Store URL metadata in MongoDB.

- **Performance & Scalability**
  - **Redis caching** for frequently accessed short links.
  - **Node.js Cluster module** for multi-core load balancing.
  - **Cron jobs** for cleanup (expired URLs).

- **Validation & Error Handling**
  - **Zod** for input validation.
  - **Winston** for logging.
  - **Custom error responses** for consistent API behavior.

- **Other Features**
  - CORS-enabled API.
  - Structured logging with **morgan** + **winston**.
  - TypeScript support throughout.

---

## Tech Stack

- **Express 5 + TypeScript**
- **MongoDB** (Mongoose 8) for persistent storage
- **Redis (ioredis)** for caching and rate limiting
- **JWT (jsonwebtoken 9)** for authentication
- **Cluster module** for load balancing
- **Zod** for schema validation
- **Winston & Morgan** for logging

---
## Getting Started



### Prerequisites
- Node.js >= 20
- MongoDB (local or cloud, e.g., Atlas)
- Redis (local or Docker)
### .env
PORT=
MONGO_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_EXPIRES_IN=
REFRESH_EXPIRES_IN=
EMAIL_REGEX=
PHONE_REGEX=
MAX_URLS_PER_DAY=
BASE_URL=
CRON_JOB_INTERVEL=

### Installation
```bash
# Clone the repository
git clone https://github.com/Minhaj199/TB_ursS_BKE.git
cd TB_ursS_BKE

# Install dependencies
pnpm install
# or
npm install
