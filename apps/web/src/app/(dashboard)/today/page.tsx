'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { toast } from '@todoai/ui';
import type { TodayTask } from '@todoai/types';

import { api } from '@/lib/api';
import { TaskList, TaskCompletionDialog, TaskSummaryCard } from '@/components/tasks';
import { PageHeader, LoadingState, ErrorState } from '@/components/shared';

export default function TodayPage() {
  const queryClient = useQueryClient();
  const [completingTask, setCompletingTask] = useState<TodayTask | null>(null);

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['today-tasks'],
    queryFn: () => api.get<TodayTask[]>('/tasks/today').then((r) => r.data),
  });

  const startMutation = useMutation({
    mutationFn: (taskId: string) => api.post(`/tasks/${taskId}/start`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-tasks'] });
      toast({ title: 'Task started!', variant: 'success' });
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: { actualMinutes?: number; notes?: string } }) =>
      api.patch(`/tasks/${taskId}/complete`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      setCompletingTask(null);
      toast({ title: 'Task completed!', variant: 'success' });
    },
  });

  const skipMutation = useMutation({
    mutationFn: (taskId: string) => api.post(`/tasks/${taskId}/skip`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-tasks'] });
      toast({ title: 'Task skipped' });
    },
  });

  if (isLoading) {
    return <LoadingState message="Loading tasks..." />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Today's Tasks"
          description={new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        />
        <ErrorState
          error={error instanceof Error ? error : new Error('Failed to load tasks')}
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['today-tasks'] })}
        />
      </div>
    );
  }

  const pendingTasks = tasks?.filter((t) => t.status === 'pending') ?? [];
  const inProgressTasks = tasks?.filter((t) => t.status === 'in_progress') ?? [];
  const completedTasks = tasks?.filter((t) => t.status === 'completed') ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Today's Tasks"
        description={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      />

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <TaskSummaryCard title="Total" count={tasks?.length ?? 0} color="text-slate-400" />
        <TaskSummaryCard title="In Progress" count={inProgressTasks.length} color="text-blue-400" />
        <TaskSummaryCard title="Completed" count={completedTasks.length} color="text-green-400" />
        <TaskSummaryCard title="Pending" count={pendingTasks.length} color="text-amber-400" />
      </div>

      {/* Task List */}
      {tasks && tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          groupBy="status"
          onTaskAction={(action, taskId) => {
            if (action === 'start') {
              startMutation.mutate(taskId);
            } else if (action === 'complete') {
              const task = tasks.find((t) => t.id === taskId);
              if (task) setCompletingTask(task);
            } else if (action === 'skip') {
              skipMutation.mutate(taskId);
            }
          }}
        />
      ) : null}

      {/* Complete task dialog */}
      {completingTask && (
        <TaskCompletionDialog
          task={completingTask}
          open={!!completingTask}
          onClose={() => {
            setCompletingTask(null);
          }}
          onSubmit={async (data) => {
            await completeMutation.mutateAsync({
              taskId: completingTask.id,
              data,
            });
          }}
          isSubmitting={completeMutation.isPending}
        />
      )}
    </div>
  );
}

