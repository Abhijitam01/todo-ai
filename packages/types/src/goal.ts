import { z } from 'zod';

// ===========================================
// Goal Schemas
// ===========================================

export const goalCategorySchema = z.enum([
  'health',
  'fitness',
  'learning',
  'career',
  'finance',
  'relationships',
  'creativity',
  'productivity',
  'other',
]);

export const goalStatusSchema = z.enum([
  'draft',
  'planning', // AI is generating plan
  'active',
  'paused',
  'completed',
  'abandoned',
]);

export const createGoalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  category: goalCategorySchema.default('other'),
  targetDate: z.coerce.date().optional(),
  durationDays: z.number().int().min(1).max(365).optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  category: goalCategorySchema.optional(),
  targetDate: z.coerce.date().optional(),
  status: goalStatusSchema.optional(),
});

export const goalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  category: goalCategorySchema,
  status: goalStatusSchema,
  targetDate: z.date().nullable(),
  durationDays: z.number().int().nullable(),
  progressPercentage: z.number().min(0).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const goalWithPlanSchema = goalSchema.extend({
  plan: z.object({
    id: z.string().uuid(),
    version: z.number(),
    milestoneCount: z.number(),
  }).nullable(),
});

// ===========================================
// Type Exports
// ===========================================

export type GoalCategory = z.infer<typeof goalCategorySchema>;
export type GoalStatus = z.infer<typeof goalStatusSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type GoalWithPlan = z.infer<typeof goalWithPlanSchema>;

