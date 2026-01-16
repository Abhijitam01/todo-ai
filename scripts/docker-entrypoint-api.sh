#!/bin/sh
set -e

echo "🚀 Starting TodoAI API..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "✅ PostgreSQL is up!"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis..."
until nc -z redis 6379; do
  echo "Redis is unavailable - sleeping"
  sleep 2
done
echo "✅ Redis is up!"

# Run Prisma migrations
echo "📦 Running database migrations..."
cd /app/packages/db
pnpm prisma generate
pnpm prisma db push --skip-generate

# Start the API
echo "🎉 Starting API server..."
cd /app/apps/api
exec node dist/main.js

