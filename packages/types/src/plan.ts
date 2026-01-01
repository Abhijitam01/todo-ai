import { z } from 'zod';

// ===========================================
// Plan Schemas
// ===========================================

export const milestoneStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'skipped',
]);

export const planMilestoneSchema = z.object({
  id: z.string().uuid(),
  planId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  order: z.number().int().nonnegative(),
  status: milestoneStatusSchema,
  targetWeek: z.number().int().nonnegative(),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const planSchema = z.object({
  id: z.string().uuid(),
  goalId: z.string().uuid(),
  version: z.number().int().positive(),
  summary: z.string(),
  approach: z.string(),
  estimatedDurationDays: z.number().int().positive(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  promptVersion: z.string(),
  aiProvider: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const planWithMilestonesSchema = planSchema.extend({
  milestones: z.array(planMilestoneSchema),
});

// AI-generated plan structure (before DB storage)
export const aiGeneratedPlanSchema = z.object({
  summary: z.string().min(10).max(500),
  approach: z.string().min(20).max(2000),
  estimatedDurationDays: z.number().int().min(1).max(365),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  milestones: z.array(z.object({
    title: z.string().min(3).max(200),
    description: z.string().max(1000).optional(),
    targetWeek: z.number().int().min(1).max(52),
    keyActivities: z.array(z.string()).min(1).max(10),
  })).min(1).max(20),
  weeklyTimeCommitment: z.object({
    minHours: z.number().min(0.5).max(40),
    maxHours: z.number().min(0.5).max(40),
  }),
  prerequisites: z.array(z.string()).max(10).optional(),
  potentialChallenges: z.array(z.string()).max(10).optional(),
});

// ===========================================
// Type Exports
// ===========================================

export type MilestoneStatus = z.infer<typeof milestoneStatusSchema>;
export type PlanMilestone = z.infer<typeof planMilestoneSchema>;
export type Plan = z.infer<typeof planSchema>;
export type PlanWithMilestones = z.infer<typeof planWithMilestonesSchema>;
export type AIGeneratedPlan = z.infer<typeof aiGeneratedPlanSchema>;

