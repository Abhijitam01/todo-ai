import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Shared Redis connection for queues
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    // Exponential backoff: wait 2^times * 100ms, max 30 seconds
    const delay = Math.min(times * 100, 30000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
  enableOfflineQueue: false, // Don't queue commands when offline
  lazyConnect: true, // Don't connect immediately
});

// Handle connection errors gracefully - suppress repeated errors
let connectionErrorLogged = false;
let lastErrorTime = 0;
const ERROR_LOG_INTERVAL = 10000; // Only log errors every 10 seconds

redisConnection.on('error', (err) => {
  const now = Date.now();
  // Only log if it's been more than ERROR_LOG_INTERVAL since last error
  if (!connectionErrorLogged || (now - lastErrorTime) > ERROR_LOG_INTERVAL) {
    console.error(`[Redis] Connection error: ${err.message}`);
    if (!connectionErrorLogged) {
      console.error('[Redis] Make sure Redis is running. Start it with: docker-compose up redis');
      console.error('[Redis] Worker will retry connection automatically...');
    }
    connectionErrorLogged = true;
    lastErrorTime = now;
  }
});

redisConnection.on('connect', () => {
  if (connectionErrorLogged) {
    console.log('[Redis] Reconnected successfully');
  }
  connectionErrorLogged = false;
});

redisConnection.on('ready', () => {
  console.log('[Redis] Ready to accept commands');
  connectionErrorLogged = false;
});

redisConnection.on('close', () => {
  // Only log if we were previously connected
  if (!connectionErrorLogged) {
    console.log('[Redis] Connection closed');
  }
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
  try {
    if (redisConnection.status === 'ready' || redisConnection.status === 'connecting') {
      await redisConnection.quit();
    }
  } catch (error) {
    // Ignore errors during shutdown
    console.error('[Redis] Error during shutdown:', error);
  }
};

