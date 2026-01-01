import type { AIProvider } from '@todoai/types';

import type { AIGenerateResult, AIProviderInterface, GenerateOptions } from './factory';

// ===========================================
// OpenAI Provider (Placeholder)
// ===========================================

export class OpenAIProvider implements AIProviderInterface {
  readonly name: AIProvider = 'openai';

  async generateJSON<T>(
    _prompt: string,
    _systemPrompt?: string,
    _options: GenerateOptions = {}
  ): Promise<AIGenerateResult<T>> {
    // TODO: Implement OpenAI integration
    // 
    // Implementation notes:
    // 1. Use openai npm package
    // 2. Use GPT-4 or GPT-4-turbo model
    // 3. Use response_format: { type: "json_object" } for JSON mode
    // 4. Extract token usage from response.usage
    //
    // Example structure:
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const response = await openai.chat.completions.create({
    //   model: 'gpt-4-turbo-preview',
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: prompt }
    //   ],
    //   response_format: { type: 'json_object' },
    //   max_tokens: options.maxTokens ?? 4096,
    //   temperature: options.temperature ?? 0.7,
    // });

    throw new Error('OpenAI provider not implemented. Set OPENAI_API_KEY and implement this provider.');
  }

  async countTokens(_text: string): Promise<number> {
    // TODO: Implement using tiktoken library
    // import { encoding_for_model } from 'tiktoken';
    // const enc = encoding_for_model('gpt-4');
    // return enc.encode(text).length;
    
    throw new Error('OpenAI token counting not implemented');
  }
}

