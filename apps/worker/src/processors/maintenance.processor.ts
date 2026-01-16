import { prisma } from '@todoai/db';
import { Worker, Job } from 'bullmq';
import type { Logger } from 'pino';

import { redisConnection } from '../queues.js';

interface CleanupJobData {
  type: 'old_interactions' | 'old_notifications' | 'expired_tokens';
  daysOld?: number;
}

interface AggregateStreaksJobData {
  date?: string;
}

type MaintenanceJobData = CleanupJobData | AggregateStreaksJobData;

export class MaintenanceProcessor {
  private worker: Worker | null = null;

  constructor(private readonly logger: Logger) {}

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
}

