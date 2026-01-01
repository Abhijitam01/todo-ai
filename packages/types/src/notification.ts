import { z } from 'zod';

// ===========================================
// Notification Schemas
// ===========================================

export const notificationTypeSchema = z.enum([
  'task_reminder',
  'daily_summary',
  'streak_milestone',
  'plan_ready',
  'mentor_message',
  'goal_completed',
  'system',
]);

export const notificationChannelSchema = z.enum(['in_app', 'email', 'push']);

export const notificationStatusSchema = z.enum(['pending', 'sent', 'read', 'failed']);

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: notificationTypeSchema,
  channel: notificationChannelSchema,
  title: z.string(),
  body: z.string(),
  data: z.record(z.unknown()).nullable(),
  status: notificationStatusSchema,
  readAt: z.date().nullable(),
  sentAt: z.date().nullable(),
  createdAt: z.date(),
});

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: notificationTypeSchema,
  channel: notificationChannelSchema,
  title: z.string().max(200),
  body: z.string().max(1000),
  data: z.record(z.unknown()).optional(),
});

// ===========================================
// Type Exports
// ===========================================

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;
export type NotificationStatus = z.infer<typeof notificationStatusSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

