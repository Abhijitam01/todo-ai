'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { Card, CardContent, Progress } from '@todoai/ui';
import type { GoalWithPlan, PlanWithMilestones } from '@todoai/types';

import { api } from '@/lib/api';
import { GoalStatusBadge } from '@/components/goals';
import { MilestoneTimeline, PlanLoadingState, PlanView } from '@/components/plans';
import { LoadingState, ErrorState } from '@/components/shared';

export default function GoalDetailPage() {
  const params = useParams();
  const goalId = params.id as string;

  const { data: goal, isLoading: goalLoading, error: goalError } = useQuery({
    queryKey: ['goal', goalId],
    queryFn: () => api.get<GoalWithPlan>(`/goals/${goalId}`).then((r) => r.data),
  });

  const { data: plan } = useQuery({
    queryKey: ['goal-plan', goalId],
    queryFn: () => api.get<PlanWithMilestones>(`/goals/${goalId}/plan`).then((r) => r.data),
    enabled: !!goal && goal.status !== 'planning',
  });

  if (goalLoading) {
    return <LoadingState message="Loading goal..." />;
  }

  if (goalError || !goal) {
    return (
      <ErrorState
        error={goalError instanceof Error ? goalError : new Error('Goal not found')}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">{goal.title}</h1>
          <GoalStatusBadge status={goal.status} />
        </div>
        {goal.description && (
          <p className="text-slate-400">{goal.description}</p>
        )}
      </div>

      {/* Progress */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Overall Progress</span>
            <span className="text-2xl font-bold text-primary">
              {Math.round(goal.progressPercentage)}%
            </span>
          </div>
          <Progress value={goal.progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Plan section */}
      {goal.status === 'planning' && (
        <PlanLoadingState goalTitle={goal.title} />
      )}

      {plan && (
        <>
          <PlanView plan={plan} />
          <MilestoneTimeline milestones={plan.milestones} />
        </>
      )}
    </div>
  );
}

