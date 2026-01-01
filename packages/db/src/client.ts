import { PrismaClient } from '@prisma/client';

// ===========================================
// Prisma Client Singleton
// ===========================================
// Ensures a single instance is used across the application
// to prevent connection pool exhaustion.

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });
};

// Use global instance in development to prevent hot-reload issues
export const prisma: PrismaClient =
  globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export { PrismaClient };

