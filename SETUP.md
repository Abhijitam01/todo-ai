# 🚀 Quick Setup Guide

## Step 1: Install Docker (Required)

You need Docker to run PostgreSQL and Redis. Install it:

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
# Then log out and log back in
```

**Verify installation:**
```bash
docker --version
docker-compose --version
```

## Step 2: Environment File

✅ **Already created!** The `.env` file has been created from `env.example`.

**Update these values in `.env`:**

1. **JWT Secrets** (already generated for you):
   - `JWT_SECRET="SZZlaMSH7ULp9GL3+JsW45uXHqVqu+OhGqJyMHS8BDQ="`
   - `JWT_REFRESH_SECRET="w2sH0j1tvsj1twrt4XDaE5fhILiIIrhZY4qoJ1OIc9I="`

2. **AI API Key** (REQUIRED):
   - Get a Gemini API key from: https://makersuite.google.com/app/apikey
   - Add it to `.env`: `GEMINI_API_KEY="your-api-key-here"`

## Step 3: Start Database Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify they're running
docker ps
```

You should see:
- `todoai-postgres` (PostgreSQL on port 5432)
- `todoai-redis` (Redis on port 6379)

## Step 4: Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# (Optional) Open Prisma Studio to view database
pnpm db:studio
```

## Step 5: Start the Application

```bash
# Start all services (API, Web, Worker)
pnpm dev
```

This will start:
- 🌐 **Web**: http://localhost:3000
- 🔌 **API**: http://localhost:3001
- ⚙️ **Worker**: Background job processor

## ✅ Verification

1. **Check Redis connection**: The worker should connect without errors
2. **Check API**: Visit http://localhost:3001/api/v1/health
3. **Check Web**: Visit http://localhost:3000

## 🔧 Troubleshooting

### Redis Connection Errors
If you see Redis errors:
```bash
# Make sure Redis is running
docker ps | grep redis

# If not running, start it
docker-compose up -d redis

# Check Redis logs
docker logs todoai-redis
```

### Database Connection Errors
```bash
# Make sure PostgreSQL is running
docker ps | grep postgres

# If not running, start it
docker-compose up -d postgres

# Check PostgreSQL logs
docker logs todoai-postgres
```

### Port Already in Use
If ports 3000, 3001, 5432, or 6379 are already in use:
- Change ports in `docker-compose.yml` or `.env`
- Or stop the conflicting services

## 📝 Next Steps

1. **Get a Gemini API Key**: Required for AI features
2. **Create your first account**: Sign up at http://localhost:3000/signup
3. **Create a goal**: The AI will generate a plan for you!

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Check logs: `docker logs todoai-postgres` or `docker logs todoai-redis`
- Worker logs will show in the terminal where you ran `pnpm dev`

