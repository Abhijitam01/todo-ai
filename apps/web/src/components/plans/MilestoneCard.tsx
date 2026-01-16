import { CheckCircle, Circle, Clock } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@todoai/ui';
import type { MilestoneStatus, PlanMilestone } from '@todoai/types';

export interface MilestoneCardProps {
  milestone: PlanMilestone;
  isFirst?: boolean;
  isLast?: boolean;
  className?: string;
}

const statusIcons: Record<MilestoneStatus, React.ReactNode> = {
  pending: <Circle className="h-5 w-5 text-slate-500" />,
  in_progress: <Clock className="h-5 w-5 text-blue-500" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />,
  skipped: <Circle className="h-5 w-5 text-slate-400" />,
};

export function MilestoneCard({
  milestone,
  isLast,
  className,
}: MilestoneCardProps) {
  return (
    <div className={`flex gap-4 ${className || ''}`}>
      <div className="flex flex-col items-center">
        {statusIcons[milestone.status]}
        {!isLast && <div className="w-0.5 flex-1 bg-slate-700 mt-2" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-white">{milestone.title}</h4>
          <Badge variant="outline" className="text-xs">
            Week {milestone.targetWeek}
          </Badge>
        </div>
        {milestone.description && (
          <p className="text-sm text-slate-400 mt-1">{milestone.description}</p>
        )}
      </div>
    </div>
  );
}

