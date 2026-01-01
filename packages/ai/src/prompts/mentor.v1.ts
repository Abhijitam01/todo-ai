// ===========================================
// Mentor AI Prompts - Version 1
// ===========================================

export const MENTOR_PROMPT_VERSION = 'mentor.v1';

export const MENTOR_SYSTEM_PROMPT = `You are a supportive AI mentor for TodoAI.
Your role is to provide brief, actionable guidance that helps users stay on track with their goals.

IMPORTANT RULES:
1. You MUST respond with valid JSON only - no markdown, no explanations
2. Be encouraging but not preachy
3. Keep messages concise and impactful
4. Focus on behavior patterns, not just task completion
5. Suggest adjustments when the user is struggling
6. Celebrate wins appropriately

You are NOT a chatbot. You provide structured feedback for display in the app.
Your messages should feel personal but be generated from patterns in the data.`;

export const MENTOR_USER_PROMPT_TEMPLATE = `
Provide mentoring feedback for this user's progress:

GOAL CONTEXT:
- Goal ID: {{goalId}}
- Current streak: {{streakDays}} days
- Completion rate (last 7 days): {{completionRate}}%

RECENT TASK HISTORY:
{{recentTasksJson}}

ADDITIONAL CONTEXT:
{{context}}

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:
{
  "message": "Primary feedback message (10-500 chars). Be concise and impactful.",
  "tone": "encouraging" | "motivating" | "challenging" | "supportive",
  "actionItems": ["action 1", "action 2", ...], // optional, max 3 items
  "adjustmentSuggestions": [ // optional
    {
      "type": "increase_difficulty" | "decrease_difficulty" | "change_schedule" | "add_break",
      "reason": "Brief explanation"
    }
  ]
}

GUIDELINES:
- If streak > 7: Celebrate consistency
- If completionRate < 50%: Be supportive, suggest adjustments
- If completionRate > 90%: Consider suggesting increased difficulty
- Action items should be specific and achievable today
`;

export function buildMentorPrompt(params: {
  goalId: string;
  streakDays: number;
  completionRate: number;
  recentTasks: Array<{
    title: string;
    status: string;
    completedAt: Date | null;
  }>;
  context?: string;
}): string {
  let prompt = MENTOR_USER_PROMPT_TEMPLATE;
  
  prompt = prompt.replace('{{goalId}}', params.goalId);
  prompt = prompt.replace('{{streakDays}}', params.streakDays.toString());
  prompt = prompt.replace('{{completionRate}}', params.completionRate.toFixed(1));
  prompt = prompt.replace('{{recentTasksJson}}', JSON.stringify(params.recentTasks, null, 2));
  prompt = prompt.replace('{{context}}', params.context ?? 'None provided');
  
  return prompt.trim();
}

