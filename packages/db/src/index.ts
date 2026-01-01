// ===========================================
// TodoAI Database Package
// ===========================================

export { prisma, PrismaClient } from './client.js';

// Re-export Prisma types
// Using type inference from PrismaClient to get model types
import type { PrismaClient } from '@prisma/client';

export type PrismaUser = Awaited<ReturnType<PrismaClient['user']['findFirst']>>;
export type PrismaUserPreference = Awaited<ReturnType<PrismaClient['userPreference']['findFirst']>>;
export type PrismaRefreshToken = Awaited<ReturnType<PrismaClient['refreshToken']['findFirst']>>;
export type PrismaGoal = Awaited<ReturnType<PrismaClient['goal']['findFirst']>>;
export type PrismaPlan = Awaited<ReturnType<PrismaClient['plan']['findFirst']>>;
export type PrismaPlanMilestone = Awaited<ReturnType<PrismaClient['planMilestone']['findFirst']>>;
export type PrismaTask = Awaited<ReturnType<PrismaClient['task']['findFirst']>>;
export type PrismaTaskInstance = Awaited<ReturnType<PrismaClient['taskInstance']['findFirst']>>;
export type PrismaAIInteraction = Awaited<ReturnType<PrismaClient['aIInteraction']['findFirst']>>;
export type PrismaAIOutput = Awaited<ReturnType<PrismaClient['aIOutput']['findFirst']>>;
export type PrismaNotification = Awaited<ReturnType<PrismaClient['notification']['findFirst']>>;
export type PrismaUserStreak = Awaited<ReturnType<PrismaClient['userStreak']['findFirst']>>;
export type PrismaAuditLog = Awaited<ReturnType<PrismaClient['auditLog']['findFirst']>>;

