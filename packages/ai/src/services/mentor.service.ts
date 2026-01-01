import {
  type AIProvider,
  type MentorFeedback,
  type MentorRequest,
  type MentorResponse,
  mentorFeedbackSchema,
} from '@todoai/types';

import { createAIProvider, type AIProviderInterface } from '../providers/factory';
import {
  buildMentorPrompt,
  MENTOR_PROMPT_VERSION,
  MENTOR_SYSTEM_PROMPT,
} from '../prompts/mentor.v1';
import { OutputValidator } from '../utils/output-validator';

// ===========================================
// Mentor Service
// ===========================================

export class MentorService {
  private provider: AIProviderInterface;
  private validator: OutputValidator;

  constructor(providerName: AIProvider = 'gemini') {
    this.provider = createAIProvider(providerName);
    this.validator = new OutputValidator();
  }

  /**
   * Generate mentoring feedback based on user's recent progress.
   * 
   * @throws Error if AI generation fails or output validation fails
   */
  async generateFeedback(request: MentorRequest): Promise<MentorResponse> {
    const prompt = buildMentorPrompt({
      goalId: request.goalId,
      streakDays: request.streakDays,
      completionRate: request.completionRate,
      recentTasks: request.recentTasks,
      context: request.context,
    });

    const result = await this.provider.generateJSON<MentorFeedback>(
      prompt,
      MENTOR_SYSTEM_PROMPT,
      {
        maxTokens: 1024,
        temperature: 0.8, // Slightly higher for more varied responses
      }
    );

    // Validate the output against our schema
    const validatedFeedback = this.validator.validate(
      result.data,
      mentorFeedbackSchema,
      'MentorOutput'
    );

    // Apply tone adjustments based on data
    this.adjustTone(validatedFeedback, request);

    return {
      success: true,
      feedback: validatedFeedback,
      tokensUsed: result.tokensUsed.total,
      promptVersion: MENTOR_PROMPT_VERSION,
    };
  }

  /**
   * Adjust feedback tone based on user patterns.
   * This ensures consistency even when AI varies.
   */
  private adjustTone(feedback: MentorFeedback, request: MentorRequest): void {
    // If user has low completion and AI was too harsh, soften it
    if (request.completionRate < 30 && feedback.tone === 'challenging') {
      feedback.tone = 'supportive';
    }

    // If user has high streak and AI was too soft, add challenge
    if (request.streakDays > 14 && request.completionRate > 90 && feedback.tone === 'supportive') {
      feedback.tone = 'motivating';
    }

    // Ensure action items are not overwhelming
    if (feedback.actionItems && feedback.actionItems.length > 3) {
      feedback.actionItems = feedback.actionItems.slice(0, 3);
    }
  }

  /**
   * Get the current prompt version for tracking.
   */
  getPromptVersion(): string {
    return MENTOR_PROMPT_VERSION;
  }

  /**
   * Get the provider name for tracking.
   */
  getProviderName(): AIProvider {
    return this.provider.name;
  }
}

