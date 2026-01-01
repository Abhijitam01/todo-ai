import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@todoai/db';
import type { CreateNotificationInput, Notification, NotificationType } from '@todoai/types';
import type { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    @Inject('NOTIFICATION_QUEUE') private readonly notificationQueue: Queue
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        channel: input.channel,
        title: input.title,
        body: input.body,
        data: input.data ?? null,
      },
    });

    // Queue for delivery if not in_app
    if (input.channel !== 'in_app') {
      await this.notificationQueue.add('send', {
        notificationId: notification.id,
        channel: input.channel,
      });
    }

    return this.toNotification(notification);
  }

  async findByUser(
    userId: string,
    options: { unreadOnly?: boolean; page: number; limit: number }
  ) {
    const where = {
      userId,
      ...(options.unreadOnly && { readAt: null }),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications.map(this.toNotification),
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
        hasNext: options.page * options.limit < total,
        hasPrev: options.page > 1,
      },
    };
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  /**
   * Create a system notification for a user.
   * Convenience method for internal use.
   */
  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    await this.create({
      userId,
      type,
      channel: 'in_app',
      title,
      body,
      data,
    });
  }

  private toNotification(n: {
    id: string;
    userId: string;
    type: string;
    channel: string;
    title: string;
    body: string;
    data: unknown;
    status: string;
    readAt: Date | null;
    sentAt: Date | null;
    createdAt: Date;
  }): Notification {
    return {
      id: n.id,
      userId: n.userId,
      type: n.type as Notification['type'],
      channel: n.channel as Notification['channel'],
      title: n.title,
      body: n.body,
      data: n.data as Record<string, unknown> | null,
      status: n.status as Notification['status'],
      readAt: n.readAt,
      sentAt: n.sentAt,
      createdAt: n.createdAt,
    };
  }
}

