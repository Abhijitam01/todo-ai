import { PlannerService, MentorService, EvaluatorService } from '@todoai/ai';
import { prisma } from '@todoai/db';
import { Worker, Job } from 'bullmq';
import type { Logger } from 'pino';

import { redisConnection } from '../queues.js';

interface GeneratePlanJobData {
  userId: string;
  goalId: string;
}

interface GenerateDailyTasksJobData {
  userId: string;
  goalId: string;
  date: string;
}

interface MentorFeedbackJobData {
  userId: string;
  goalId: string;
}

interface EvaluateTaskJobData {
  userId: string;
  taskInstanceId: string;
}

type JobData =
  | GeneratePlanJobData
  | GenerateDailyTasksJobData
  | MentorFeedbackJobData
  | EvaluateTaskJobData;

export class AIJobsProcessor {
  private worker: Worker | null = null;
  private plannerService: PlannerService;
  private mentorService: MentorService;
  private evaluatorService: EvaluatorService;

  constructor(private readonly logger: Logger) {
    this.plannerService = new PlannerService('gemini');
    this.mentorService = new MentorService('gemini');
    this.evaluatorService = new EvaluatorService('gemini');
  }

  async start() {
    // Try to connect to Redis if not already connected
    if (redisConnection.status === 'end' || redisConnection.status === 'wait') {
      try {
        await redisConnection.connect();
      } catch (error) {
        this.logger.warn(
          { err: error },
          'Redis not available, worker will retry when Redis is available'
        );
        // Retry connection after a delay (only if not already retrying)
        if (!this.worker) {
          setTimeout(() => {
            if (!this.worker) {
              this.start().catch((err) => {
                this.logger.error({ err }, 'Failed to restart worker');
              });
            }
          }, 5000);
        }
        return;
      }
    }

    // Don't create worker if one already exists
    if (this.worker) {
      return;
    }

    this.worker = new Worker<JobData>(
      'ai-jobs',
      async (job) => {
        this.logger.info({ jobId: job.id, jobName: job.name }, 'Processing AI job');

        try {
          switch (job.name) {
            case 'generatePlan':
              await this.handleGeneratePlan(job as Job<GeneratePlanJobData>);
              break;
            case 'generateDailyTasks':
              await this.handleGenerateDailyTasks(job as Job<GenerateDailyTasksJobData>);
              break;
            case 'mentorFeedback':
              await this.handleMentorFeedback(job as Job<MentorFeedbackJobData>);
              break;
            case 'evaluateTask':
              await this.handleEvaluateTask(job as Job<EvaluateTaskJobData>);
              break;
            default:
              this.logger.warn({ jobName: job.name }, 'Unknown job type');
          }
        } catch (error) {
          this.logger.error({ err: error, jobId: job.id }, 'Job failed');
          throw error;
        }
      },
      {
        connection: redisConnection,
        concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
      }
    );

    this.worker.on('completed', (job) => {
      this.logger.info({ jobId: job.id, jobName: job.name }, 'Job completed');
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error({ jobId: job?.id, err: error }, 'Job failed');
    });
  }

  async stop() {
    if (this.worker) {
      await this.worker.close();
    }
  }

  private async handleGeneratePlan(job: Job<GeneratePlanJobData>) {
    const { userId, goalId } = job.data;

    // Get goal details
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { user: { include: { preferences: true } } },
    });

    if (!goal) {
      throw new Error(`Goal ${goalId} not found`);
    }

    // Create AI interaction record
    const interaction = await prisma.aIInteraction.create({
      data: {
        userId,
        role: 'planner',
        provider: this.plannerService.getProviderName(),
        promptVersion: this.plannerService.getPromptVersion(),
        status: 'processing',
      },
    });

    try {
      // Generate plan
      const result = await this.plannerService.generatePlan({
        userId,
        goalId,
        goalTitle: goal.title,
        goalDescription: goal.description ?? undefined,
        category: goal.category,
        targetDate: goal.targetDate ?? undefined,
        durationDays: goal.durationDays ?? undefined,
        userPreferences: {
          timezone: goal.user.preferences?.timezone ?? 'UTC',
          weekStartsOn: goal.user.preferences?.weekStartsOn ?? 'monday',
        },
      });

      // Get existing plan version
      const existingPlan = await prisma.plan.findFirst({
        where: { goalId },
        orderBy: { version: 'desc' },
      });

      const newVersion = (existingPlan?.version ?? 0) + 1;

      // Save plan to database
      const plan = await prisma.plan.create({
        data: {
          goalId,
          version: newVersion,
          summary: result.plan.summary,
          approach: result.plan.approach,
          estimatedDurationDays: result.plan.estimatedDurationDays,
          difficultyLevel: result.plan.difficultyLevel,
          weeklyHoursMin: result.plan.weeklyTimeCommitment.minHours,
          weeklyHoursMax: result.plan.weeklyTimeCommitment.maxHours,
          promptVersion: result.promptVersion,
          aiProvider: this.plannerService.getProviderName(),
          milestones: {
            create: result.plan.milestones.map((m: { title: string; description?: string; targetWeek: number; keyActivities: string[] }, index: number) => ({
              title: m.title,
              description: m.description,
              order: index,
              targetWeek: m.targetWeek,
              keyActivities: m.keyActivities,
            })),
          },
        },
      });

      // Save AI output
      await prisma.aIOutput.create({
        data: {
          interactionId: interaction.id,
          planId: plan.id,
          outputType: 'plan',
          rawOutput: JSON.stringify(result.plan),
          validatedOutput: result.plan,
        },
      });

      // Update interaction
      await prisma.aIInteraction.update({
        where: { id: interaction.id },
        data: {
          status: 'completed',
          outputTokens: result.tokensUsed,
          completedAt: new Date(),
        },
      });

      // Update goal status
      await prisma.goal.update({
        where: { id: goalId },
        data: { status: 'active' },
      });

      // Update user token usage
      await prisma.user.update({
        where: { id: userId },
        data: {
          aiTokensUsedToday: { increment: result.tokensUsed },
        },
      });

      // TODO: Send WebSocket notification to user
      this.logger.info({ planId: plan.id, goalId }, 'Plan generated successfully');
    } catch (error) {
      // Update interaction with error
      await prisma.aIInteraction.update({
        where: { id: interaction.id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  private async handleGenerateDailyTasks(job: Job<GenerateDailyTasksJobData>) {
    const { userId, goalId, date } = job.data;

    // TODO: Implement daily task generation
    // 1. Get current milestone
    // 2. Get user's recent task completion rate
    // 3. Generate appropriate tasks for the day
    // 4. Create task instances

    this.logger.info({ userId, goalId, date }, 'Daily tasks generation not yet implemented');
  }

  private async handleMentorFeedback(job: Job<MentorFeedbackJobData>) {
    const { userId, goalId } = job.data;

    // Get recent tasks
    const recentTasks = await prisma.taskInstance.findMany({
      where: {
        userId,
        task: { goalId },
      },
      include: { task: true },
      orderBy: { scheduledDate: 'desc' },
      take: 10,
    });

    // Get user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true },
    });

    // Calculate completion rate
    const completedCount = recentTasks.filter((t) => t.status === 'completed').length;
    const completionRate = recentTasks.length > 0
      ? (completedCount / recentTasks.length) * 100
      : 0;

    // Create interaction record
    const interaction = await prisma.aIInteraction.create({
      data: {
        userId,
        role: 'mentor',
        provider: this.mentorService.getProviderName(),
        promptVersion: this.mentorService.getPromptVersion(),
        status: 'processing',
      },
    });

    try {
      const result = await this.mentorService.generateFeedback({
        userId,
        goalId,
        recentTasks: recentTasks.map((t) => ({
          title: t.task.title,
          status: t.status,
          completedAt: t.completedAt,
        })),
        streakDays: user?.streakDays ?? 0,
        completionRate,
      });

      // Save output
      await prisma.aIOutput.create({
        data: {
          interactionId: interaction.id,
          outputType: 'feedback',
          rawOutput: JSON.stringify(result.feedback),
          validatedOutput: result.feedback,
        },
      });

      // Update interaction
      await prisma.aIInteraction.update({
        where: { id: interaction.id },
        data: {
          status: 'completed',
          outputTokens: result.tokensUsed,
          completedAt: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'mentor_message',
          channel: 'in_app',
          title: 'Your AI Mentor has feedback',
          body: result.feedback.message,
          data: { goalId, feedback: result.feedback },
        },
      });

      this.logger.info({ userId, goalId }, 'Mentor feedback generated');
    } catch (error) {
      await prisma.aIInteraction.update({
        where: { id: interaction.id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  private async handleEvaluateTask(job: Job<EvaluateTaskJobData>) {
    const { userId, taskInstanceId } = job.data;

    const instance = await prisma.taskInstance.findUnique({
      where: { id: taskInstanceId },
      include: { task: true },
    });

    if (!instance) {
      throw new Error(`Task instance ${taskInstanceId} not found`);
    }

    // Use quick evaluation for simple cases
    if (!instance.notes && instance.actualMinutes) {
      const quickResult = this.evaluatorService.quickEvaluate({
        userId,
        taskInstanceId,
        taskTitle: instance.task.title,
        taskDescription: instance.task.description ?? undefined,
        expectedMinutes: instance.task.estimatedMinutes,
        actualMinutes: instance.actualMinutes,
      });

      await prisma.taskInstance.update({
        where: { id: taskInstanceId },
        data: {
          qualityRating: quickResult.qualityScore,
          aiEvaluation: quickResult.feedback,
        },
      });

      this.logger.info({ taskInstanceId }, 'Quick evaluation completed');
      return;
    }

    // Full AI evaluation
    const interaction = await prisma.aIInteraction.create({
      data: {
        userId,
        role: 'evaluator',
        provider: this.evaluatorService.getProviderName(),
        promptVersion: this.evaluatorService.getPromptVersion(),
        status: 'processing',
      },
    });

    try {
      const result = await this.evaluatorService.evaluateTask({
        userId,
        taskInstanceId,
        taskTitle: instance.task.title,
        taskDescription: instance.task.description ?? undefined,
        userNotes: instance.notes ?? undefined,
        actualMinutes: instance.actualMinutes ?? instance.task.estimatedMinutes,
        expectedMinutes: instance.task.estimatedMinutes,
      });

      // Update task instance
      await prisma.taskInstance.update({
        where: { id: taskInstanceId },
        data: {
          qualityRating: result.evaluation.qualityScore,
          aiEvaluation: result.evaluation.feedback,
        },
      });

      // Save output
      await prisma.aIOutput.create({
        data: {
          interactionId: interaction.id,
          outputType: 'evaluation',
          rawOutput: JSON.stringify(result.evaluation),
          validatedOutput: result.evaluation,
        },
      });

      // Update interaction
      await prisma.aIInteraction.update({
        where: { id: interaction.id },
        data: {
          status: 'completed',
          outputTokens: result.tokensUsed,
          completedAt: new Date(),
        },
      });

      this.logger.info({ taskInstanceId }, 'Task evaluation completed');
    } catch (error) {
      await prisma.aIInteraction.update({
        where: { id: interaction.id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }
}

