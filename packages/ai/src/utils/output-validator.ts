import { z, type ZodSchema } from 'zod';

// ===========================================
// AI Output Validator
// ===========================================

export class AIValidationError extends Error {
  constructor(
    public readonly schemaName: string,
    public readonly errors: z.ZodError,
    public readonly rawOutput: unknown
  ) {
    const errorMessages = errors.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
    
    super(`AI output validation failed for ${schemaName}: ${errorMessages}`);
    this.name = 'AIValidationError';
  }

  /**
   * Get structured error details for logging/debugging.
   */
  getDetails() {
    return {
      schemaName: this.schemaName,
      errors: this.errors.errors.map((e) => ({
        path: e.path.join('.'),
        code: e.code,
        message: e.message,
      })),
      rawOutput: this.rawOutput,
    };
  }
}

export class OutputValidator {
  /**
   * Validate AI output against a Zod schema.
   * 
   * @throws AIValidationError if validation fails
   */
  validate<T>(
    output: unknown,
    schema: ZodSchema<T>,
    schemaName: string
  ): T {
    const result = schema.safeParse(output);
    
    if (!result.success) {
      throw new AIValidationError(schemaName, result.error, output);
    }
    
    return result.data;
  }

  /**
   * Validate with fallback - returns default on failure.
   * Use sparingly; prefer throwing errors for visibility.
   */
  validateWithFallback<T>(
    output: unknown,
    schema: ZodSchema<T>,
    fallback: T,
    onError?: (error: AIValidationError) => void
  ): T {
    try {
      return this.validate(output, schema, 'FallbackSchema');
    } catch (error) {
      if (error instanceof AIValidationError && onError) {
        onError(error);
      }
      return fallback;
    }
  }

  /**
   * Attempt to repair common JSON issues before validation.
   * Returns the repaired string or throws if unrepairable.
   */
  repairJSON(rawString: string): string {
    let repaired = rawString.trim();
    
    // Remove markdown code blocks if present
    if (repaired.startsWith('```json')) {
      repaired = repaired.slice(7);
    } else if (repaired.startsWith('```')) {
      repaired = repaired.slice(3);
    }
    if (repaired.endsWith('```')) {
      repaired = repaired.slice(0, -3);
    }
    
    repaired = repaired.trim();
    
    // Try to parse to validate
    try {
      JSON.parse(repaired);
      return repaired;
    } catch {
      // Try to fix common issues
      
      // Remove trailing commas
      repaired = repaired.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      // Try again
      JSON.parse(repaired); // Will throw if still invalid
      return repaired;
    }
  }

  /**
   * Extract JSON from a mixed response (e.g., text with embedded JSON).
   */
  extractJSON(text: string): string | null {
    // Try to find JSON object
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        JSON.parse(objectMatch[0]);
        return objectMatch[0];
      } catch {
        // Continue to try array
      }
    }
    
    // Try to find JSON array
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        JSON.parse(arrayMatch[0]);
        return arrayMatch[0];
      } catch {
        // Failed
      }
    }
    
    return null;
  }
}

