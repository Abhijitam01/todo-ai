import { z } from 'zod';

import { aiGeneratedPlanSchema } from './plan.js';
import { aiGeneratedTaskSchema } from './task.js';

// ===========================================
// AI Provider & Interaction Schemas
// ===========================================

export const aiProviderSchema = z.enum(['gemini', 'openai', 'claude']);

export const aiRoleSchema = z.enum(['planner', 'mentor', 'evaluator']);

export const aiInteractionStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'retrying',
]);

// AI Interaction record
export const aiInteractionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  role: aiRoleSchema,
  provider: aiProviderSchema,
  promptVersion: z.string(),
  status: aiInteractionStatusSchema,
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  latencyMs: z.number().int().nonnegative().nullable(),
  errorMessage: z.string().nullable(),
  retryCount: z.number().int().nonnegative(),
  createdAt: z.date(),
  completedAt: z.date().nullable(),
});

// AI Output - stored validated output
export const aiOutputSchema = z.object({
  id: z.string().uuid(),
  interactionId: z.string().uuid(),
  outputType: z.enum(['plan', 'tasks', 'feedback', 'evaluation']),
  rawOutput: z.string(), // Original JSON string
  validatedOutput: z.unknown(), // Parsed and validated
  validationErrors: z.array(z.string()).nullable(),
  createdAt: z.date(),
});

// ===========================================
// AI Request/Response Schemas (for services)
// ===========================================

export const plannerRequestSchema = z.object({
  userId: z.string().uuid(),
  goalId: z.string().uuid(),
  goalTitle: z.string(),
  goalDescription: z.string().optional(),
  category: z.string(),
  targetDate: z.date().optional(),
  durationDays: z.number().int().optional(),
  userPreferences: z.object({
    timezone: z.string(),
    weekStartsOn: z.string(),
  }),
});

export const plannerResponseSchema = z.object({
  success: z.literal(true),
  plan: aiGeneratedPlanSchema,
  tokensUsed: z.number().int(),
  promptVersion: z.string(),
});

export const mentorRequestSchema = z.object({
  userId: z.string().uuid(),
  goalId: z.string().uuid(),
  recentTasks: z.array(z.object({
    title: z.string(),
    status: z.string(),
    completedAt: z.date().nullable(),
  })),
  streakDays: z.number().int(),
  completionRate: z.number().min(0).max(100),
  context: z.string().optional(),
});

export const mentorFeedbackSchema = z.object({
  message: z.string().min(10).max(500),
  tone: z.enum(['encouraging', 'motivating', 'challenging', 'supportive']),
  actionItems: z.array(z.string()).max(3).optional(),
  adjustmentSuggestions: z.array(z.object({
    type: z.enum(['increase_difficulty', 'decrease_difficulty', 'change_schedule', 'add_break']),
    reason: z.string(),
  })).optional(),
});

export const mentorResponseSchema = z.object({
  success: z.literal(true),
  feedback: mentorFeedbackSchema,
  tokensUsed: z.number().int(),
  promptVersion: z.string(),
});

export const evaluatorRequestSchema = z.object({
  userId: z.string().uuid(),
  taskInstanceId: z.string().uuid(),
  taskTitle: z.string(),
  taskDescription: z.string().optional(),
  userNotes: z.string().optional(),
  actualMinutes: z.number().int(),
  expectedMinutes: z.number().int(),
});

export const evaluationResultSchema = z.object({
  qualityScore: z.number().int().min(1).max(5),
  feedback: z.string().min(10).max(300),
  improvement: z.string().max(200).optional(),
  encouragement: z.string().max(200),
});

export const evaluatorResponseSchema = z.object({
  success: z.literal(true),
  evaluation: evaluationResultSchema,
  tokensUsed: z.number().int(),
  promptVersion: z.string(),
});

// Daily task generation
export const dailyTaskGenerationRequestSchema = z.object({
  userId: z.string().uuid(),
  goalId: z.string().uuid(),
  currentMilestone: z.object({
    title: z.string(),
    description: z.string().optional(),
    keyActivities: z.array(z.string()),
  }),
  previousTasksCompletion: z.number().min(0).max(100),
  dayOfPlan: z.number().int().positive(),
});

export const dailyTaskGenerationResponseSchema = z.object({
  success: z.literal(true),
  tasks: z.array(aiGeneratedTaskSchema).min(1).max(5),
  tokensUsed: z.number().int(),
  promptVersion: z.string(),
});

// ===========================================
// Type Exports
// ===========================================

export type AIProvider = z.infer<typeof aiProviderSchema>;
export type AIRole = z.infer<typeof aiRoleSchema>;
export type AIInteractionStatus = z.infer<typeof aiInteractionStatusSchema>;
export type AIInteraction = z.infer<typeof aiInteractionSchema>;
export type AIOutput = z.infer<typeof aiOutputSchema>;

export type PlannerRequest = z.infer<typeof plannerRequestSchema>;
export type PlannerResponse = z.infer<typeof plannerResponseSchema>;
export type MentorRequest = z.infer<typeof mentorRequestSchema>;
export type MentorFeedback = z.infer<typeof mentorFeedbackSchema>;
export type MentorResponse = z.infer<typeof mentorResponseSchema>;
export type EvaluatorRequest = z.infer<typeof evaluatorRequestSchema>;
export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
export type EvaluatorResponse = z.infer<typeof evaluatorResponseSchema>;
export type DailyTaskGenerationRequest = z.infer<typeof dailyTaskGenerationRequestSchema>;
export type DailyTaskGenerationResponse = z.infer<typeof dailyTaskGenerationResponseSchema>;

