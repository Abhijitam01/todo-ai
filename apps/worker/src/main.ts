import { prisma } from '@todoai/db';
import pino from 'pino';
import { Queue } from 'bullmq';

import { AIJobsProcessor } from './processors/ai-jobs.processor.js';
import { MaintenanceProcessor } from './processors/maintenance.processor.js';
import { NotificationProcessor } from './processors/notification.processor.js';
import { createQueues, gracefulShutdown, redisConnection } from './queues.js';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
  base: { service: 'todoai-worker' },
});

async function main() {
  logger.info('Starting TodoAI Worker...');

  // Create queues (queues are used by processors via redisConnection)
  createQueues();

  // Initialize processors
  const aiProcessor = new AIJobsProcessor(logger);
  const notificationProcessor = new NotificationProcessor(logger);
  const maintenanceProcessor = new MaintenanceProcessor(logger);

  // Start processors (they will handle Redis connection errors gracefully)
  await aiProcessor.start();
  await notificationProcessor.start();
  await maintenanceProcessor.start();

  logger.info('All processors started successfully');

  // Setup cron jobs
  const maintenanceQueue = new Queue('maintenance', { connection: redisConnection });
  const aiJobsQueue = new Queue('ai-jobs', { connection: redisConnection });
  
  // Schedule daily task generation at 6 AM every day
  await maintenanceQueue.add(
    'generateDailyTasksForAll',
    {},
    {
      repeat: {
        pattern: '0 6 * * *', // 6 AM daily
      },
      jobId: 'daily-tasks-cron',
    }
  );

  // Schedule weekly mentor feedback (every Monday at 8 AM)
  // This will queue individual mentor feedback jobs for active goals
  await maintenanceQueue.add(
    'generateWeeklyMentorFeedback',
    {},
    {
      repeat: {
        pattern: '0 8 * * 1', // 8 AM every Monday
      },
      jobId: 'weekly-mentor-feedback-cron',
    }
  );

  // Schedule streak aggregation at 1 AM every day
  await maintenanceQueue.add(
    'aggregateStreaks',
    {},
    {
      repeat: {
        pattern: '0 1 * * *', // 1 AM daily
      },
      jobId: 'aggregate-streaks-cron',
    }
  );

  // Schedule marking missed tasks at 2 AM every day
  await maintenanceQueue.add(
    'markMissedTasks',
    {},
    {
      repeat: {
        pattern: '0 2 * * *', // 2 AM daily
      },
      jobId: 'mark-missed-tasks-cron',
    }
  );

  // Reset daily AI tokens at midnight
  await maintenanceQueue.add(
    'resetDailyTokens',
    {},
    {
      repeat: {
        pattern: '0 0 * * *', // Midnight daily
      },
      jobId: 'reset-tokens-cron',
    }
  );

  logger.info('Cron jobs scheduled successfully');

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down...`);

    await aiProcessor.stop();
    await notificationProcessor.stop();
    await maintenanceProcessor.stop();

    await gracefulShutdown();
    await prisma.$disconnect();

    logger.info('Worker shutdown complete');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Keep the process running
  logger.info('Worker is running. Press Ctrl+C to stop.');
}

main().catch((error) => {
  logger.error({ err: error }, 'Worker failed to start');
  process.exit(1);
});

