// ===========================================
// Token Counter Utility
// ===========================================

/**
 * Utility for estimating and tracking token usage.
 * 
 * Token counting is provider-specific, so this provides:
 * 1. Rough estimates for budget planning
 * 2. Actual counts from provider responses
 */
export class TokenCounter {
  // Average characters per token (rough estimate)
  // GPT-4: ~4 chars/token
  // Gemini: ~4 chars/token
  // Claude: ~4 chars/token
  private static readonly CHARS_PER_TOKEN = 4;

  /**
   * Estimate token count from text.
   * This is a rough approximation for budget planning.
   * Actual counts come from provider responses.
   */
  static estimate(text: string): number {
    if (!text) return 0;
    
    // Basic estimation: characters / 4
    const charEstimate = Math.ceil(text.length / this.CHARS_PER_TOKEN);
    
    // Adjust for whitespace (tends to be more efficient)
    const whitespaceRatio = (text.match(/\s/g) || []).length / text.length;
    const adjustment = 1 - (whitespaceRatio * 0.1);
    
    return Math.ceil(charEstimate * adjustment);
  }

  /**
   * Estimate tokens for a prompt with system message.
   */
  static estimatePrompt(userPrompt: string, systemPrompt?: string): number {
    const userTokens = this.estimate(userPrompt);
    const systemTokens = systemPrompt ? this.estimate(systemPrompt) : 0;
    
    // Add overhead for message formatting (role markers, etc.)
    const overhead = 10;
    
    return userTokens + systemTokens + overhead;
  }

  /**
   * Check if a request would exceed the budget.
   */
  static wouldExceedBudget(
    estimatedTokens: number,
    currentUsage: number,
    dailyBudget: number
  ): boolean {
    return currentUsage + estimatedTokens > dailyBudget;
  }

  /**
   * Calculate remaining budget.
   */
  static remainingBudget(currentUsage: number, dailyBudget: number): number {
    return Math.max(0, dailyBudget - currentUsage);
  }

  /**
   * Format token count for display.
   */
  static format(tokens: number): string {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  }
}

