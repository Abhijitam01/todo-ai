# Trudoo AI - AI-Powered Goal Achievement System

Transform ambitious goals into actionable daily tasks with AI mentorship. Built for scale with production-grade architecture.

## 🎯 What is Trudoo AI?

Trudoo AI is an intelligent task management system where users:

1. **Enter a long-term goal** (e.g., "Learn Python in 90 days", "Run a marathon in 6 months")
2. **AI generates a structured plan** with weekly milestones and activities
3. **System automatically creates daily tasks** tailored to your progress
4. **AI mentor provides weekly feedback** and adapts to your behavior
5. **Track progress** with streaks, calendar view, and completion metrics

**Key Principle**: AI is deterministic, schema-validated, and purpose-built - not a chatbot.

---

## ✨ Features

### Core Features
- ✅ **AI Plan Generation** - Structured, actionable plans from goal descriptions
- ✅ **Automated Daily Tasks** - AI generates daily tasks based on current milestone
- ✅ **Weekly AI Mentorship** - Personalized feedback on your progress patterns
- ✅ **Task Evaluation** - AI quality feedback on completed tasks
- ✅ **Streak Tracking** - Build consistency with daily completion streaks
- ✅ **Calendar View** - Beautiful visualization of tasks and goals over time
- ✅ **Real-time Updates** - WebSocket notifications for plan/task generation
- ✅ **Token Budget System** - Fair AI usage limits per user

### Technical Features
- 🏗️ **Monorepo Architecture** - Clean separation with shared packages
- 🔒 **Secure Authentication** - JWT with refresh tokens, Argon2 hashing
- 📊 **Production Database** - PostgreSQL with proper indexing and soft deletes
- 🚀 **Background Jobs** - BullMQ for async AI processing
- 🐳 **Full Docker Support** - One-command deployment
- 📝 **Type Safety** - Full TypeScript with Zod validation
- ⚡ **Modern Stack** - Next.js 14, NestJS, Prisma, Redis

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Option 1: Development Mode (Recommended)

Perfect for local development with hot-reload:

```bash
# 1. Clone and install
git clone <your-repo-url>
cd todoai
pnpm install

# 2. Setup environment
cp env.example .env
# Edit .env and add your GEMINI_API_KEY

# 3. Start databases only
docker-compose up -d postgres redis

# 4. Setup database
pnpm db:generate
pnpm db:push

# 5. Start all services
pnpm dev
```

**Access**: 
- Web: http://localhost:3000
- API: http://localhost:3001
- Prisma Studio: `pnpm db:studio`

### Option 2: Full Docker (Production-like)

Run everything in containers:

```bash
# 1. Setup environment
cp env.example .env
# Edit .env with your API keys

# 2. Start everything
docker-compose --profile full up -d

# That's it! 🎉
```

**Access**:
- Web: http://localhost:3000
- API: http://localhost:3001

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                 │
│  • App Router  • Zustand  • TanStack Query  • shadcn/ui  │
└────────────┬────────────────────────────────────────────┘
             │ REST API + WebSocket
             ▼
┌─────────────────────────────────────────────────────────┐
│                     Backend (NestJS)                      │
│  Auth • Goals • Plans • Tasks • AI Orchestrator • WS     │
└────────┬──────────────┬──────────────┬──────────────────┘
         │              │              │
         ▼              ▼              ▼
┌───────────────┐  ┌───────────┐  ┌──────────────┐
│  PostgreSQL   │  │   Redis   │  │ Worker (Bull) │
│  (Prisma ORM) │  │  (Queues) │  │  AI Jobs      │
└───────────────┘  └───────────┘  └───────┬───────┘
                                           │
                                           ▼
                                   ┌──────────────────┐
                                   │   AI Package     │
                                   │ Gemini • OpenAI  │
                                   └──────────────────┘
```

### Project Structure

```
todoai/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── api/                 # NestJS backend
│   └── worker/              # BullMQ background jobs
├── packages/
│   ├── ui/                  # Shared shadcn components
│   ├── db/                  # Prisma schema & client
│   ├── ai/                  # AI services (Planner, Mentor, Evaluator)
│   ├── types/               # Shared Zod schemas & types
│   ├── shared/              # Common utilities
│   └── config/              # Shared configs (tsconfig, eslint)
├── docker-compose.yml       # Docker orchestration
└── scripts/                 # Deployment scripts
```

---

## 🔄 User Flow

```
1. Sign Up / Login
   ↓
2. Create Goal ("Learn Python", 90 days)
   ↓
3. AI Generates Plan (WebSocket notification)
   - Weekly milestones
   - Key activities per milestone
   ↓
4. Daily Task Generation (Automated at 6 AM)
   - 3-5 tasks based on current milestone
   - Adjusted for your completion rate
   ↓
5. Complete Tasks Throughout Day
   - Mark as complete/skip
   - AI evaluates quality
   - Streak updates
   ↓
6. Weekly Mentor Feedback (Every Monday)
   - Progress analysis
   - Personalized recommendations
   - Motivation and course correction
```

---

## 🛣️ API Routes

### Authentication
```
POST   /api/v1/auth/register    # Create account
POST   /api/v1/auth/login       # Sign in
POST   /api/v1/auth/refresh     # Refresh tokens
POST   /api/v1/auth/logout      # Sign out
```

### Goals & Plans
```
POST   /api/v1/goals            # Create goal → triggers AI plan generation
GET    /api/v1/goals            # List user's goals
GET    /api/v1/goals/:id        # Get goal details
PATCH  /api/v1/goals/:id        # Update goal
DELETE /api/v1/goals/:id        # Delete goal
GET    /api/v1/goals/:id/plan   # Get AI-generated plan
```

### Tasks
```
GET    /api/v1/tasks/today      # Get today's tasks
GET    /api/v1/tasks/calendar   # Get tasks for date range (calendar view)
POST   /api/v1/tasks/:id/start  # Start task
PATCH  /api/v1/tasks/:id/complete  # Complete task → triggers AI evaluation
POST   /api/v1/tasks/:id/skip   # Skip task
```

### WebSocket Events
```
ws://localhost:3001

Events:
- plan_generated      # Plan ready for goal
- tasks_generated     # Daily tasks created
- mentor_feedback     # Weekly feedback available
- streak_update       # Streak changed
- error               # Error occurred
```

---

## 🧠 AI System

### Three AI Roles

| Role | Purpose | When | Output |
|------|---------|------|--------|
| **Planner** | Convert goal → structured plan | On goal creation | Milestones, activities, timeline |
| **Task Generator** | Create daily tasks | Daily at 6 AM | 3-5 specific, actionable tasks |
| **Mentor** | Provide feedback & guidance | Weekly (Mondays) | Progress analysis, recommendations |
| **Evaluator** | Validate task quality | On task completion | Quality score, improvement tips |

### Design Principles

1. **Deterministic**: All AI outputs are JSON, validated with Zod
2. **Versioned**: Prompts are versioned (`planner.v1`) for reproducibility
3. **Budget-controlled**: Per-user daily token limits (50K tokens/day)
4. **Non-conversational**: AI is a system component, not a chatbot

### Providers

- **Primary**: Google Gemini (high quality, cost-effective)
- **Fallback**: OpenAI, Claude (placeholders for future)

---

## 🐳 Docker Deployment

### Development (Databases Only)

```bash
# Start just PostgreSQL and Redis
docker-compose up -d

# Run apps on host
pnpm dev
```

**Pros**: Fast hot-reload, easy debugging  
**Cons**: Need Node.js 20+ installed

### Production (Full Stack)

```bash
# Build images
docker-compose --profile full build

# Start all services
docker-compose --profile full up -d

# View logs
docker-compose logs -f api worker web

# Stop
docker-compose --profile full down
```

**Pros**: Consistent environment, production-like  
**Cons**: Slower rebuilds

### Profiles

- **Default** (`docker-compose up`): PostgreSQL + Redis only
- **`--profile full`**: All services (postgres, redis, api, web, worker)
- **`--profile debug`**: Adds Redis Commander (http://localhost:8081)

---

## 🔐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://todoai:todoai_dev_password@localhost:5432/todoai"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# AI Provider (REQUIRED)
GEMINI_API_KEY="your-gemini-api-key"

# Optional
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-claude-key"
```

---

## 🛠️ Development Commands

```bash
# Development
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm lint             # Lint codebase
pnpm typecheck        # TypeScript check

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema (dev)
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio

# Docker
docker-compose up -d                    # Start databases
docker-compose --profile full up -d     # Start everything
docker-compose logs -f api              # View API logs
docker-compose down                     # Stop services
docker-compose down -v                  # Stop + delete data
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests (when implemented)
pnpm test:e2e
```

---

## 📊 Key Technologies

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 App Router | Modern React framework, excellent DX |
| **State** | Zustand + TanStack Query | Simple local state + powerful server state |
| **UI** | Tailwind CSS + shadcn/ui | Beautiful, accessible components |
| **Backend** | NestJS | Scalable, enterprise-grade Node.js |
| **Database** | PostgreSQL + Prisma | Reliable, type-safe ORM |
| **Queue** | BullMQ + Redis | Robust background jobs |
| **AI** | Google Gemini | High-quality, cost-effective |
| **Build** | Turborepo + pnpm | Fast monorepo builds |

---

## 📈 Roadmap

### ✅ Phase 1 (Current - MVP Complete)
- [x] Core monorepo structure
- [x] Authentication system
- [x] Goal & plan management
- [x] AI plan generation
- [x] Daily task generation (automated)
- [x] Weekly mentor feedback
- [x] Task evaluation
- [x] Calendar view
- [x] WebSocket real-time updates
- [x] Streak tracking
- [x] Full Docker support

### 🚧 Phase 2 (Next)
- [ ] Email notifications (Resend)
- [ ] Push notifications (FCM)
- [ ] Mobile-responsive improvements
- [ ] User settings & preferences
- [ ] Goal templates
- [ ] Export/import data

### 🔮 Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Team/shared goals
- [ ] Social accountability features
- [ ] Advanced analytics
- [ ] Voice interaction
- [ ] Calendar integrations (Google, Outlook)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Turborepo](https://turbo.build/)
- [Google Gemini](https://ai.google.dev/)

---

## 📧 Support

For questions or issues:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include logs and environment details

**Built for achievers. Let's make goals happen! 🎯**
