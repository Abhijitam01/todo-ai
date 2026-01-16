import { prisma } from '@todoai/db';
import { Worker, Job, Queue } from 'bullmq';
import type { Logger } from 'pino';

import { redisConnection } from '../queues.js';

interface CleanupJobData {
  type: 'old_interactions' | 'old_notifications' | 'expired_tokens';
  daysOld?: number;
}

interface AggregateStreaksJobData {
  date?: string;
}

interface GenerateDailyTasksForAllJobData {
  date?: string;
}

interface GenerateWeeklyMentorFeedbackJobData {
  // Empty - will find all active goals
}

type MaintenanceJobData = 
  | CleanupJobData 
  | AggregateStreaksJobData 
  | GenerateDailyTasksForAllJobData
  | GenerateWeeklyMentorFeedbackJobData;

export class MaintenanceProcessor {
  private worker: Worker | null = null;
  private aiJobsQueue: Queue;

  constructor(private readonly logger: Logger) {
    this.aiJobsQueue = new Queue('ai-jobs', { connection: redisConnection });
  }

  async start() {
    // Try to connect to Redis if not already connected
    if (redisConnection.status === 'end' || redisConnection.status === 'wait') {
      try {
        await redisConnection.connect();
      } catch (error) {
        this.logger.warn(
          { err: error },
          'Redis not available, worker will retry when Redis is available'
        );
        // Retry connection after a delay (only if not already retrying)
        if (!this.worker) {
          setTimeout(() => {
            if (!this.worker) {
              this.start().catch((err) => {
                this.logger.error({ err }, 'Failed to restart worker');
              });
            }
          }, 5000);
        }
        return;
      }
    }

    // Don't create worker if one already exists
    if (this.worker) {
      return;
    }

    this.worker = new Worker<MaintenanceJobData>(
      'maintenance',
      async (job) => {
        this.logger.info({ jobId: job.id, jobName: job.name }, 'Processing maintenance job');

        try {
          switch (job.name) {
            case 'cleanupOldData':
              await this.handleCleanup(job as Job<CleanupJobData>);
              break;
            case 'aggregateStreaks':
              await this.handleAggregateStreaks(job as Job<AggregateStreaksJobData>);
              break;
            case 'resetDailyTokens':
              await this.handleResetDailyTokens();
              break;
            case 'markMissedTasks':
              await this.handleMarkMissedTasks();
              break;
            case 'generateDailyTasksForAll':
              await this.handleGenerateDailyTasksForAll(job as Job<GenerateDailyTasksForAllJobData>);
              break;
            case 'generateWeeklyMentorFeedback':
              await this.handleGenerateWeeklyMentorFeedback(job as Job<GenerateWeeklyMentorFeedbackJobData>);
              break;
            default:
              this.logger.warn({ jobName: job.name }, 'Unknown maintenance job');
          }
        } catch (error) {
          this.logger.error({ err: error, jobId: job.id }, 'Maintenance job failed');
          throw error;
        }
      },
      {
        connection: redisConnection,
        concurrency: 2,
      }
    );

    this.worker.on('completed', (job) => {
      this.logger.info({ jobId: job.id, jobName: job.name }, 'Maintenance job completed');
    });
  }

  async stop() {
    if (this.worker) {
      await this.worker.close();
    }
  }

  private async handleCleanup(job: Job<CleanupJobData>) {
    const { type, daysOld = 30 } = job.data;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    switch (type) {
      case 'old_interactions':
        const deletedInteractions = await prisma.aIInteraction.deleteMany({
          where: {
            createdAt: { lt: cutoffDate },
            status: { in: ['completed', 'failed'] },
          },
        });
        this.logger.info({ count: deletedInteractions.count }, 'Deleted old AI interactions');
        break;

      case 'old_notifications':
        const deletedNotifications = await prisma.notification.deleteMany({
          where: {
            createdAt: { lt: cutoffDate },
            status: { in: ['sent', 'read'] },
          },
        });
        this.logger.info({ count: deletedNotifications.count }, 'Deleted old notifications');
        break;

      case 'expired_tokens':
        const deletedTokens = await prisma.refreshToken.deleteMany({
          where: {
            OR: [
              { expiresAt: { lt: new Date() } },
              { revokedAt: { not: null } },
            ],
          },
        });
        this.logger.info({ count: deletedTokens.count }, 'Deleted expired tokens');
        break;
    }
  }

  private async handleAggregateStreaks(job: Job<AggregateStreaksJobData>) {
    const targetDate = job.data.date
      ? new Date(job.data.date)
      : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Get yesterday
    const yesterday = new Date(targetDate);
    yesterday.setDate(yesterday.getDate() - 1);

    // Find users who had tasks yesterday but didn't complete enough
    const usersWithTasks = await prisma.taskInstance.groupBy({
      by: ['userId'],
      where: {
        scheduledDate: yesterday,
      },
      _count: true,
    });

    for (const userGroup of usersWithTasks) {
      const completedCount = await prisma.taskInstance.count({
        where: {
          userId: userGroup.userId,
          scheduledDate: yesterday,
          status: 'completed',
        },
      });

      const completionRate = completedCount / userGroup._count;

      // If less than 80% completed, reset streak
      if (completionRate < 0.8) {
        await prisma.user.update({
          where: { id: userGroup.userId },
          data: { streakDays: 0 },
        });

        this.logger.info(
          { userId: userGroup.userId, completionRate },
          'Reset user streak due to low completion'
        );
      }
    }
  }

  private async handleResetDailyTokens() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.user.updateMany({
      where: {
        tokenResetDate: { lt: today },
      },
      data: {
        aiTokensUsedToday: 0,
        tokenResetDate: today,
      },
    });

    this.logger.info({ count: result.count }, 'Reset daily AI tokens');
  }

  private async handleMarkMissedTasks() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const result = await prisma.taskInstance.updateMany({
      where: {
        scheduledDate: { lte: yesterday },
        status: 'pending',
      },
      data: {
        status: 'missed',
      },
    });

    this.logger.info({ count: result.count }, 'Marked missed tasks');
  }

  private async handleGenerateDailyTasksForAll(job: Job<GenerateDailyTasksForAllJobData>) {
    const targetDate = job.data.date ? new Date(job.data.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const dateStr = targetDate.toISOString().split('T')[0];

    // Find all active goals
    const activeGoals = await prisma.goal.findMany({
      where: {
        status: 'active',
        deletedAt: null,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    this.logger.info({ count: activeGoals.length, date: dateStr }, 'Queueing daily task generation for all active goals');

    // Queue task generation for each active goal
    const jobs = [];
    for (const goal of activeGoals) {
      const jobPromise = this.aiJobsQueue.add(
        'generateDailyTasks',
        {
          userId: goal.userId,
          goalId: goal.id,
          date: dateStr ?? '',
        },
        {
          priority: 2,
          jobId: `tasks-${goal.id}-${dateStr}`,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        }
      );
      jobs.push(jobPromise);
    }

    await Promise.all(jobs);

    this.logger.info({ count: jobs.length, date: dateStr }, 'Successfully queued daily task generation jobs');
  }

  private async handleGenerateWeeklyMentorFeedback(job: Job<GenerateWeeklyMentorFeedbackJobData>) {
    // Find all active goals that have had activity in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeGoalsWithActivity = await prisma.goal.findMany({
      where: {
        status: 'active',
        deletedAt: null,
        tasks: {
          some: {
            instances: {
              some: {
                scheduledFor: {
                  gte: sevenDaysAgo,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        userId: true,
        title: true,
      },
    });

    this.logger.info(
      { count: activeGoalsWithActivity.length },
      'Queueing weekly mentor feedback for active goals'
    );

    // Queue mentor feedback for each active goal
    const jobs = [];
    for (const goal of activeGoalsWithActivity) {
      const jobPromise = this.aiJobsQueue.add(
        'mentorFeedback',
        {
          userId: goal.userId,
          goalId: goal.id,
        },
        {
          priority: 3,
          jobId: `mentor-${goal.id}-${Date.now()}`,
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 10000,
          },
        }
      );
      jobs.push(jobPromise);
    }

    await Promise.all(jobs);

    this.logger.info(
      { count: jobs.length },
      'Successfully queued weekly mentor feedback jobs'
    );
  }
}

