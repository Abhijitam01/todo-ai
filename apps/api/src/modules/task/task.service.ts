import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@todoai/db';
import type { CompleteTaskInstanceInput, TodayTask, TaskInstanceStatus } from '@todoai/types';

import { AIOrchestratorService } from '../ai-orchestrator/ai-orchestrator.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly aiOrchestrator: AIOrchestratorService
  ) {}

  async getTodayTasks(userId: string): Promise<TodayTask[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const instances = await this.prisma.taskInstance.findMany({
      where: {
        userId,
        scheduledDate: today,
      },
      include: {
        task: {
          include: {
            goal: { select: { title: true } },
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // pending first
        { task: { priority: 'desc' } },
      ],
    });

    return instances.map((instance: typeof instances[0]) => ({
      id: instance.id,
      taskId: instance.taskId,
      userId: instance.userId,
      scheduledDate: instance.scheduledDate,
      status: instance.status as TaskInstanceStatus,
      startedAt: instance.startedAt,
      completedAt: instance.completedAt,
      actualMinutes: instance.actualMinutes,
      notes: instance.notes,
      qualityRating: instance.qualityRating,
      aiEvaluation: instance.aiEvaluation,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
      task: {
        title: instance.task.title,
        description: instance.task.description,
        priority: instance.task.priority as TodayTask['task']['priority'],
        estimatedMinutes: instance.task.estimatedMinutes,
      },
      goalTitle: instance.task.goal.title,
    }));
  }

  async getCalendarTasks(userId: string, startDate?: string, endDate?: string) {
    // Default to current month if not specified
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(1); // First day of month
    }
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date(start);
    if (!endDate) {
      end.setMonth(end.getMonth() + 1); // Next month
      end.setDate(0); // Last day of current month
    }
    end.setHours(23, 59, 59, 999);

    const [taskInstances, goals] = await Promise.all([
      // Get task instances for date range
      this.prisma.taskInstance.findMany({
        where: {
          userId,
          scheduledDate: {
            gte: start,
            lte: end,
          },
        },
        include: {
          task: {
            include: {
              goal: {
                select: { id: true, title: true, category: true, status: true },
              },
              milestone: {
                select: { title: true, targetWeek: true },
              },
            },
          },
        },
        orderBy: { scheduledDate: 'asc' },
      }),
      // Get goals with their target dates
      this.prisma.goal.findMany({
        where: {
          userId,
          deletedAt: null,
          OR: [
            {
              targetDate: {
                gte: start,
                lte: end,
              },
            },
            {
              status: 'active',
            },
          ],
        },
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          targetDate: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      taskInstances: taskInstances.map(instance => ({
        id: instance.id,
        date: instance.scheduledDate,
        title: instance.task.title,
        status: instance.status,
        priority: instance.task.priority,
        estimatedMinutes: instance.task.estimatedMinutes,
        goal: {
          id: instance.task.goal.id,
          title: instance.task.goal.title,
          category: instance.task.goal.category,
          status: instance.task.goal.status,
        },
        milestone: instance.task.milestone
          ? {
              title: instance.task.milestone.title,
              targetWeek: instance.task.milestone.targetWeek,
            }
          : null,
      })),
      goals: goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        category: goal.category,
        status: goal.status,
        targetDate: goal.targetDate,
        startDate: goal.createdAt,
      })),
    };
  }

  async startTask(userId: string, instanceId: string) {
    await this.findUserInstance(userId, instanceId);

    return this.prisma.taskInstance.update({
      where: { id: instanceId },
      data: {
        status: 'in_progress',
        startedAt: new Date(),
      },
    });
  }

  async completeTask(
    userId: string,
    instanceId: string,
    input: CompleteTaskInstanceInput
  ) {
    await this.findUserInstance(userId, instanceId);

    const updated = await this.prisma.taskInstance.update({
      where: { id: instanceId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        actualMinutes: input.actualMinutes,
        notes: input.notes,
        qualityRating: input.qualityRating,
      },
      include: {
        task: true,
      },
    });

    // Queue AI evaluation if we have enough data
    if (input.actualMinutes) {
      await this.aiOrchestrator.queueTaskEvaluation(userId, instanceId);
    }

    // Update user streak
    await this.updateStreak(userId);

    return updated;
  }

  async skipTask(userId: string, instanceId: string) {
    await this.findUserInstance(userId, instanceId);

    return this.prisma.taskInstance.update({
      where: { id: instanceId },
      data: {
        status: 'skipped',
      },
    });
  }

  private async findUserInstance(userId: string, instanceId: string) {
    const instance = await this.prisma.taskInstance.findFirst({
      where: { id: instanceId, userId },
    });

    if (!instance) {
      throw new NotFoundException('Task instance not found');
    }

    return instance;
  }

  private async updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if all today's tasks are completed
    const todayStats = await this.prisma.taskInstance.aggregate({
      where: { userId, scheduledDate: today },
      _count: true,
    });

    const completedCount = await this.prisma.taskInstance.count({
      where: { userId, scheduledDate: today, status: 'completed' },
    });

    // If at least 80% of tasks completed, count as successful day
    if (todayStats._count > 0 && completedCount / todayStats._count >= 0.8) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { streakDays: true, longestStreak: true },
      });

      if (user) {
        const newStreak = user.streakDays + 1;
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            streakDays: newStreak,
            longestStreak: Math.max(newStreak, user.longestStreak),
          },
        });

        // Record streak history
        await this.prisma.userStreak.upsert({
          where: {
            userId_date: { userId, date: today },
          },
          update: {
            tasksCompleted: completedCount,
            tasksTotal: todayStats._count,
            streakDay: newStreak,
          },
          create: {
            userId,
            date: today,
            tasksCompleted: completedCount,
            tasksTotal: todayStats._count,
            streakDay: newStreak,
          },
        });
      }
    }
  }
}

