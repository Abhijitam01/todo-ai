import Link from 'next/link';
import * as React from 'react';

import { Badge, Button, Card, CardContent, Progress } from '@todoai/ui';
import type { Goal } from '@todoai/types';

import { GoalStatusBadge } from './GoalStatusBadge';

export interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
  showProgress?: boolean;
  className?: string;
}

export function GoalCard({
  goal,
  onClick,
  showProgress = true,
  className,
}: GoalCardProps) {
  const content = (
    <Card
      className={`border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer ${className || ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-white">{goal.title}</h3>
              <GoalStatusBadge status={goal.status} />
            </div>
            {goal.description && (
              <p className="text-sm text-slate-400 line-clamp-2">
                {goal.description}
              </p>
            )}
            {showProgress && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Progress</span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(goal.progressPercentage)}%
                  </span>
                </div>
                <Progress value={goal.progressPercentage} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return content;
  }

  return <Link href={`/goal/${goal.id}`}>{content}</Link>;
}

