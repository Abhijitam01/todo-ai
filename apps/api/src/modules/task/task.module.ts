import { Module } from '@nestjs/common';

import { AIOrchestratorModule } from '../ai-orchestrator/ai-orchestrator.module';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [AIOrchestratorModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}

