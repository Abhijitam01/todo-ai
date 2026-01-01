import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AIOrchestratorModule } from './modules/ai-orchestrator/ai-orchestrator.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoalModule } from './modules/goal/goal.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlanModule } from './modules/plan/plan.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { DatabaseModule } from './providers/database.module';
import { RedisModule } from './providers/redis.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Providers
    DatabaseModule,
    RedisModule,

    // Feature modules
    AuthModule,
    UserModule,
    GoalModule,
    PlanModule,
    TaskModule,
    AIOrchestratorModule,
    NotificationModule,
    WebSocketModule,
    HealthModule,
  ],
})
export class AppModule {}

