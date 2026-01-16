# 🚀 Local Development Setup

Quick guide for setting up Trudoo AI for local development.

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose
- Gemini API Key

## Installation Steps

### 1. Install Docker

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo usermod -aG docker $USER  # Log out and back in after this
```

### 2. Clone & Install

```bash
git clone <your-repo>
cd todoai
pnpm install
```

### 3. Setup Environment

```bash
cp env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY="your-actual-api-key-here"
```

Get one at: https://makersuite.google.com/app/apikey

### 4. Start Databases

```bash
docker-compose up -d
```

### 5. Setup Database

```bash
pnpm db:generate
pnpm db:push
```

### 6. Start Development

```bash
pnpm dev
```

Access:
- Web: http://localhost:3000
- API: http://localhost:3001
- Prisma Studio: `pnpm db:studio`

## Troubleshooting

### Port Conflicts
```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :3001
```

### Docker Issues
```bash
# Check container status
docker ps

# View logs
docker logs todoai-postgres
docker logs todoai-redis
```

### Database Issues
```bash
# Reset database (WARNING: deletes data)
docker-compose down -v
docker-compose up -d
pnpm db:push
```

## Next Steps

1. Create an account at http://localhost:3000/signup
2. Create your first goal
3. Watch the AI generate a plan!

See [README.md](./README.md) for complete documentation.

