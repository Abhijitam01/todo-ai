import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@todoai/db';
import type { UpdateUserInput, UserPublic } from '@todoai/types';

@Injectable()
export class UserService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async findById(userId: string): Promise<UserPublic> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: { preferences: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(user);
  }

  async update(userId: string, input: UpdateUserInput): Promise<UserPublic> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.phoneNumber !== undefined && { phoneNumber: input.phoneNumber }),
        ...(input.preferences && {
          preferences: {
            update: input.preferences,
          },
        }),
      },
      include: { preferences: true },
    });

    return this.toPublicUser(user);
  }

  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        streakDays: true,
        longestStreak: true,
        aiTokensUsedToday: true,
        aiTokenBudget: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get goal stats
    const goalStats = await this.prisma.goal.groupBy({
      by: ['status'],
      where: { userId, deletedAt: null },
      _count: true,
    });

    // Get today's task completion
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = await this.prisma.taskInstance.aggregate({
      where: {
        userId,
        scheduledDate: today,
      },
      _count: true,
    });

    const completedToday = await this.prisma.taskInstance.count({
      where: {
        userId,
        scheduledDate: today,
        status: 'completed',
      },
    });

    return {
      streak: {
        current: user.streakDays,
        longest: user.longestStreak,
      },
      aiUsage: {
        used: user.aiTokensUsedToday,
        budget: user.aiTokenBudget,
        percentage: Math.round((user.aiTokensUsedToday / user.aiTokenBudget) * 100),
      },
      goals: {
        total: goalStats.reduce((acc: number, g: typeof goalStats[0]) => acc + g._count, 0),
        active: goalStats.find((g: typeof goalStats[0]) => g.status === 'active')?._count ?? 0,
        completed: goalStats.find((g: typeof goalStats[0]) => g.status === 'completed')?._count ?? 0,
      },
      today: {
        total: todayStats._count,
        completed: completedToday,
        percentage: todayStats._count > 0
          ? Math.round((completedToday / todayStats._count) * 100)
          : 0,
      },
    };
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string | null;
    streakDays: number;
    lastActiveAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    preferences: {
      timezone: string;
      dailyReminderTime: string;
      weekStartsOn: string;
      notificationsEnabled: boolean;
      emailNotifications: boolean;
      pushNotifications: boolean;
      theme: string;
    } | null;
  }): UserPublic {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      streakDays: user.streakDays,
      lastActiveAt: user.lastActiveAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferences: user.preferences
        ? {
            timezone: user.preferences.timezone,
            dailyReminderTime: user.preferences.dailyReminderTime,
            weekStartsOn: user.preferences.weekStartsOn as 'sunday' | 'monday',
            notificationsEnabled: user.preferences.notificationsEnabled,
            emailNotifications: user.preferences.emailNotifications,
            pushNotifications: user.preferences.pushNotifications,
            theme: user.preferences.theme as 'light' | 'dark' | 'system',
          }
        : {
            timezone: 'UTC',
            dailyReminderTime: '09:00',
            weekStartsOn: 'monday' as const,
            notificationsEnabled: true,
            emailNotifications: true,
            pushNotifications: false,
            theme: 'system' as const,
          },
    };
  }
}

