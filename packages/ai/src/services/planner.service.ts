import {
  type AIGeneratedPlan,
  type AIProvider,
  type PlannerRequest,
  type PlannerResponse,
  aiGeneratedPlanSchema,
} from '@todoai/types';

import { createAIProvider, type AIProviderInterface } from '../providers/factory';
import {
  buildPlannerPrompt,
  PLANNER_PROMPT_VERSION,
  PLANNER_SYSTEM_PROMPT,
} from '../prompts/planner.v1';
import { OutputValidator } from '../utils/output-validator';

// ===========================================
// Planner Service
// ===========================================

export class PlannerService {
  private provider: AIProviderInterface;
  private validator: OutputValidator;

  constructor(providerName: AIProvider = 'gemini') {
    this.provider = createAIProvider(providerName);
    this.validator = new OutputValidator();
  }

  /**
   * Generate a structured plan for a user's goal.
   * 
   * @throws Error if AI generation fails or output validation fails
   */
  async generatePlan(request: PlannerRequest): Promise<PlannerResponse> {
    const prompt = buildPlannerPrompt({
      goalTitle: request.goalTitle,
      goalDescription: request.goalDescription,
      category: request.category,
      targetDate: request.targetDate?.toISOString().split('T')[0],
      durationDays: request.durationDays,
      timezone: request.userPreferences.timezone,
      weekStartsOn: request.userPreferences.weekStartsOn,
    });

    const result = await this.provider.generateJSON<AIGeneratedPlan>(
      prompt,
      PLANNER_SYSTEM_PROMPT,
      {
        maxTokens: 4096,
        temperature: 0.7,
      }
    );

    // Validate the output against our schema
    const validatedPlan = this.validator.validate(
      result.data,
      aiGeneratedPlanSchema,
      'PlannerOutput'
    );

    // Additional business logic validation
    this.validatePlanLogic(validatedPlan);

    return {
      success: true,
      plan: validatedPlan,
      tokensUsed: result.tokensUsed.total,
      promptVersion: PLANNER_PROMPT_VERSION,
    };
  }

  /**
   * Validate business logic constraints on the generated plan.
   */
  private validatePlanLogic(plan: AIGeneratedPlan): void {
    // Ensure milestones are ordered by week
    const weeks = plan.milestones.map(m => m.targetWeek);
    const sortedWeeks = [...weeks].sort((a, b) => a - b);
    if (JSON.stringify(weeks) !== JSON.stringify(sortedWeeks)) {
      // Auto-fix: sort milestones by week
      plan.milestones.sort((a, b) => a.targetWeek - b.targetWeek);
    }

    // Ensure weekly hours make sense
    if (plan.weeklyTimeCommitment.minHours > plan.weeklyTimeCommitment.maxHours) {
      const temp = plan.weeklyTimeCommitment.minHours;
      plan.weeklyTimeCommitment.minHours = plan.weeklyTimeCommitment.maxHours;
      plan.weeklyTimeCommitment.maxHours = temp;
    }

    // Ensure last milestone week doesn't exceed estimated duration
    const lastMilestoneWeek = Math.max(...plan.milestones.map(m => m.targetWeek));
    const estimatedWeeks = Math.ceil(plan.estimatedDurationDays / 7);
    if (lastMilestoneWeek > estimatedWeeks) {
      // Adjust estimated duration to fit milestones
      plan.estimatedDurationDays = lastMilestoneWeek * 7;
    }
  }

  /**
   * Get the current prompt version for tracking.
   */
  getPromptVersion(): string {
    return PLANNER_PROMPT_VERSION;
  }

  /**
   * Get the provider name for tracking.
   */
  getProviderName(): AIProvider {
    return this.provider.name;
  }
}

