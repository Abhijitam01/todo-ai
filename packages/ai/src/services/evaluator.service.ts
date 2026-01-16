import {
  type AIProvider,
  type EvaluationResult,
  type EvaluatorRequest,
  type EvaluatorResponse,
  evaluationResultSchema,
} from '@todoai/types';

import { createAIProvider, type AIProviderInterface } from '../providers/factory.js';
import {
  buildEvaluatorPrompt,
  EVALUATOR_PROMPT_VERSION,
  EVALUATOR_SYSTEM_PROMPT,
} from '../prompts/evaluator.v1.js';
import { OutputValidator } from '../utils/output-validator.js';

// ===========================================
// Evaluator Service
// ===========================================

export class EvaluatorService {
  private provider: AIProviderInterface;
  private validator: OutputValidator;

  constructor(providerName: AIProvider = 'gemini') {
    this.provider = createAIProvider(providerName);
    this.validator = new OutputValidator();
  }

  /**
   * Evaluate a completed task and provide quality feedback.
   * 
   * @throws Error if AI generation fails or output validation fails
   */
  async evaluateTask(request: EvaluatorRequest): Promise<EvaluatorResponse> {
    const prompt = buildEvaluatorPrompt({
      taskTitle: request.taskTitle,
      taskDescription: request.taskDescription,
      expectedMinutes: request.expectedMinutes,
      actualMinutes: request.actualMinutes,
      userNotes: request.userNotes,
    });

    const result = await this.provider.generateJSON<EvaluationResult>(
      prompt,
      EVALUATOR_SYSTEM_PROMPT,
      {
        maxTokens: 512,
        temperature: 0.5, // Lower for more consistent evaluations
      }
    );

    // Validate the output against our schema
    const validatedEvaluation = this.validator.validate(
      result.data,
      evaluationResultSchema,
      'EvaluatorOutput'
    );

    // Apply time-based adjustments
    this.adjustEvaluation(validatedEvaluation, request);

    return {
      success: true,
      evaluation: validatedEvaluation,
      tokensUsed: result.tokensUsed.total,
      promptVersion: EVALUATOR_PROMPT_VERSION,
    };
  }

  /**
   * Apply objective adjustments based on measurable factors.
   */
  private adjustEvaluation(
    evaluation: EvaluationResult,
    request: EvaluatorRequest
  ): void {
    const timeRatio = request.actualMinutes / request.expectedMinutes;

    // Significant time overrun might indicate struggle
    if (timeRatio > 2 && evaluation.qualityScore > 3) {
      // Don't penalize too harshly, but note it
      if (!evaluation.improvement) {
        evaluation.improvement = 'Consider breaking this task into smaller parts next time.';
      }
    }

    // Very fast completion might indicate rushing or easy task
    if (timeRatio < 0.3 && evaluation.qualityScore === 5) {
      evaluation.qualityScore = 4;
      evaluation.feedback = evaluation.feedback.replace(
        /Exceptional|exceeded/gi,
        'Good'
      );
    }

    // Ensure quality score is within bounds
    evaluation.qualityScore = Math.max(1, Math.min(5, evaluation.qualityScore));
  }

  /**
   * Quick evaluation without AI for simple cases.
   * Use this to save tokens on straightforward completions.
   */
  quickEvaluate(request: EvaluatorRequest): EvaluationResult {
    const timeRatio = request.actualMinutes / request.expectedMinutes;
    let qualityScore: number;
    let feedback: string;

    if (timeRatio >= 0.8 && timeRatio <= 1.2) {
      qualityScore = 4;
      feedback = 'Task completed within expected time. Good job!';
    } else if (timeRatio < 0.8) {
      qualityScore = 3;
      feedback = 'Task completed quickly. Make sure quality was not compromised.';
    } else if (timeRatio <= 1.5) {
      qualityScore = 4;
      feedback = 'Task took a bit longer but that shows thoroughness.';
    } else {
      qualityScore = 3;
      feedback = 'Task took significantly longer than expected. Consider if it needs to be broken down.';
    }

    return {
      qualityScore,
      feedback,
      encouragement: 'Every completed task is progress toward your goal!',
    };
  }

  /**
   * Get the current prompt version for tracking.
   */
  getPromptVersion(): string {
    return EVALUATOR_PROMPT_VERSION;
  }

  /**
   * Get the provider name for tracking.
   */
  getProviderName(): AIProvider {
    return this.provider.name;
  }
}

