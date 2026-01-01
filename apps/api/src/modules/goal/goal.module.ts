import { Module } from '@nestjs/common';

import { AIOrchestratorModule } from '../ai-orchestrator/ai-orchestrator.module';

import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
  imports: [AIOrchestratorModule],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class GoalModule {}

