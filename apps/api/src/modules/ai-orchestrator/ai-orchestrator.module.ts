import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

import { AIOrchestratorService } from './ai-orchestrator.service';

@Module({
  providers: [
    AIOrchestratorService,
    {
      provide: 'AI_JOBS_QUEUE',
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL', 'redis://localhost:6379');
        return new Queue('ai-jobs', {
          connection: { url: redisUrl },
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: 100,
            removeOnFail: 1000,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [AIOrchestratorService],
})
export class AIOrchestratorModule {}

