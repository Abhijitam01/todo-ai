import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@todoai/db';
import type { CreateGoalInput, Goal, GoalWithPlan, UpdateGoalInput } from '@todoai/types';

import { AIOrchestratorService } from '../ai-orchestrator/ai-orchestrator.service';

@Injectable()
export class GoalService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly aiOrchestrator: AIOrchestratorService
  ) {}

  async create(userId: string, input: CreateGoalInput): Promise<Goal> {
    const goal = await this.prisma.goal.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        category: input.category,
        targetDate: input.targetDate,
        durationDays: input.durationDays,
        status: 'planning',
      },
    });

    // Queue AI plan generation
    await this.aiOrchestrator.queuePlanGeneration(userId, goal.id);

    return this.toGoal(goal);
  }

  async findAll(
    userId: string,
    options: { status?: string; page: number; limit: number }
  ) {
    const where = {
      userId,
      deletedAt: null,
      ...(options.status && { status: options.status }),
    };

    const [goals, total] = await Promise.all([
      this.prisma.goal.findMany({
        where,
        include: {
          plans: {
            orderBy: { version: 'desc' },
            take: 1,
            select: {
              id: true,
              version: true,
              milestones: { select: { id: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      this.prisma.goal.count({ where }),
    ]);

    return {
      data: goals.map((g: typeof goals[0]) => this.toGoalWithPlan(g)),
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
        hasNext: options.page * options.limit < total,
        hasPrev: options.page > 1,
      },
    };
  }

  async findById(userId: string, goalId: string): Promise<GoalWithPlan> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId, deletedAt: null },
      include: {
        plans: {
          orderBy: { version: 'desc' },
          take: 1,
          select: {
            id: true,
            version: true,
            milestones: { select: { id: true } },
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return this.toGoalWithPlan(goal);
  }

  async update(
    userId: string,
    goalId: string,
    input: UpdateGoalInput
  ): Promise<Goal> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId, deletedAt: null },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const updated = await this.prisma.goal.update({
      where: { id: goalId },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.category && { category: input.category }),
        ...(input.targetDate && { targetDate: input.targetDate }),
        ...(input.status && { status: input.status }),
      },
    });

    return this.toGoal(updated);
  }

  async delete(userId: string, goalId: string): Promise<void> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId, deletedAt: null },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    // Soft delete
    await this.prisma.goal.update({
      where: { id: goalId },
      data: { deletedAt: new Date() },
    });
  }

  private toGoal(goal: {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    category: string;
    status: string;
    targetDate: Date | null;
    durationDays: number | null;
    progressPercentage: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): Goal {
    return {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      category: goal.category as Goal['category'],
      status: goal.status as Goal['status'],
      targetDate: goal.targetDate,
      durationDays: goal.durationDays,
      progressPercentage: goal.progressPercentage,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      deletedAt: goal.deletedAt,
    };
  }

  private toGoalWithPlan(goal: {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    category: string;
    status: string;
    targetDate: Date | null;
    durationDays: number | null;
    progressPercentage: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    plans: Array<{
      id: string;
      version: number;
      milestones: Array<{ id: string }>;
    }>;
  }): GoalWithPlan {
    const latestPlan = goal.plans[0];

    return {
      ...this.toGoal(goal),
      plan: latestPlan
        ? {
            id: latestPlan.id,
            version: latestPlan.version,
            milestoneCount: latestPlan.milestones.length,
          }
        : null,
    };
  }
}

