// ===========================================
// Task Generator AI Prompts - Version 1
// ===========================================

export const TASK_GENERATOR_PROMPT_VERSION = 'task-generator.v1';

export const TASK_GENERATOR_SYSTEM_PROMPT = `You are an expert task generation AI for TodoAI.
Your role is to generate specific, actionable daily tasks based on a user's goal plan and progress.

IMPORTANT RULES:
1. You MUST respond with valid JSON only - no markdown, no explanations
2. Generate 3-5 concrete, executable tasks for the given day
3. Tasks should align with the current milestone's activities
4. Adjust task difficulty based on user's completion rate
5. Each task should be achievable in 15-60 minutes
6. Tasks must be specific, not vague (good: "Read Chapter 3 of Python book", bad: "Study Python")
7. Consider the day of week (weekday vs weekend)

You are NOT a chatbot. You are a task generation engine. Your output creates the user's daily todo list.`;

export const TASK_GENERATOR_USER_PROMPT_TEMPLATE = `
Generate specific daily tasks for the following context:

GOAL: {{goalTitle}}

CURRENT MILESTONE:
- Title: {{milestoneTitle}}
- Description: {{milestoneDescription}}
- Target Week: {{targetWeek}}
- Key Activities: {{keyActivities}}

USER PROGRESS:
- Day {{dayOfPlan}} of plan
- Recent completion rate: {{completionRate}}%
- Current streak: {{streakDays}} days

DATE CONTEXT:
- Date: {{date}}
- Day of week: {{dayOfWeek}}

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:
{
  "tasks": [
    {
      "title": "Specific task title (5-100 chars)",
      "description": "Detailed description of what to do (20-500 chars)",
      "reasoning": "Why this task matters for the milestone (20-300 chars)",
      "estimatedMinutes": <number 15-90>,
      "priority": "low" | "medium" | "high"
    }
  ],
  "dailyMotivation": "Brief encouraging message (10-200 chars)"
}

TASK GENERATION STRATEGY:
- If completion rate > 80%: Generate 4-5 tasks, can be slightly challenging
- If completion rate 50-80%: Generate 3-4 tasks, moderate difficulty
- If completion rate < 50%: Generate 2-3 easier tasks, focus on building momentum
- For weekends: Consider tasks that might need more time or different environment
- Ensure tasks build on each other and progress toward the milestone

CONSTRAINTS:
- Generate 2-5 tasks (adjust based on completion rate)
- Each task should directly relate to current milestone
- Tasks should be achievable on the specified day
- Priority distribution: mix of priorities, but align with milestone urgency
`;

export function buildTaskGeneratorPrompt(params: {
  goalTitle: string;
  milestoneTitle: string;
  milestoneDescription?: string;
  targetWeek: number;
  keyActivities: string[];
  dayOfPlan: number;
  completionRate: number;
  streakDays: number;
  date: string;
  dayOfWeek: string;
}): string {
  let prompt = TASK_GENERATOR_USER_PROMPT_TEMPLATE;
  
  prompt = prompt.replace('{{goalTitle}}', params.goalTitle);
  prompt = prompt.replace('{{milestoneTitle}}', params.milestoneTitle);
  prompt = prompt.replace('{{milestoneDescription}}', params.milestoneDescription ?? 'Not provided');
  prompt = prompt.replace('{{targetWeek}}', params.targetWeek.toString());
  prompt = prompt.replace('{{keyActivities}}', params.keyActivities.join(', '));
  prompt = prompt.replace('{{dayOfPlan}}', params.dayOfPlan.toString());
  prompt = prompt.replace('{{completionRate}}', params.completionRate.toFixed(0));
  prompt = prompt.replace('{{streakDays}}', params.streakDays.toString());
  prompt = prompt.replace('{{date}}', params.date);
  prompt = prompt.replace('{{dayOfWeek}}', params.dayOfWeek);
  
  return prompt.trim();
}

