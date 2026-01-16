import type { AIProvider } from '@todoai/types';

import type { AIGenerateResult, AIProviderInterface, GenerateOptions } from './factory.js';

// ===========================================
// Anthropic Claude Provider (Placeholder)
// ===========================================

export class ClaudeProvider implements AIProviderInterface {
  readonly name: AIProvider = 'claude';

  async generateJSON<T>(
    _prompt: string,
    _systemPrompt?: string,
    _options: GenerateOptions = {}
  ): Promise<AIGenerateResult<T>> {
    // TODO: Implement Claude/Anthropic integration
    //
    // Implementation notes:
    // 1. Use @anthropic-ai/sdk npm package
    // 2. Use claude-3-opus or claude-3-sonnet model
    // 3. Claude doesn't have native JSON mode, so:
    //    - Include JSON schema in system prompt
    //    - Parse and validate response
    // 4. Extract token usage from response.usage
    //
    // Example structure:
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    // const response = await anthropic.messages.create({
    //   model: 'claude-3-sonnet-20240229',
    //   max_tokens: options.maxTokens ?? 4096,
    //   system: systemPrompt,
    //   messages: [{ role: 'user', content: prompt }],
    // });

    throw new Error('Claude provider not implemented. Set ANTHROPIC_API_KEY and implement this provider.');
  }

  async countTokens(_text: string): Promise<number> {
    // TODO: Implement using Anthropic's token counting
    // Note: Anthropic provides a count_tokens endpoint
    // or you can use their tokenizer library
    
    throw new Error('Claude token counting not implemented');
  }
}

