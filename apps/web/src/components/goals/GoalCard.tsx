import Link from 'next/link';
import * as React from 'react';

import { Card, CardContent } from '@todoai/ui';
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
      className={`group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 cursor-pointer ${className || ''}`}
      onClick={onClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-cyan-400 transition-colors">
                {goal.title}
              </h3>
              <GoalStatusBadge status={goal.status} />
            </div>
            {goal.description && (
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {goal.description}
              </p>
            )}
            {showProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium uppercase tracking-wider">Progress</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {Math.round(goal.progressPercentage)}%
                  </span>
                </div>
                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${goal.progressPercentage}%` }}
                  />
                </div>
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

