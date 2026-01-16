import {
  type AIProvider,
  type DailyTaskGenerationResponse,
  dailyTaskGenerationResponseSchema,
  type AIGeneratedTask,
} from '@todoai/types';

import { createAIProvider, type AIProviderInterface } from '../providers/factory.js';
import {
  buildTaskGeneratorPrompt,
  TASK_GENERATOR_PROMPT_VERSION,
  TASK_GENERATOR_SYSTEM_PROMPT,
} from '../prompts/task-generator.v1.js';
import { OutputValidator } from '../utils/output-validator.js';

// ===========================================
// Task Generator Service
// ===========================================

export interface TaskGenerationRequest {
  goalTitle: string;
  milestone: {
    title: string;
    description?: string;
    targetWeek: number;
    keyActivities: string[];
  };
  userProgress: {
    dayOfPlan: number;
    completionRate: number;
    streakDays: number;
  };
  date: Date;
}

export interface TaskGenerationResult {
  tasks: AIGeneratedTask[];
  dailyMotivation: string;
}

export class TaskGeneratorService {
  private provider: AIProviderInterface;
  private validator: OutputValidator;

  constructor(providerName: AIProvider = 'gemini') {
    this.provider = createAIProvider(providerName);
    this.validator = new OutputValidator();
  }

  /**
   * Generate daily tasks based on current milestone and user progress.
   * 
   * @throws Error if AI generation fails or output validation fails
   */
  async generateDailyTasks(request: TaskGenerationRequest): Promise<DailyTaskGenerationResponse> {
    const dayOfWeek = request.date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = request.date.toISOString().split('T')[0];

    const prompt = buildTaskGeneratorPrompt({
      goalTitle: request.goalTitle,
      milestoneTitle: request.milestone.title,
      milestoneDescription: request.milestone.description,
      targetWeek: request.milestone.targetWeek,
      keyActivities: request.milestone.keyActivities,
      dayOfPlan: request.userProgress.dayOfPlan,
      completionRate: request.userProgress.completionRate,
      streakDays: request.userProgress.streakDays,
      date: dateStr ?? '',
      dayOfWeek,
    });

    const result = await this.provider.generateJSON<TaskGenerationResult>(
      prompt,
      TASK_GENERATOR_SYSTEM_PROMPT,
      {
        maxTokens: 2048,
        temperature: 0.8, // Slightly higher for task variety
      }
    );

    // Validate the output
    const validatedResult = this.validator.validate(
      result.data,
      dailyTaskGenerationResponseSchema.omit({ 
        success: true, 
        tokensUsed: true, 
        promptVersion: true 
      }),
      'TaskGeneratorOutput'
    );

    // Additional business logic validation
    this.validateTasksLogic(validatedResult.tasks);

    return {
      success: true,
      tasks: validatedResult.tasks,
      tokensUsed: result.tokensUsed.total,
      promptVersion: TASK_GENERATOR_PROMPT_VERSION,
    };
  }

  /**
   * Validate business logic constraints on the generated tasks.
   */
  private validateTasksLogic(tasks: AIGeneratedTask[]): void {
    // Ensure we have at least 2 tasks
    if (tasks.length < 2) {
      throw new Error('Task generation failed: Too few tasks generated');
    }

    // Ensure estimated times are reasonable
    for (const task of tasks) {
      if (task.estimatedMinutes < 10 || task.estimatedMinutes > 120) {
        // Clamp to reasonable range
        task.estimatedMinutes = Math.max(15, Math.min(90, task.estimatedMinutes));
      }
    }

    // Ensure at least one high or medium priority task
    const hasPriority = tasks.some(t => t.priority === 'high' || t.priority === 'medium');
    if (!hasPriority && tasks.length > 0 && tasks[0]) {
      // Promote first task to medium priority
      tasks[0].priority = 'medium';
    }
  }

  /**
   * Get the current prompt version for tracking.
   */
  getPromptVersion(): string {
    return TASK_GENERATOR_PROMPT_VERSION;
  }

  /**
   * Get the provider name for tracking.
   */
  getProviderName(): AIProvider {
    return this.provider.name;
  }
}

