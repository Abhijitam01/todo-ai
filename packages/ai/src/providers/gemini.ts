import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { AIProvider } from '@todoai/types';

import type { AIGenerateResult, AIProviderInterface, GenerateOptions } from './factory.js';

// ===========================================
// Google Gemini Provider
// ===========================================

export class GeminiProvider implements AIProviderInterface {
  readonly name: AIProvider = 'gemini';
  
  private client: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  private getClient(): GoogleGenerativeAI {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }
      this.client = new GoogleGenerativeAI(apiKey);
    }
    return this.client;
  }

  private getModel(): GenerativeModel {
    if (!this.model) {
      this.model = this.getClient().getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });
    }
    return this.model;
  }

  async generateJSON<T>(
    prompt: string,
    systemPrompt?: string,
    options: GenerateOptions = {}
  ): Promise<AIGenerateResult<T>> {
    const startTime = Date.now();
    const model = this.getModel();

    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: options.maxTokens ?? 4096,
          temperature: options.temperature ?? 0.7,
          topP: options.topP ?? 0.9,
        },
      });

      const response = result.response;
      const rawOutput = response.text();
      const latencyMs = Date.now() - startTime;

      // Parse JSON from response
      let data: T;
      try {
        data = JSON.parse(rawOutput) as T;
      } catch {
        throw new Error(`Failed to parse JSON from Gemini response: ${rawOutput.substring(0, 200)}`);
      }

      // Get token counts from response metadata
      const usageMetadata = response.usageMetadata;
      const tokensUsed = {
        input: usageMetadata?.promptTokenCount ?? 0,
        output: usageMetadata?.candidatesTokenCount ?? 0,
        total: usageMetadata?.totalTokenCount ?? 0,
      };

      return {
        data,
        rawOutput,
        tokensUsed,
        latencyMs,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Gemini API error after ${latencyMs}ms: ${error.message}`);
      }
      throw error;
    }
  }

  async countTokens(text: string): Promise<number> {
    const model = this.getModel();
    const result = await model.countTokens(text);
    return result.totalTokens;
  }
}

