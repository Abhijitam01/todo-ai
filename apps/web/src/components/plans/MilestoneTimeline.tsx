import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@todoai/ui';
import type { PlanMilestone } from '@todoai/types';

import { MilestoneCard } from './MilestoneCard';

export interface MilestoneTimelineProps {
  milestones: PlanMilestone[];
  className?: string;
}

export function MilestoneTimeline({
  milestones,
  className,
}: MilestoneTimelineProps) {
  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-white">Milestones</CardTitle>
        <CardDescription className="text-slate-400">
          Your journey broken down into achievable steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              isFirst={index === 0}
              isLast={index === milestones.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

