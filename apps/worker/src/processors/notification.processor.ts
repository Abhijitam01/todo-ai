import { prisma } from '@todoai/db';
import { Worker, Job } from 'bullmq';
import type { Logger } from 'pino';

import { redisConnection } from '../queues';

interface SendNotificationJobData {
  notificationId: string;
  channel: 'email' | 'push';
}

export class NotificationProcessor {
  private worker: Worker | null = null;

  constructor(private readonly logger: Logger) {}

  async start() {
    this.worker = new Worker<SendNotificationJobData>(
      'notifications',
      async (job) => {
        this.logger.info({ jobId: job.id }, 'Processing notification job');

        try {
          await this.handleSendNotification(job);
        } catch (error) {
          this.logger.error({ err: error, jobId: job.id }, 'Notification job failed');
          throw error;
        }
      },
      {
        connection: redisConnection,
        concurrency: 10,
      }
    );

    this.worker.on('completed', (job) => {
      this.logger.info({ jobId: job.id }, 'Notification sent');
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error({ jobId: job?.id, err: error }, 'Notification failed');
    });
  }

  async stop() {
    if (this.worker) {
      await this.worker.close();
    }
  }

  private async handleSendNotification(job: Job<SendNotificationJobData>) {
    const { notificationId, channel } = job.data;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: { user: true },
    });

    if (!notification) {
      throw new Error(`Notification ${notificationId} not found`);
    }

    try {
      switch (channel) {
        case 'email':
          await this.sendEmail(notification);
          break;
        case 'push':
          await this.sendPush(notification);
          break;
      }

      // Mark as sent
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });
    } catch (error) {
      // Mark as failed
      await prisma.notification.update({
        where: { id: notificationId },
        data: { status: 'failed' },
      });

      throw error;
    }
  }

  private async sendEmail(notification: {
    id: string;
    title: string;
    body: string;
    user: { email: string; name: string };
  }) {
    // TODO: Implement email sending
    // Options:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'TodoAI <noreply@todoai.com>',
    //   to: notification.user.email,
    //   subject: notification.title,
    //   html: `<p>${notification.body}</p>`,
    // });

    this.logger.info(
      { notificationId: notification.id, to: notification.user.email },
      'Email sending not implemented - would send email'
    );
  }

  private async sendPush(notification: {
    id: string;
    title: string;
    body: string;
    user: { id: string };
  }) {
    // TODO: Implement push notifications
    // Options:
    // - Firebase Cloud Messaging (FCM)
    // - OneSignal
    // - Pusher
    //
    // Would need to:
    // 1. Store user's push subscription/token
    // 2. Send notification via provider

    this.logger.info(
      { notificationId: notification.id, userId: notification.user.id },
      'Push notification not implemented - would send push'
    );
  }
}

