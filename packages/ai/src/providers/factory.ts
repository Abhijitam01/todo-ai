import type { AIProvider } from '@todoai/types';

import { ClaudeProvider } from './claude';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';

// ===========================================
// AI Provider Interface
// ===========================================

export interface AIProviderInterface {
  readonly name: AIProvider;
  
  generateJSON<T>(
    prompt: string,
    systemPrompt?: string,
    options?: GenerateOptions
  ): Promise<AIGenerateResult<T>>;
  
  countTokens(text: string): Promise<number>;
}

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

export interface AIGenerateResult<T> {
  data: T;
  rawOutput: string;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  latencyMs: number;
}

// ===========================================
// Provider Factory
// ===========================================

export function createAIProvider(provider: AIProvider): AIProviderInterface {
  switch (provider) {
    case 'gemini':
      return new GeminiProvider();
    case 'openai':
      return new OpenAIProvider();
    case 'claude':
      return new ClaudeProvider();
    default:
      throw new Error(`Unknown AI provider: ${provider as string}`);
  }
}

