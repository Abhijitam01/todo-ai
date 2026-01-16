#!/bin/bash
echo "🔍 Checking TodoAI Prerequisites..."
echo ""

echo "📦 Node.js:"
node --version 2>/dev/null || echo "❌ Not installed"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 20 ]; then
        echo "✅ Node.js $(node --version) (Required: >=20.0.0)"
    else
        echo "⚠️  Node.js $(node --version) (Required: >=20.0.0) - NEEDS UPGRADE"
    fi
fi
echo ""

echo "📦 pnpm:"
pnpm --version 2>/dev/null && echo "✅ pnpm $(pnpm --version)" || echo "❌ Not installed"
echo ""

echo "🐳 Docker:"
docker --version 2>/dev/null && echo "✅ $(docker --version)" || echo "❌ Not installed"
echo ""

echo "🐳 Docker Compose:"
docker-compose --version 2>/dev/null && echo "✅ $(docker-compose --version)" || echo "❌ Not installed"
echo ""

echo "📝 Git:"
git --version 2>/dev/null && echo "✅ $(git --version)" || echo "❌ Not installed"
echo ""

echo "🗄️  Docker Containers:"
if command -v docker &> /dev/null; then
    if docker ps --format "{{.Names}}" | grep -q "todoai-postgres"; then
        echo "✅ PostgreSQL container running"
    else
        echo "❌ PostgreSQL container not running (run: docker-compose up -d)"
    fi
    
    if docker ps --format "{{.Names}}" | grep -q "todoai-redis"; then
        echo "✅ Redis container running"
    else
        echo "❌ Redis container not running (run: docker-compose up -d)"
    fi
else
    echo "⚠️  Docker not installed, cannot check containers"
fi
echo ""

echo "📄 Environment File:"
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "GEMINI_API_KEY=" .env && ! grep -q "GEMINI_API_KEY=\"your-gemini-api-key\"" .env; then
        echo "✅ GEMINI_API_KEY is configured"
    else
        echo "⚠️  GEMINI_API_KEY needs to be set in .env"
    fi
else
    echo "❌ .env file not found (run: cp env.example .env)"
fi
echo ""

echo "✅ Check complete!"
