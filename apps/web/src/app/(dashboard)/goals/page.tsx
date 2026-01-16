'use client';

import { useQuery } from '@tanstack/react-query';

import type { Goal } from '@todoai/types';

import { api } from '@/lib/api';
import { GoalCard } from '@/components/goals';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/shared';

export default function GoalsPage() {
  const { data: goalsData, isLoading, error } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: () => api.get<Goal[]>('/goals').then((r) => r.data),
  });

  if (isLoading) {
    return <LoadingState message="Loading goals..." />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Your Goals"
          description="Track and manage all your goals"
        />
        <ErrorState
          error={error instanceof Error ? error : new Error('Failed to load goals')}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const goals = goalsData || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Goals"
        description="Track and manage all your goals"
        action={{
          label: 'New Goal',
          onClick: () => {
            window.location.href = '/goal/new';
          },
        }}
      />

      {goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No goals yet"
          description="Create your first goal to get started with TodoAI"
          action={{
            label: 'Create Goal',
            onClick: () => {
              window.location.href = '/goal/new';
            },
          }}
        />
      )}
    </div>
  );
}

