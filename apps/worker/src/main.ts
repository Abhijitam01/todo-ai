import { prisma } from '@todoai/db';
import pino from 'pino';

import { AIJobsProcessor } from './processors/ai-jobs.processor.js';
import { MaintenanceProcessor } from './processors/maintenance.processor.js';
import { NotificationProcessor } from './processors/notification.processor.js';
import { createQueues, gracefulShutdown } from './queues.js';

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

  // Create queues
  const { aiJobsQueue, notificationQueue, maintenanceQueue } = createQueues();

  // Initialize processors
  const aiProcessor = new AIJobsProcessor(logger);
  const notificationProcessor = new NotificationProcessor(logger);
  const maintenanceProcessor = new MaintenanceProcessor(logger);

  // Start processors
  await aiProcessor.start();
  await notificationProcessor.start();
  await maintenanceProcessor.start();

  logger.info('All processors started successfully');

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

