import { Injectable } from '@nestjs/common';
import type { WSEvent, WSPlanGeneratedEvent, WSTasksGeneratedEvent, WSMentorFeedbackEvent } from '@todoai/types';
import { Server } from 'socket.io';

@Injectable()
export class WebSocketService {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Send an event to a specific user.
   */
  sendToUser(userId: string, event: WSEvent) {
    if (!this.server) return;
    this.server.to(`user:${userId}`).emit(event.type, event);
  }

  /**
   * Send an event to all subscribers of a goal.
   */
  sendToGoalSubscribers(userId: string, goalId: string, event: WSEvent) {
    if (!this.server) return;
    this.server.to(`goal:${goalId}:${userId}`).emit(event.type, event);
  }

  /**
   * Notify user that a plan has been generated.
   */
  notifyPlanGenerated(
    userId: string,
    goalId: string,
    planId: string,
    success: boolean,
    message?: string
  ) {
    const event: WSPlanGeneratedEvent = {
      type: 'plan_generated',
      payload: {
        goalId,
        planId,
        status: success ? 'success' : 'failed',
        message,
      },
      timestamp: new Date().toISOString(),
    };

    this.sendToUser(userId, event);
    this.sendToGoalSubscribers(userId, goalId, event);
  }

  /**
   * Notify user that daily tasks have been generated.
   */
  notifyTasksGenerated(
    userId: string,
    goalId: string,
    taskCount: number,
    date: string
  ) {
    const event: WSTasksGeneratedEvent = {
      type: 'tasks_generated',
      payload: {
        goalId,
        taskCount,
        date,
      },
      timestamp: new Date().toISOString(),
    };

    this.sendToUser(userId, event);
  }

  /**
   * Notify user of mentor feedback.
   */
  notifyMentorFeedback(userId: string, goalId: string, feedback: string) {
    const event: WSMentorFeedbackEvent = {
      type: 'mentor_feedback',
      payload: {
        goalId,
        feedback,
      },
      timestamp: new Date().toISOString(),
    };

    this.sendToUser(userId, event);
  }

  /**
   * Notify user of a streak update.
   */
  notifyStreakUpdate(userId: string, newStreak: number, isNewRecord: boolean) {
    const event: WSEvent = {
      type: 'streak_update',
      payload: {
        streak: newStreak,
        isNewRecord,
      },
      timestamp: new Date().toISOString(),
    };

    this.sendToUser(userId, event);
  }

  /**
   * Send an error notification to a user.
   */
  notifyError(userId: string, message: string, code?: string) {
    const event: WSEvent = {
      type: 'error',
      payload: {
        message,
        code,
      },
      timestamp: new Date().toISOString(),
    };

    this.sendToUser(userId, event);
  }
}

