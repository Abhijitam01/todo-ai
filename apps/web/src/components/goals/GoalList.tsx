import * as React from 'react';

import { Skeleton } from '@todoai/ui';
import type { Goal } from '@todoai/types';

import { EmptyState } from '../shared/EmptyState';
import { GoalCard } from './GoalCard';

export interface GoalListProps {
  goals?: Goal[];
  filter?: string;
  onGoalClick?: (goal: Goal) => void;
  isLoading?: boolean;
  className?: string;
}

export function GoalList({
  goals,
  filter,
  onGoalClick,
  isLoading = false,
  className,
}: GoalListProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangle" className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <EmptyState
        title="No goals yet"
        description="Create your first goal to get started"
        action={{
          label: 'Create Goal',
          onClick: () => {
            window.location.href = '/goal/new';
          },
        }}
        className={className}
      />
    );
  }

  const filteredGoals = filter
    ? goals.filter((goal) =>
        goal.title.toLowerCase().includes(filter.toLowerCase()) ||
        goal.description?.toLowerCase().includes(filter.toLowerCase())
      )
    : goals;

  if (filteredGoals.length === 0) {
    return (
      <EmptyState
        title="No goals found"
        description={`No goals match "${filter}"`}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {filteredGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onClick={onGoalClick ? () => onGoalClick(goal) : undefined}
        />
      ))}
    </div>
  );
}

