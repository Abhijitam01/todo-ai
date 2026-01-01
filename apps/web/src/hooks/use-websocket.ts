'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { toast } from '@todoai/ui';

import { useAuthStore } from '@/stores/auth.store';
import { useWebSocketStore } from '@/stores/websocket.store';

export function useWebSocket() {
  const queryClient = useQueryClient();
  const { tokens, isAuthenticated } = useAuthStore();
  const { connect, disconnect, lastEvent, isConnected } = useWebSocketStore();

  // Connect when authenticated
  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken && !isConnected) {
      connect(tokens.accessToken);
    }

    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [isAuthenticated, tokens?.accessToken, connect, disconnect, isConnected]);

  // Handle incoming events
  useEffect(() => {
    if (!lastEvent) return;

    switch (lastEvent.type) {
      case 'plan_generated':
        // Invalidate goal and plan queries
        const planEvent = lastEvent as { payload: { goalId: string; status: string; message?: string } };
        queryClient.invalidateQueries({ queryKey: ['goal', planEvent.payload.goalId] });
        queryClient.invalidateQueries({ queryKey: ['goal-plan', planEvent.payload.goalId] });
        queryClient.invalidateQueries({ queryKey: ['goals'] });

        if (planEvent.payload.status === 'success') {
          toast({
            title: 'Plan Ready!',
            description: 'Your AI-generated plan is now available.',
            variant: 'success',
          });
        } else {
          toast({
            title: 'Plan Generation Failed',
            description: planEvent.payload.message || 'Please try again.',
            variant: 'destructive',
          });
        }
        break;

      case 'tasks_generated':
        const tasksEvent = lastEvent as { payload: { taskCount: number } };
        queryClient.invalidateQueries({ queryKey: ['today-tasks'] });
        toast({
          title: 'New Tasks',
          description: `${tasksEvent.payload.taskCount} new tasks have been added.`,
        });
        break;

      case 'mentor_feedback':
        const feedbackEvent = lastEvent as { payload: { feedback: string } };
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        toast({
          title: 'AI Mentor',
          description: feedbackEvent.payload.feedback.substring(0, 100) + '...',
        });
        break;

      case 'streak_update':
        const streakEvent = lastEvent as { payload: { streak: number; isNewRecord: boolean } };
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        if (streakEvent.payload.isNewRecord) {
          toast({
            title: 'New Streak Record! 🔥',
            description: `You've reached a ${streakEvent.payload.streak} day streak!`,
            variant: 'success',
          });
        }
        break;

      case 'error':
        const errorEvent = lastEvent as { payload: { message: string } };
        toast({
          title: 'Error',
          description: errorEvent.payload.message,
          variant: 'destructive',
        });
        break;
    }
  }, [lastEvent, queryClient]);

  return { isConnected };
}

