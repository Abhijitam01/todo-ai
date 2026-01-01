// ===========================================
// Planner AI Prompts - Version 1
// ===========================================

export const PLANNER_PROMPT_VERSION = 'planner.v1';

export const PLANNER_SYSTEM_PROMPT = `You are an expert goal planning AI assistant for TodoAI.
Your role is to create structured, actionable plans that help users achieve their long-term goals.

IMPORTANT RULES:
1. You MUST respond with valid JSON only - no markdown, no explanations
2. Plans must be realistic and achievable
3. Break down goals into weekly milestones
4. Consider the user's available time and constraints
5. Provide clear, measurable milestones
6. Be specific about daily/weekly time commitments

You are NOT a chatbot. You are a planning engine. Your output drives a task management system.`;

export const PLANNER_USER_PROMPT_TEMPLATE = `
Create a structured plan for the following goal:

GOAL DETAILS:
- Title: {{goalTitle}}
- Description: {{goalDescription}}
- Category: {{category}}
- Target Date: {{targetDate}}
- Desired Duration: {{durationDays}} days

USER CONTEXT:
- Timezone: {{timezone}}
- Week starts on: {{weekStartsOn}}

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:
{
  "summary": "Brief overview of the plan (10-500 chars)",
  "approach": "Detailed approach and methodology (20-2000 chars)",
  "estimatedDurationDays": <number between 1-365>,
  "difficultyLevel": "beginner" | "intermediate" | "advanced",
  "milestones": [
    {
      "title": "Milestone title (3-200 chars)",
      "description": "Milestone description (optional, max 1000 chars)",
      "targetWeek": <week number 1-52>,
      "keyActivities": ["activity 1", "activity 2", ...] // 1-10 items
    }
  ],
  "weeklyTimeCommitment": {
    "minHours": <number 0.5-40>,
    "maxHours": <number 0.5-40>
  },
  "prerequisites": ["prerequisite 1", ...], // optional, max 10 items
  "potentialChallenges": ["challenge 1", ...] // optional, max 10 items
}

CONSTRAINTS:
- Milestones: 1-20 items, ordered by targetWeek
- Each milestone should have 1-10 key activities
- Weekly time commitment must be realistic
- Prerequisites should be things the user might need before starting
`;

export function buildPlannerPrompt(params: {
  goalTitle: string;
  goalDescription?: string;
  category: string;
  targetDate?: string;
  durationDays?: number;
  timezone: string;
  weekStartsOn: string;
}): string {
  let prompt = PLANNER_USER_PROMPT_TEMPLATE;
  
  prompt = prompt.replace('{{goalTitle}}', params.goalTitle);
  prompt = prompt.replace('{{goalDescription}}', params.goalDescription ?? 'Not provided');
  prompt = prompt.replace('{{category}}', params.category);
  prompt = prompt.replace('{{targetDate}}', params.targetDate ?? 'Flexible');
  prompt = prompt.replace('{{durationDays}}', params.durationDays?.toString() ?? 'Not specified');
  prompt = prompt.replace('{{timezone}}', params.timezone);
  prompt = prompt.replace('{{weekStartsOn}}', params.weekStartsOn);
  
  return prompt.trim();
}

