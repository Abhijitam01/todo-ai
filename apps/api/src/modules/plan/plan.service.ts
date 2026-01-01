import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@todoai/db';
import type { PlanWithMilestones, MilestoneStatus } from '@todoai/types';

@Injectable()
export class PlanService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async findByGoalId(userId: string, goalId: string): Promise<PlanWithMilestones | null> {
    // Verify user owns the goal
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId, deletedAt: null },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const plan = await this.prisma.plan.findFirst({
      where: { goalId },
      orderBy: { version: 'desc' },
      include: {
        milestones: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!plan) {
      return null;
    }

    return this.toPlanWithMilestones(plan);
  }

  async updateMilestoneStatus(
    userId: string,
    milestoneId: string,
    status: MilestoneStatus
  ) {
    // Verify user owns the milestone through goal
    const milestone = await this.prisma.planMilestone.findFirst({
      where: {
        id: milestoneId,
        plan: {
          goal: { userId, deletedAt: null },
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    const updated = await this.prisma.planMilestone.update({
      where: { id: milestoneId },
      data: {
        status,
        ...(status === 'completed' && { completedAt: new Date() }),
      },
    });

    return updated;
  }

  private toPlanWithMilestones(plan: {
    id: string;
    goalId: string;
    version: number;
    summary: string;
    approach: string;
    estimatedDurationDays: number;
    difficultyLevel: string;
    weeklyHoursMin: number;
    weeklyHoursMax: number;
    promptVersion: string;
    aiProvider: string;
    createdAt: Date;
    updatedAt: Date;
    milestones: Array<{
      id: string;
      planId: string;
      title: string;
      description: string | null;
      order: number;
      targetWeek: number;
      status: string;
      keyActivities: string[];
      completedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }): PlanWithMilestones {
    return {
      id: plan.id,
      goalId: plan.goalId,
      version: plan.version,
      summary: plan.summary,
      approach: plan.approach,
      estimatedDurationDays: plan.estimatedDurationDays,
      difficultyLevel: plan.difficultyLevel as PlanWithMilestones['difficultyLevel'],
      promptVersion: plan.promptVersion,
      aiProvider: plan.aiProvider,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      milestones: plan.milestones.map((m) => ({
        id: m.id,
        planId: m.planId,
        title: m.title,
        description: m.description,
        order: m.order,
        targetWeek: m.targetWeek,
        status: m.status as MilestoneStatus,
        completedAt: m.completedAt,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
    };
  }
}

