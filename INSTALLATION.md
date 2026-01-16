# 📦 Complete Installation Guide

## Current Status Check

Let me check what you have installed:

```bash
# Check Node.js version
node --version
# ✅ You have: v18.19.1
# ⚠️  Required: >=20.0.0 (needs upgrade)

# Check pnpm
pnpm --version
# ✅ You have: 9.15.0 (good!)

# Check Docker
docker --version
# ❌ Not installed (needs installation)

# Check Git
git --version
# ✅ Installed
```

---

## Step-by-Step Installation

### 1. Upgrade Node.js to v20+ (Required)

Your current Node.js version (18.19.1) is below the required version (>=20.0.0).

**Option A: Using NVM (Recommended)**
```bash
# Install NVM if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
```

**Option B: Using NodeSource Repository**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js 20
sudo apt-get install -y nodejs

# Verify
node --version  # Should show v20.x.x
npm --version
```

**Option C: Download from Node.js Website**
- Visit: https://nodejs.org/
- Download Node.js 20.x LTS
- Install the .deb package

---

### 2. Install Docker & Docker Compose (Required for Redis & PostgreSQL)

Docker will run both Redis and PostgreSQL in containers - you don't need to install them separately!

```bash
# Update package list
sudo apt update

# Install Docker
sudo apt install -y docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version

# Test Docker (you may need to log out and back in first)
docker run hello-world
```

**Important:** After adding yourself to the docker group, you need to:
```bash
# Log out and log back in, OR run:
newgrp docker

# Then test again
docker run hello-world
```

---

### 3. Verify All Prerequisites

Run this checklist:

```bash
# ✅ Node.js >= 20.0.0
node --version

# ✅ pnpm installed
pnpm --version

# ✅ Docker installed
docker --version

# ✅ Docker Compose installed
docker-compose --version

# ✅ Git installed
git --version
```

---

### 4. Start Redis & PostgreSQL with Docker

Once Docker is installed, starting Redis and PostgreSQL is simple:

```bash
# Navigate to project directory
cd /home/abhijitam/Desktop/todoai

# Start PostgreSQL and Redis
docker-compose up -d

# Check they're running
docker ps
```

You should see:
- `todoai-postgres` (PostgreSQL on port 5432)
- `todoai-redis` (Redis on port 6379)

**Verify services are healthy:**
```bash
# Check PostgreSQL
docker logs todoai-postgres | tail -5

# Check Redis
docker logs todoai-redis | tail -5

# Test Redis connection
docker exec -it todoai-redis redis-cli ping
# Should return: PONG

# Test PostgreSQL connection
docker exec -it todoai-postgres psql -U todoai -d todoai -c "SELECT version();"
```

---

### 5. Setup Database Schema

```bash
# Generate Prisma client
pnpm db:generate

# Push database schema to PostgreSQL
pnpm db:push

# (Optional) Open Prisma Studio to view database
pnpm db:studio
# Opens at http://localhost:5555
```

---

### 6. Configure Environment Variables

The `.env` file is already created. You need to:

1. **Get a Gemini API Key** (Required for AI features):
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Add it to `.env`:
     ```env
     GEMINI_API_KEY="your-actual-api-key-here"
     ```

2. **JWT Secrets** (Already generated, but verify they're in `.env`):
   ```env
   JWT_SECRET="SZZlaMSH7ULp9GL3+JsW45uXHqVqu+OhGqJyMHS8BDQ="
   JWT_REFRESH_SECRET="w2sH0j1tvsj1twrt4XDaE5fhILiIIrhZY4qoJ1OIc9I="
   ```

---

### 7. Install Project Dependencies

```bash
# Install all dependencies
pnpm install
```

---

### 8. Start the Application

```bash
# Start all services (API, Web, Worker)
pnpm dev
```

This will start:
- 🌐 **Web App**: http://localhost:3000
- 🔌 **API**: http://localhost:3001
- ⚙️ **Worker**: Background job processor

---

## Quick Verification Checklist

After installation, verify everything works:

```bash
# 1. Check Node.js version
node --version  # Should be v20.x.x or higher

# 2. Check Docker containers are running
docker ps
# Should show todoai-postgres and todoai-redis

# 3. Test Redis connection
docker exec -it todoai-redis redis-cli ping
# Should return: PONG

# 4. Test PostgreSQL connection
docker exec -it todoai-postgres psql -U todoai -d todoai -c "SELECT 1;"
# Should return: 1

# 5. Check API health
curl http://localhost:3001/api/v1/health
# Should return JSON with status

# 6. Check Web app
# Open browser: http://localhost:3000
```

---

## Troubleshooting

### Docker Permission Denied
```bash
# If you get "permission denied" errors:
sudo usermod -aG docker $USER
newgrp docker
# Or log out and log back in
```

### Port Already in Use
```bash
# Check what's using the ports
sudo lsof -i :3000  # Web app
sudo lsof -i :3001  # API
sudo lsof -i :5432  # PostgreSQL
sudo lsof -i :6379  # Redis

# Stop conflicting services or change ports in docker-compose.yml
```

### Docker Containers Won't Start
```bash
# Check Docker logs
docker logs todoai-postgres
docker logs todoai-redis

# Restart containers
docker-compose down
docker-compose up -d

# Check Docker service
sudo systemctl status docker
```

### Node.js Version Issues
```bash
# If you have multiple Node versions
nvm list
nvm use 20

# Or reinstall Node.js 20
```

### Database Connection Errors
```bash
# Make sure PostgreSQL is running
docker ps | grep postgres

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
pnpm db:push
```

---

## What Gets Installed Where

| Service | Location | Port | How to Access |
|---------|----------|------|---------------|
| **PostgreSQL** | Docker Container | 5432 | `localhost:5432` |
| **Redis** | Docker Container | 6379 | `localhost:6379` |
| **Web App** | Your Machine | 3000 | http://localhost:3000 |
| **API** | Your Machine | 3001 | http://localhost:3001 |
| **Prisma Studio** | Your Machine | 5555 | http://localhost:5555 |

---

## Next Steps After Installation

1. ✅ All prerequisites installed
2. ✅ Docker containers running
3. ✅ Database schema created
4. ✅ Environment variables configured
5. ✅ Dependencies installed
6. 🚀 **Start the app**: `pnpm dev`
7. 📝 **Create account**: http://localhost:3000/signup
8. 🎯 **Create your first goal!**

---

## Need Help?

- Check logs: `docker logs todoai-postgres` or `docker logs todoai-redis`
- Check application logs in the terminal where you ran `pnpm dev`
- See main [README.md](./README.md) for more details

