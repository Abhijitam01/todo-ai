# TodoAI

**AI-Powered Goal Achievement System**

TodoAI transforms ambitious goals into actionable daily tasks using AI mentorship. Built for scale (100k+ users) with production-grade architecture.

## 🎯 What is TodoAI?

TodoAI is an AI mentor-driven task system where users:

1. **Enter a long-term goal** (e.g., "Learn Python in 90 days", "Lose 10kg in 3 months")
2. **AI generates a structured plan** with milestones and weekly breakdowns
3. **System converts plans into daily executable tasks**
4. **AI acts as a mentor** - explains why tasks exist, adapts based on behavior, tracks consistency

**Key Principle**: AI is controlled, deterministic, and schema-validated. No "chatty" responses.

---

## 📐 Architecture

### Monorepo Structure

```
todoai/
├── apps/
│   ├── web/           # Next.js 14 frontend
│   ├── api/           # NestJS backend
│   └── worker/        # BullMQ background jobs
├── packages/
│   ├── ui/            # Shared shadcn components
│   ├── db/            # Prisma client & schema
│   ├── ai/            # AI providers & services
│   ├── config/        # Shared tsconfig, eslint, tailwind
│   └── types/         # Shared Zod schemas & types
├── turbo.json         # Turborepo config
└── docker-compose.yml # Local PostgreSQL & Redis
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **State** | Zustand (local), TanStack Query (server) |
| **Backend** | NestJS, REST API, WebSocket Gateway |
| **Database** | PostgreSQL, Prisma ORM |
| **Queue** | BullMQ, Redis |
| **AI** | Google Gemini (primary), OpenAI/Claude (placeholders) |
| **Auth** | Custom JWT with refresh tokens |
| **Build** | Turborepo, pnpm |

### System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (Next.js)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │  Login  │  │Dashboard│  │  Today  │  │Goal View│  │New Goal │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
└───────┼────────────┼────────────┼────────────┼────────────┼─────────┘
        │            │            │            │            │
        └────────────┴────────────┴─────┬──────┴────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway (NestJS)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   Auth   │ │   User   │ │   Goal   │ │   Task   │ │WebSocket │  │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │ │ Gateway  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└───────┼────────────┼────────────┼────────────┼────────────┼─────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            │
┌────────────────────────────────────────────────────┐      │
│                   PostgreSQL                        │      │
│  Users, Goals, Plans, Tasks, AI Interactions       │      │
└────────────────────────────────────────────────────┘      │
                                                            │
┌──────────────────────────────────────────────────────────┐│
│                      Redis                               ││
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      ││
│  │ Auth Tokens │  │  Job Queue  │  │  WS State   │      ││
│  └─────────────┘  └──────┬──────┘  └─────────────┘      ││
└──────────────────────────┼───────────────────────────────┘│
                           │                                │
                           ▼                                │
┌─────────────────────────────────────────────────────────┐ │
│                  Worker (BullMQ)                         │ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │ Plan Gen Job │  │  Mentor Job  │  │Evaluator Job │  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │ │
└─────────┼─────────────────┼─────────────────┼───────────┘ │
          │                 │                 │             │
          ▼                 ▼                 ▼             │
┌─────────────────────────────────────────────────────────┐ │
│                    AI Package                            │ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │   Planner    │  │    Mentor    │  │  Evaluator   │  │ │
│  │   Service    │  │   Service    │  │   Service    │  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │ │
└─────────┼─────────────────┼─────────────────┼───────────┘ │
          │                 │                 │             │
          └─────────────────┼─────────────────┘             │
                            ▼                               │
                   ┌─────────────────┐    WebSocket Push    │
                   │  Gemini API     │◄─────────────────────┘
                   └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose
- Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/todoai.git
cd todoai

# Install dependencies
pnpm install

# Copy environment file
cp env.example .env
# Edit .env with your API keys

# Start databases
docker-compose up -d

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Start all services in development
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://todoai:todoai_dev_password@localhost:5432/todoai"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# AI Provider (required)
GEMINI_API_KEY="your-gemini-api-key"
```

### Available Scripts

```bash
pnpm dev          # Start all services in dev mode
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm db:studio    # Open Prisma Studio
pnpm db:migrate   # Run database migrations
```

---

## 🧠 AI System

### AI Roles

| Role | Purpose | Trigger |
|------|---------|---------|
| **PlannerAI** | Converts goal → structured plan | On goal creation |
| **MentorAI** | Daily guidance & encouragement | Daily or on-demand |
| **EvaluatorAI** | Validates task completion quality | On task completion |

### Design Principles

1. **Deterministic**: All AI outputs are JSON, validated with Zod
2. **Versioned**: Prompts are versioned for reproducibility
3. **Budget-controlled**: Per-user daily token limits
4. **Non-conversational**: AI is a system, not a chatbot

### Prompt Versioning

Prompts are stored in `packages/ai/src/prompts/`:
- `planner.v1.ts` - Plan generation
- `mentor.v1.ts` - Feedback generation
- `evaluator.v1.ts` - Task evaluation

All AI outputs are logged with `promptVersion` for debugging and improvement.

---

## 🔐 Security

### Authentication Flow

1. User registers/logs in → receives JWT access token + refresh token
2. Access token: 15 minute expiry, stored in memory
3. Refresh token: 7 day expiry, stored in httpOnly cookie & Redis
4. Token refresh happens automatically via interceptor

### Security Measures

- Argon2 password hashing
- Rate limiting (per-user, per-endpoint)
- AI token budget per user per day
- Input validation at all boundaries (Zod)
- CORS configuration
- Helmet security headers

---

## 📊 Database Schema

### Core Models

| Model | Purpose |
|-------|---------|
| `User` | Authentication, preferences, token budget |
| `Goal` | Long-term objectives |
| `Plan` | AI-generated structured plans |
| `PlanMilestone` | Weekly milestones within plans |
| `Task` | Recurring task templates |
| `TaskInstance` | Daily executable task instances |
| `AIInteraction` | AI operation logs |
| `AIOutput` | Validated AI outputs |
| `Notification` | User notifications |
| `UserStreak` | Daily completion tracking |
| `AuditLog` | System audit trail |

---

## 🛣️ API Routes

### Authentication
```
POST   /api/v1/auth/register    # Create account
POST   /api/v1/auth/login       # Sign in
POST   /api/v1/auth/refresh     # Refresh tokens
POST   /api/v1/auth/logout      # Sign out
```

### Users
```
GET    /api/v1/users/me         # Get current user
PATCH  /api/v1/users/me         # Update profile
GET    /api/v1/users/me/stats   # Get user stats
```

### Goals
```
POST   /api/v1/goals            # Create goal (triggers AI plan generation)
GET    /api/v1/goals            # List goals
GET    /api/v1/goals/:id        # Get goal details
PATCH  /api/v1/goals/:id        # Update goal
DELETE /api/v1/goals/:id        # Delete goal
GET    /api/v1/goals/:id/plan   # Get goal's plan
```

### Tasks
```
GET    /api/v1/tasks/today      # Get today's tasks
POST   /api/v1/tasks/:id/start  # Start task
PATCH  /api/v1/tasks/:id/complete # Complete task
POST   /api/v1/tasks/:id/skip   # Skip task
```

### WebSocket Events
```
plan_generated    # Plan generation complete
tasks_generated   # Daily tasks generated
mentor_feedback   # Mentor feedback available
streak_update     # Streak changed
error             # Error occurred
```

---

## 🔮 Future Roadmap

### Phase 1 (Current)
- [x] Core monorepo structure
- [x] Authentication system
- [x] Goal & plan management
- [x] Task tracking
- [x] AI plan generation
- [x] WebSocket real-time updates

### Phase 2
- [ ] Email/push notifications (Resend, FCM)
- [ ] Daily task generation job
- [ ] Mentor feedback scheduling
- [ ] Mobile-responsive improvements

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Team/shared goals
- [ ] Social accountability features
- [ ] Advanced analytics dashboard

### Phase 4
- [ ] Multi-language support
- [ ] Voice interaction
- [ ] Calendar integrations
- [ ] API for third-party integrations

---

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run e2e tests (when implemented)
pnpm test:e2e
```

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Turborepo](https://turbo.build/repo) - Monorepo build system
- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Prisma](https://prisma.io/) - Database ORM
- [BullMQ](https://bullmq.io/) - Job queue

