import { z } from 'zod';

// ===========================================
// Task Schemas
// ===========================================

export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const taskFrequencySchema = z.enum([
  'daily',
  'weekdays',
  'weekends',
  'weekly',
  'custom',
]);

export const taskStatusSchema = z.enum([
  'active',
  'paused',
  'completed',
  'archived',
]);

export const taskInstanceStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'skipped',
  'missed',
]);

// Task Template - The recurring task definition
export const taskSchema = z.object({
  id: z.string().uuid(),
  goalId: z.string().uuid(),
  milestoneId: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  priority: taskPrioritySchema,
  frequency: taskFrequencySchema,
  customDays: z.array(z.number().int().min(0).max(6)).nullable(), // 0=Sunday
  estimatedMinutes: z.number().int().positive(),
  status: taskStatusSchema,
  order: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

// Task Instance - A specific day's execution of a task
export const taskInstanceSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string().uuid(),
  scheduledDate: z.date(),
  status: taskInstanceStatusSchema,
  startedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  actualMinutes: z.number().int().nullable(),
  notes: z.string().nullable(),
  qualityRating: z.number().int().min(1).max(5).nullable(),
  aiEvaluation: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// For creating daily tasks
export const createTaskInstanceSchema = z.object({
  taskId: z.string().uuid(),
  scheduledDate: z.coerce.date(),
});

// For completing a task
export const completeTaskInstanceSchema = z.object({
  actualMinutes: z.number().int().positive().optional(),
  notes: z.string().max(1000).optional(),
  qualityRating: z.number().int().min(1).max(5).optional(),
});

// Today's task view
export const todayTaskSchema = taskInstanceSchema.extend({
  task: taskSchema.pick({
    title: true,
    description: true,
    priority: true,
    estimatedMinutes: true,
  }),
  goalTitle: z.string(),
});

// AI-generated task structure
export const aiGeneratedTaskSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  priority: taskPrioritySchema,
  frequency: taskFrequencySchema,
  customDays: z.array(z.number().int().min(0).max(6)).optional(),
  estimatedMinutes: z.number().int().min(5).max(480),
  reasoning: z.string().max(500), // Why this task exists
});

// ===========================================
// Type Exports
// ===========================================

export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type TaskFrequency = z.infer<typeof taskFrequencySchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskInstanceStatus = z.infer<typeof taskInstanceStatusSchema>;
export type Task = z.infer<typeof taskSchema>;
export type TaskInstance = z.infer<typeof taskInstanceSchema>;
export type CreateTaskInstanceInput = z.infer<typeof createTaskInstanceSchema>;
export type CompleteTaskInstanceInput = z.infer<typeof completeTaskInstanceSchema>;
export type TodayTask = z.infer<typeof todayTaskSchema>;
export type AIGeneratedTask = z.infer<typeof aiGeneratedTaskSchema>;

