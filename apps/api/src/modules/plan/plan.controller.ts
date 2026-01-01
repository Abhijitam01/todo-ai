import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import type { MilestoneStatus } from '@todoai/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { PlanService } from './plan.service';

@Controller('goals/:goalId/plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async findByGoalId(
    @CurrentUser('sub') userId: string,
    @Param('goalId') goalId: string
  ) {
    return this.planService.findByGoalId(userId, goalId);
  }

  @Patch('milestones/:milestoneId')
  async updateMilestone(
    @CurrentUser('sub') userId: string,
    @Param('milestoneId') milestoneId: string,
    @Body('status') status: MilestoneStatus
  ) {
    return this.planService.updateMilestoneStatus(userId, milestoneId, status);
  }
}

