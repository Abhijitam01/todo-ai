# 🐳 Complete Docker Setup Guide

## Overview

This guide shows you how to run **everything** with Docker - not just PostgreSQL and Redis, but also the API, Web app, and Worker.

---

## 🎯 Current vs. Full Docker Setup

### Current Setup (Partial)
- ✅ PostgreSQL in Docker
- ✅ Redis in Docker
- ❌ API runs on host (port 3001)
- ❌ Web runs on host (port 3000)
- ❌ Worker runs on host

### Full Docker Setup (What We'll Build)
- ✅ PostgreSQL in Docker
- ✅ Redis in Docker
- ✅ API in Docker
- ✅ Web in Docker
- ✅ Worker in Docker
- ✅ Everything orchestrated with docker-compose

---

## 📁 Files We'll Create

1. `Dockerfile.api` - NestJS API container
2. `Dockerfile.web` - Next.js Web container
3. `Dockerfile.worker` - BullMQ Worker container
4. `docker-compose.yml` - Updated with all services
5. `.dockerignore` - Exclude unnecessary files

---

## 🚀 Quick Start (After Setup)

```bash
# Build all images
docker-compose build

# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

**Access Points**:
- 🌐 Web: http://localhost:3000
- 🔌 API: http://localhost:3001
- 📊 Redis Commander: http://localhost:8081 (if enabled)

---

## 📋 Step-by-Step Setup

### Step 1: Create Dockerfiles

#### `Dockerfile.api` (NestJS API)
```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/*/package.json ./packages/*/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter @todoai/api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/node_modules ./packages/db/node_modules

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

#### `Dockerfile.web` (Next.js)
```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/*/package.json ./packages/*/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build --filter @todoai/web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "server.js"]
```

#### `Dockerfile.worker` (BullMQ Worker)
```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/*/package.json ./packages/*/
COPY apps/worker/package.json ./apps/worker/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter @todoai/worker

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/worker/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/node_modules ./packages/db/node_modules

WORKDIR /app/apps/worker
CMD ["node", "dist/main.js"]
```

### Step 2: Create `.dockerignore`

```dockerignore
node_modules
.next
dist
.git
.env
.env.local
*.log
.DS_Store
coverage
.vscode
.idea
turbo.json
tsconfig.tsbuildinfo
```

### Step 3: Update `docker-compose.yml`

Add these services to your existing `docker-compose.yml`:

```yaml
version: "3.9"

services:
  # Database Services (existing)
  postgres:
    image: postgres:16-alpine
    container_name: todoai-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: todoai
      POSTGRES_PASSWORD: todoai_dev_password
      POSTGRES_DB: todoai
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U todoai -d todoai"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: todoai-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Application Services (new)
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: todoai-api
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://todoai:todoai_dev_password@postgres:5432/todoai?schema=public
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - API_PORT=3001
      - CORS_ORIGINS=http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    container_name: todoai-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:3001
      - NEXT_PUBLIC_WS_URL=ws://localhost:3001
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    container_name: todoai-worker
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://todoai:todoai_dev_password@postgres:5432/todoai?schema=public
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - LOG_LEVEL=info
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      api:
        condition: service_healthy

  # Optional: Redis Commander for debugging
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: todoai-redis-commander
    restart: unless-stopped
    environment:
      REDIS_HOSTS: local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis
    profiles:
      - debug

volumes:
  postgres_data:
  redis_data:
```

### Step 4: Update Next.js Config for Docker

Update `apps/web/next.config.js` to enable standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker
  // ... rest of your config
};

module.exports = nextConfig;
```

---

## 🔧 Development vs. Production

### Development (Current - Recommended)
Run databases in Docker, apps on host:
```bash
# Start only databases
docker-compose up -d postgres redis

# Run apps locally
pnpm dev
```

**Pros**: Fast hot-reload, easy debugging  
**Cons**: Need Node.js installed locally

### Production (Full Docker)
Run everything in Docker:
```bash
# Build and start all services
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f
```

**Pros**: Consistent environment, easy deployment  
**Cons**: Slower rebuilds, harder debugging

---

## 🛠️ Common Commands

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis api

# View logs
docker-compose logs -f
docker-compose logs -f api
docker-compose logs -f worker

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose build --no-cache api

# Execute command in container
docker-compose exec api sh
docker-compose exec postgres psql -U todoai -d todoai

# Check service status
docker-compose ps

# Restart service
docker-compose restart api
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear Docker cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build -f Dockerfile.api -t test-api .
```

### Services Won't Start
```bash
# Check logs
docker-compose logs api
docker-compose logs worker

# Check if ports are available
lsof -i :3000
lsof -i :3001

# Verify environment variables
docker-compose config
```

### Database Connection Issues
```bash
# Verify postgres is healthy
docker-compose ps postgres
docker-compose logs postgres

# Test connection from container
docker-compose exec api sh
# Inside container: ping postgres
```

### Prisma Issues in Docker
```bash
# Generate Prisma client in container
docker-compose exec api sh
# Inside container:
cd /app
pnpm db:generate
pnpm db:push
```

---

## 📝 Environment Variables

Create a `.env` file (or use existing):

```env
# Database (used by Docker services)
DATABASE_URL="postgresql://todoai:todoai_dev_password@postgres:5432/todoai?schema=public"
REDIS_URL="redis://redis:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# AI
GEMINI_API_KEY="your-api-key"

# API
API_PORT=3001
CORS_ORIGINS="http://localhost:3000"
```

**Note**: In Docker, use service names (`postgres`, `redis`) instead of `localhost`.

---

## 🚀 Production Deployment

For production, consider:

1. **Use Docker Compose v2** with profiles
2. **Add reverse proxy** (nginx/traefik)
3. **Use secrets management** (Docker secrets, Vault)
4. **Add monitoring** (Prometheus, Grafana)
5. **Use health checks** (already included)
6. **Set resource limits** in docker-compose.yml
7. **Use multi-stage builds** (already included)
8. **Add image scanning** (Trivy, Snyk)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All containers start: `docker-compose ps`
- [ ] API health check: `curl http://localhost:3001/api/v1/health`
- [ ] Web app loads: http://localhost:3000
- [ ] Worker processes jobs (check logs)
- [ ] Database connection works
- [ ] Redis connection works
- [ ] WebSocket connections work

---

## 📚 Next Steps

1. Create the Dockerfiles (see Step 1)
2. Update docker-compose.yml
3. Update Next.js config
4. Build and test: `docker-compose build && docker-compose up`
5. Verify everything works
6. Document any issues you encounter

---

## 🆘 Need Help?

- Check logs: `docker-compose logs -f [service]`
- Inspect container: `docker-compose exec [service] sh`
- Check Docker docs: https://docs.docker.com/
- Check Compose docs: https://docs.docker.com/compose/

