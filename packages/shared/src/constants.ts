// ===========================================
// Application Constants
// ===========================================

export const APP_VERSION = '0.1.0';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const AI_TOKEN_LIMITS = {
  DAILY_BUDGET_PER_USER: 50000,
  MAX_TOKENS_PER_REQUEST: 4096,
} as const;

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'skipped', 'missed'] as const;
export const GOAL_STATUSES = ['draft', 'planning', 'active', 'paused', 'completed', 'abandoned'] as const;

export const AI_ROLES = ['planner', 'mentor', 'evaluator'] as const;
export const AI_PROVIDERS = ['gemini', 'openai', 'claude'] as const;

export const NOTIFICATION_TYPES = [
  'goal_created',
  'plan_generated',
  'task_due',
  'task_completed',
  'streak_milestone',
  'mentor_message',
  'system_alert',
] as const;

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

