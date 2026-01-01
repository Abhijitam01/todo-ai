import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@todoai/db';
import type { Queue } from 'bullmq';

// Job type definitions
export interface GeneratePlanJobData {
  userId: string;
  goalId: string;
}

export interface GenerateDailyTasksJobData {
  userId: string;
  goalId: string;
  date: string; // ISO date string
}

export interface MentorFeedbackJobData {
  userId: string;
  goalId: string;
}

export interface EvaluateTaskJobData {
  userId: string;
  taskInstanceId: string;
}

@Injectable()
export class AIOrchestratorService {
  constructor(
    @Inject('AI_JOBS_QUEUE') private readonly aiJobsQueue: Queue,
    @Inject('PRISMA') private readonly prisma: PrismaClient
  ) {}

  /**
   * Queue a plan generation job for a goal.
   */
  async queuePlanGeneration(userId: string, goalId: string): Promise<string> {
    const job = await this.aiJobsQueue.add(
      'generatePlan',
      { userId, goalId } satisfies GeneratePlanJobData,
      {
        priority: 1, // High priority
        jobId: `plan-${goalId}`,
      }
    );

    return job.id ?? '';
  }

  /**
   * Queue daily task generation for a goal.
   */
  async queueDailyTasksGeneration(
    userId: string,
    goalId: string,
    date: Date
  ): Promise<string> {
    const dateStr = date.toISOString().split('T')[0];
    
    const job = await this.aiJobsQueue.add(
      'generateDailyTasks',
      { userId, goalId, date: dateStr ?? '' } satisfies GenerateDailyTasksJobData,
      {
        priority: 2,
        jobId: `tasks-${goalId}-${dateStr}`,
      }
    );

    return job.id ?? '';
  }

  /**
   * Queue mentor feedback generation.
   */
  async queueMentorFeedback(userId: string, goalId: string): Promise<string> {
    const job = await this.aiJobsQueue.add(
      'mentorFeedback',
      { userId, goalId } satisfies MentorFeedbackJobData,
      {
        priority: 3, // Lower priority
      }
    );

    return job.id ?? '';
  }

  /**
   * Queue task completion evaluation.
   */
  async queueTaskEvaluation(
    userId: string,
    taskInstanceId: string
  ): Promise<string> {
    const job = await this.aiJobsQueue.add(
      'evaluateTask',
      { userId, taskInstanceId } satisfies EvaluateTaskJobData,
      {
        priority: 4, // Lowest priority
      }
    );

    return job.id ?? '';
  }

  /**
   * Check if user has remaining AI budget for today.
   */
  async checkBudget(userId: string, estimatedTokens: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        aiTokenBudget: true,
        aiTokensUsedToday: true,
        tokenResetDate: true,
      },
    });

    if (!user) return false;

    // Check if we need to reset
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.tokenResetDate < today) {
      return estimatedTokens <= user.aiTokenBudget;
    }

    return user.aiTokensUsedToday + estimatedTokens <= user.aiTokenBudget;
  }

  /**
   * Record token usage for a user.
   */
  async recordTokenUsage(userId: string, tokensUsed: number): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        aiTokensUsedToday: {
          increment: tokensUsed,
        },
        tokenResetDate: today,
      },
    });
  }
}

