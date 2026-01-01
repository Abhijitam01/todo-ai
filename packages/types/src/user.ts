import { z } from 'zod';

// ===========================================
// User Schemas
// ===========================================

export const userPreferencesSchema = z.object({
  timezone: z.string().default('UTC'),
  dailyReminderTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default('09:00'),
  weekStartsOn: z.enum(['sunday', 'monday']).default('monday'),
  notificationsEnabled: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().optional(),
  preferences: userPreferencesSchema.partial().optional(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  preferences: userPreferencesSchema,
  aiTokenBudget: z.number().int().nonnegative(),
  aiTokensUsedToday: z.number().int().nonnegative(),
  streakDays: z.number().int().nonnegative(),
  lastActiveAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userPublicSchema = userSchema.omit({
  aiTokenBudget: true,
  aiTokensUsedToday: true,
});

// ===========================================
// Type Exports
// ===========================================

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserPublic = z.infer<typeof userPublicSchema>;

