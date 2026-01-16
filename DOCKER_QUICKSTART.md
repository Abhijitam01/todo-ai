# 🚀 Docker Quick Start Guide

## Overview

You now have **complete Docker setup** for TodoAI! This guide shows you how to use it.

---

## 🎯 Two Ways to Run

### Option 1: Development Mode (Recommended for Development)
**Run databases in Docker, apps on your machine**

```bash
# Start only PostgreSQL and Redis
docker-compose up -d postgres redis

# Run apps locally (with hot-reload)
pnpm dev
```

**Pros**: Fast development, easy debugging  
**Use when**: Actively coding

---

### Option 2: Full Docker Mode (Recommended for Production/Testing)
**Run everything in Docker**

```bash
# Build all images
docker-compose build

# Start all services
docker-compose --profile full up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

**Pros**: Consistent environment, production-like  
**Use when**: Testing deployment, production

---

## 📋 Quick Commands

### Development (Databases Only)
```bash
# Start databases
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Stop
docker-compose down
```

### Full Stack (Everything in Docker)
```bash
# Build and start
docker-compose --profile full build
docker-compose --profile full up -d

# View all logs
docker-compose --profile full logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f worker

# Restart a service
docker-compose restart api

# Stop everything
docker-compose --profile full down
```

---

## 🔍 Verify Everything Works

### 1. Check Services Are Running
```bash
docker-compose ps
```

Should show:
- ✅ `todoai-postgres` (healthy)
- ✅ `todoai-redis` (healthy)
- ✅ `todoai-api` (if using full profile)
- ✅ `todoai-web` (if using full profile)
- ✅ `todoai-worker` (if using full profile)

### 2. Test API
```bash
# Health check
curl http://localhost:3001/api/v1/health

# Should return: {"status":"ok",...}
```

### 3. Test Web App
Open browser: http://localhost:3000

### 4. Test Database Connection
```bash
# From host
docker-compose exec postgres psql -U todoai -d todoai -c "SELECT 1;"

# Should return: 1
```

### 5. Test Redis Connection
```bash
# From host
docker-compose exec redis redis-cli ping

# Should return: PONG
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000  # Web
sudo lsof -i :3001  # API
sudo lsof -i :5432  # PostgreSQL
sudo lsof -i :6379  # Redis

# Stop conflicting services or change ports in docker-compose.yml
```

### Build Fails
```bash
# Clear cache and rebuild
docker-compose build --no-cache

# Check Dockerfile syntax
docker build -f Dockerfile.api -t test-api .
```

### Services Won't Start
```bash
# Check logs
docker-compose logs api
docker-compose logs worker

# Check environment variables
docker-compose config

# Verify .env file exists and has required values
cat .env | grep GEMINI_API_KEY
```

### Database Connection Issues
```bash
# Verify postgres is healthy
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U todoai -d todoai -c "SELECT version();"
```

### Prisma Issues in Docker
If you need to run Prisma commands in Docker:

```bash
# Enter API container
docker-compose exec api sh

# Inside container, run Prisma commands
cd /app
pnpm db:generate
pnpm db:push
```

---

## 📝 Environment Variables

Make sure your `.env` file has:

```env
# Required
DATABASE_URL="postgresql://todoai:todoai_dev_password@postgres:5432/todoai?schema=public"
REDIS_URL="redis://redis:6379"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
GEMINI_API_KEY="your-api-key"

# Optional
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
LOG_LEVEL="info"
```

**Note**: In Docker, use service names (`postgres`, `redis`) instead of `localhost` in connection strings.

---

## 🎛️ Docker Compose Profiles

Profiles let you control which services start:

- **No profile** (default): Only `postgres` and `redis`
- **`--profile full`**: All services (postgres, redis, api, web, worker)
- **`--profile debug`**: Adds Redis Commander
- **`--profile production`**: Production services (api, web, worker)

### Examples

```bash
# Start databases + Redis Commander
docker-compose --profile debug up -d

# Start everything
docker-compose --profile full up -d

# Start production services
docker-compose --profile production up -d
```

---

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Web | 3000 | http://localhost:3000 |
| API | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| Redis Commander | 8081 | http://localhost:8081 (debug profile) |

---

## 🔄 Common Workflows

### Daily Development
```bash
# Start databases
docker-compose up -d

# Run apps locally
pnpm dev

# When done
docker-compose down
```

### Testing Full Stack
```bash
# Build and start everything
docker-compose --profile full build
docker-compose --profile full up -d

# Test
curl http://localhost:3001/api/v1/health
open http://localhost:3000

# Clean up
docker-compose --profile full down
```

### Debugging
```bash
# Start with Redis Commander
docker-compose --profile debug up -d

# View logs
docker-compose logs -f api

# Enter container
docker-compose exec api sh
```

---

## ✅ Checklist

After setup, verify:

- [ ] Docker is installed: `docker --version`
- [ ] Docker Compose is installed: `docker-compose --version`
- [ ] `.env` file exists with required variables
- [ ] Databases start: `docker-compose up -d`
- [ ] API health check works: `curl http://localhost:3001/api/v1/health`
- [ ] Web app loads: http://localhost:3000
- [ ] Worker processes jobs (check logs)

---

## 📚 More Information

- **Full Docker Setup**: See [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- **Codebase Assessment**: See [CODEBASE_ASSESSMENT.md](./CODEBASE_ASSESSMENT.md)
- **Installation Guide**: See [INSTALLATION.md](./INSTALLATION.md)
- **Main README**: See [README.md](./README.md)

---

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f [service]`
2. Verify services: `docker-compose ps`
3. Check environment: `docker-compose config`
4. Inspect container: `docker-compose exec [service] sh`

