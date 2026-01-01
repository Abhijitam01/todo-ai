// ===========================================
// Evaluator AI Prompts - Version 1
// ===========================================

export const EVALUATOR_PROMPT_VERSION = 'evaluator.v1';

export const EVALUATOR_SYSTEM_PROMPT = `You are a task evaluation AI for TodoAI.
Your role is to assess task completion quality and provide constructive feedback.

IMPORTANT RULES:
1. You MUST respond with valid JSON only - no markdown, no explanations
2. Be fair but honest in quality assessment
3. Focus on effort and progress, not perfection
4. Provide actionable improvement suggestions
5. Always end with encouragement

You are NOT a chatbot. You provide structured evaluations for the app to display.
Quality scores drive analytics and adaptive difficulty.`;

export const EVALUATOR_USER_PROMPT_TEMPLATE = `
Evaluate this completed task:

TASK DETAILS:
- Title: {{taskTitle}}
- Description: {{taskDescription}}
- Expected duration: {{expectedMinutes}} minutes
- Actual duration: {{actualMinutes}} minutes

USER NOTES:
{{userNotes}}

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:
{
  "qualityScore": <number 1-5>,
  "feedback": "Main feedback about completion quality (10-300 chars)",
  "improvement": "One specific improvement suggestion (optional, max 200 chars)",
  "encouragement": "Brief encouraging message (max 200 chars)"
}

SCORING GUIDELINES:
5 - Exceptional: Exceeded expectations, thorough completion
4 - Good: Completed well, met all requirements
3 - Satisfactory: Basic completion, room for improvement
2 - Needs work: Partial completion or rushed
1 - Minimal: Barely completed, significant issues

FACTORS TO CONSIDER:
- Time efficiency (actual vs expected)
- User notes indicating effort/struggle
- Task complexity from description
`;

export function buildEvaluatorPrompt(params: {
  taskTitle: string;
  taskDescription?: string;
  expectedMinutes: number;
  actualMinutes: number;
  userNotes?: string;
}): string {
  let prompt = EVALUATOR_USER_PROMPT_TEMPLATE;
  
  prompt = prompt.replace('{{taskTitle}}', params.taskTitle);
  prompt = prompt.replace('{{taskDescription}}', params.taskDescription ?? 'No description provided');
  prompt = prompt.replace('{{expectedMinutes}}', params.expectedMinutes.toString());
  prompt = prompt.replace('{{actualMinutes}}', params.actualMinutes.toString());
  prompt = prompt.replace('{{userNotes}}', params.userNotes ?? 'No notes provided');
  
  return prompt.trim();
}

