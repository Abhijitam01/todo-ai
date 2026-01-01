import { z } from 'zod';

// ===========================================
// API Response Schemas
// ===========================================

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Generic API response wrapper
export const apiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.object({
      requestId: z.string(),
      timestamp: z.string().datetime(),
    }),
  });

export const apiPaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    pagination: paginationSchema,
    meta: z.object({
      requestId: z.string(),
      timestamp: z.string().datetime(),
    }),
  });

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  meta: z.object({
    requestId: z.string(),
    timestamp: z.string().datetime(),
  }),
});

// ===========================================
// Auth Response Schemas
// ===========================================

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int(),
});

export const authResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
  }),
  tokens: authTokensSchema,
});

// ===========================================
// WebSocket Event Schemas
// ===========================================

export const wsEventTypeSchema = z.enum([
  'plan_generated',
  'tasks_generated',
  'mentor_feedback',
  'task_reminder',
  'streak_update',
  'error',
]);

export const wsEventSchema = z.object({
  type: wsEventTypeSchema,
  payload: z.unknown(),
  timestamp: z.string().datetime(),
});

export const wsPlanGeneratedEventSchema = z.object({
  type: z.literal('plan_generated'),
  payload: z.object({
    goalId: z.string().uuid(),
    planId: z.string().uuid(),
    status: z.enum(['success', 'failed']),
    message: z.string().optional(),
  }),
  timestamp: z.string().datetime(),
});

export const wsTasksGeneratedEventSchema = z.object({
  type: z.literal('tasks_generated'),
  payload: z.object({
    goalId: z.string().uuid(),
    taskCount: z.number().int(),
    date: z.string(),
  }),
  timestamp: z.string().datetime(),
});

export const wsMentorFeedbackEventSchema = z.object({
  type: z.literal('mentor_feedback'),
  payload: z.object({
    goalId: z.string().uuid(),
    feedback: z.string(),
  }),
  timestamp: z.string().datetime(),
});

// ===========================================
// Type Exports
// ===========================================

export type Pagination = z.infer<typeof paginationSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type WSEventType = z.infer<typeof wsEventTypeSchema>;
export type WSEvent = z.infer<typeof wsEventSchema>;
export type WSPlanGeneratedEvent = z.infer<typeof wsPlanGeneratedEventSchema>;
export type WSTasksGeneratedEvent = z.infer<typeof wsTasksGeneratedEventSchema>;
export type WSMentorFeedbackEvent = z.infer<typeof wsMentorFeedbackEventSchema>;

