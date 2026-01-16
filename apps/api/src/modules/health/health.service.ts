import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@todoai/db';
import type Redis from 'ioredis';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
  };
}

export interface ServiceStatus {
  status: 'up' | 'down';
  latencyMs?: number;
  error?: string;
}

@Injectable()
export class HealthService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    @Inject('REDIS') private readonly redis: Redis
  ) {}

  async getHealth(): Promise<HealthStatus> {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const allUp = database.status === 'up' && redis.status === 'up';
    const allDown = database.status === 'down' && redis.status === 'down';

    return {
      status: allUp ? 'healthy' : allDown ? 'unhealthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      services: {
        database,
        redis,
      },
    };
  }

  async getLiveness(): Promise<{ status: 'ok' }> {
    return { status: 'ok' };
  }

  async getReadiness(): Promise<{ status: 'ready' | 'not_ready'; checks: Record<string, boolean> }> {
    const [dbReady, redisReady] = await Promise.all([
      this.checkDatabase().then((s) => s.status === 'up'),
      this.checkRedis().then((s) => s.status === 'up'),
    ]);

    return {
      status: dbReady && redisReady ? 'ready' : 'not_ready',
      checks: {
        database: dbReady,
        redis: redisReady,
      },
    };
  }

  private async checkDatabase(): Promise<ServiceStatus> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'up',
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkRedis(): Promise<ServiceStatus> {
    const start = Date.now();
    try {
      await this.redis.ping();
      return {
        status: 'up',
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

