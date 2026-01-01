import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Shared Redis connection for queues
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

// Queue definitions
export const createQueues = () => {
  const connection = { connection: redisConnection };

  const aiJobsQueue = new Queue('ai-jobs', {
    ...connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 1000,
    },
  });

  const notificationQueue = new Queue('notifications', {
    ...connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  });

  const maintenanceQueue = new Queue('maintenance', {
    ...connection,
    defaultJobOptions: {
      attempts: 2,
      removeOnComplete: 10,
      removeOnFail: 50,
    },
  });

  return { aiJobsQueue, notificationQueue, maintenanceQueue };
};

export const gracefulShutdown = async () => {
  await redisConnection.quit();
};

