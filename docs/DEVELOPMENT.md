# 🚀 Development & Setup Guide

This guide provides detailed instructions for setting up Trudoo AI for local development and production-like environments using Docker.

## Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Docker & Docker Compose**: Required for databases and full-stack deployment.
- **Gemini API Key**: [Get one here](https://makersuite.google.com/app/apikey)

---

## 🛠️ Local Development Setup

Perfect for local development with hot-reload.

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd todoai
pnpm install
```

### 2. Setup Environment

```bash
cp env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY="your-actual-api-key-here"
```

### 3. Start Databases

```bash
# Start just PostgreSQL and Redis
docker-compose up -d
```

### 4. Setup Database

```bash
pnpm db:generate
pnpm db:push
```

### 5. Start All Services

```bash
pnpm dev
```

**Access**: 
- **Web**: http://localhost:3000
- **API**: http://localhost:3001
- **Prisma Studio**: `pnpm db:studio`

---

## 🐳 Docker Deployment (Full Stack)

Run everything in containers for a production-like environment.

### 1. Setup Environment
Ensure your `.env` file is configured with the necessary API keys.

### 2. Start Everything

```bash
# Build and start all services (postgres, redis, api, web, worker)
docker-compose --profile full up -d
```

### 3. Manage Services

```bash
# View logs
docker-compose --profile full logs -f

# Stop all services
docker-compose --profile full down

# Stop and delete data (WARNING: destructive)
docker-compose --profile full down -v
```

---

## 🔧 Troubleshooting

### Port Conflicts
If ports 3000 or 3001 are already in use:
```bash
sudo lsof -i :3000
sudo lsof -i :3001
```

### Docker Issues
```bash
# Check container status
docker ps

# View specific logs
docker logs todoai-postgres
docker logs todoai-redis
```

### Database Reset
If you need to start fresh:
```bash
docker-compose down -v
docker-compose up -d
pnpm db:push
```

---

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run linter |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Create a new migration |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test` | Run unit tests |

---

## 📐 Architecture Overview

Trudoo AI follows a monorepo architecture with a clean separation of concerns:

- **Frontend**: Next.js 14 (App Router, Zustand, TanStack Query, shadcn/ui)
- **Backend**: NestJS (Auth, Goals, Plans, Tasks, AI Orchestrator)
- **Worker**: BullMQ for async AI processing
- **Packages**: Shared UI, DB, AI services, and types.

See [README.md](../README.md) for more details on features and user flow.
