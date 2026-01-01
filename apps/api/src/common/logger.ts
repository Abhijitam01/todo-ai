import pino from 'pino';

export function createLogger() {
  const isDev = process.env.NODE_ENV !== 'production';

  return pino({
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    formatters: {
      level: (label) => ({ level: label }),
    },
    base: {
      service: 'todoai-api',
      env: process.env.NODE_ENV || 'development',
    },
  });
}

export type Logger = ReturnType<typeof createLogger>;

