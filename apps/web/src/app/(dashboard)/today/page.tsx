'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Play,
  TrendingUp,
  Calendar,
  Sparkles,
  Trophy,
  Zap,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { toast, Card, CardContent, Button } from '@todoai/ui';
import type { TodayTask } from '@todoai/types';

import { api } from '@/lib/api';
import { TaskList, TaskCompletionDialog } from '@/components/tasks';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared';

export default function TodayPage() {
  const queryClient = useQueryClient();
  const [completingTask, setCompletingTask] = useState<TodayTask | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);

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
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
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

  const activeTask = inProgressTasks[0] || pendingTasks[0];

  if (isZenMode && activeTask) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <Button
          variant="ghost"
          className="absolute top-8 right-8 text-slate-500 hover:text-white hover:bg-white/5"
          onClick={() => setIsZenMode(false)}
        >
          <Minimize2 className="w-5 h-5 mr-2" />
          Exit Zen Mode
        </Button>

        <div className="max-w-2xl w-full space-y-12 text-center">
          <div className="space-y-4">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mx-auto">
              {activeTask.status === 'in_progress' ? 'Currently Working' : 'Up Next'}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              {activeTask.task.title}
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              {activeTask.goalTitle}
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 text-slate-500">
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-bold">{activeTask.task.estimatedMinutes} Minutes</span>
            </div>

            <div className="flex items-center gap-4">
              {activeTask.status === 'pending' ? (
                <Button
                  size="lg"
                  className="bg-white text-slate-950 hover:bg-slate-200 font-black px-12 h-20 text-2xl rounded-3xl shadow-2xl shadow-white/10"
                  onClick={() => startMutation.mutate(activeTask.id)}
                >
                  <Play className="w-8 h-8 mr-3 fill-current" />
                  Start Now
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black px-12 h-20 text-2xl rounded-3xl shadow-2xl shadow-green-500/20"
                  onClick={() => setCompletingTask(activeTask)}
                >
                  <CheckCircle2 className="w-8 h-8 mr-3" />
                  Complete Task
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Daily Focus</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Today's Tasks</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1 font-medium">
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

        <div className="flex items-center gap-3">
          {totalTasks > 0 && completionRate < 100 && (
            <Button
              onClick={() => setIsZenMode(true)}
              className="bg-white/5 hover:bg-white/10 text-white border-white/10 font-bold px-6"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Zen Mode
            </Button>
          )}
          {completionRate === 100 && totalTasks > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <Trophy className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-bold uppercase tracking-tighter text-sm">All done! 🎉</span>
            </div>
          )}
        </div>
      </div>

      {/* Mentor's Insight */}
      {totalTasks > 0 && completionRate < 100 && (
        <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Mentor Insight</span>
                </div>
                <h3 className="text-white font-bold text-lg">Keep the momentum going!</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You've completed {completedTasks.length} tasks today. Focus on the next one, and remember: small steps lead to big achievements. Your "{activeTask?.task.title}" task is perfectly sized for a quick win!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Progress Overview
                </h2>
                <span className="text-3xl font-black text-white">{completionRate}%</span>
              </div>
              <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 md:border-l border-white/10 md:pl-8">
              <StatItem label="Pending" value={pendingTasks.length} color="text-amber-400" />
              <StatItem label="Active" value={inProgressTasks.length} color="text-blue-400" />
              <StatItem label="Done" value={completedTasks.length} color="text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Sections */}
      {totalTasks === 0 ? (
        <Card className="border-white/5 bg-white/5 backdrop-blur-xl border-dashed">
          <CardContent className="py-20">
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
        <div className="space-y-10">
          {/* In Progress Tasks */}
          {inProgressTasks.length > 0 && (
            <TaskSection
              title="Currently Working"
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
              title="Up Next"
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
              title="Completed Today"
              icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
              count={completedTasks.length}
              color="from-green-500/10 to-emerald-500/10"
            >
              <TaskList
                tasks={completedTasks}
                onTaskAction={() => { }}
              />
            </TaskSection>
          )}
        </div>
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

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/5 ${(color || '').split(' ')[0].replace('from-', 'text-')}`}>
            {icon}
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <Badge className="bg-white/5 text-slate-500 border-white/10">{count}</Badge>
      </div>
      <div className="grid gap-4">
        {children}
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center justify-center w-fit ${className}`}>
      {children}
    </span>
  );
}

