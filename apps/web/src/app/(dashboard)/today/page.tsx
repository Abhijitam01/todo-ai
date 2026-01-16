'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  SkipForward, 
  TrendingUp,
  Calendar,
  Sparkles,
  Trophy
} from 'lucide-react';

import { toast, Card, CardContent, CardHeader, CardTitle, Progress, Button } from '@todoai/ui';
import type { TodayTask } from '@todoai/types';

import { api } from '@/lib/api';
import { TaskList, TaskCompletionDialog } from '@/components/tasks';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared';

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
      toast({ title: 'Task completed! 🎉', variant: 'success' });
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
    return <LoadingState message="Loading today's tasks..." />;
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Today's Tasks</h1>
          <p className="text-slate-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
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
  const totalTasks = tasks?.length ?? 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Today's Tasks</h1>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <p>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        {completionRate === 100 && totalTasks > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">All done! 🎉</span>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <Card className="border-slate-800/50 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Today's Progress
            </CardTitle>
            <div className="text-2xl font-bold text-white">
              {completionRate}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completionRate} className="h-3 bg-slate-800" />
          <div className="grid grid-cols-3 gap-4 pt-2">
            <StatItem
              icon={<Circle className="w-4 h-4" />}
              label="Pending"
              value={pendingTasks.length}
              color="text-amber-400"
            />
            <StatItem
              icon={<Clock className="w-4 h-4" />}
              label="In Progress"
              value={inProgressTasks.length}
              color="text-blue-400"
            />
            <StatItem
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Completed"
              value={completedTasks.length}
              color="text-green-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Task Sections */}
      {totalTasks === 0 ? (
        <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="py-12">
            <EmptyState
              title="No tasks scheduled for today"
              description="Tasks are automatically generated daily based on your active goals"
              action={{
                label: 'View Your Goals',
                onClick: () => {
                  window.location.href = '/goals';
                },
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* In Progress Tasks */}
          {inProgressTasks.length > 0 && (
            <TaskSection
              title="In Progress"
              icon={<Play className="w-5 h-5 text-blue-400" />}
              count={inProgressTasks.length}
              color="from-blue-500/10 to-purple-500/10"
            >
              <TaskList
                tasks={inProgressTasks}
                onTaskAction={(action, taskId) => {
                  if (action === 'complete') {
                    const task = tasks?.find((t) => t.id === taskId);
                    if (task) setCompletingTask(task);
                  } else if (action === 'skip') {
                    skipMutation.mutate(taskId);
                  }
                }}
              />
            </TaskSection>
          )}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <TaskSection
              title="Pending"
              icon={<Circle className="w-5 h-5 text-amber-400" />}
              count={pendingTasks.length}
              color="from-amber-500/10 to-orange-500/10"
            >
              <TaskList
                tasks={pendingTasks}
                onTaskAction={(action, taskId) => {
                  if (action === 'start') {
                    startMutation.mutate(taskId);
                  } else if (action === 'complete') {
                    const task = tasks?.find((t) => t.id === taskId);
                    if (task) setCompletingTask(task);
                  } else if (action === 'skip') {
                    skipMutation.mutate(taskId);
                  }
                }}
              />
            </TaskSection>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <TaskSection
              title="Completed"
              icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
              count={completedTasks.length}
              color="from-green-500/10 to-emerald-500/10"
            >
              <TaskList
                tasks={completedTasks}
                onTaskAction={() => {
                  // Completed tasks don't need actions
                }}
              />
            </TaskSection>
          )}
        </div>
      )}

      {/* Motivational Card */}
      {totalTasks > 0 && completionRate < 100 && (
        <Card className="border-slate-800/50 bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Keep Going!</h3>
                <p className="text-slate-300 text-sm">
                  You're {completionRate}% done with today's tasks. 
                  {pendingTasks.length > 0 && ` ${pendingTasks.length} more to go!`}
                  {completionRate >= 50 && " You're over halfway there! 💪"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

function StatItem({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={color}>{icon}</div>
      <div>
        <div className={`text-lg font-bold ${color}`}>{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

function TaskSection({
  title,
  icon,
  count,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={`border-slate-800/50 bg-gradient-to-br ${color} backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <CardTitle className="text-white text-lg">{title}</CardTitle>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900/50 text-sm font-medium text-slate-300">
            {count}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

