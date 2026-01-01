import * as React from 'react';

import { Badge } from '@todoai/ui';
import type { GoalStatus } from '@todoai/types';

export interface GoalStatusBadgeProps {
  status: GoalStatus;
  className?: string;
}

const statusVariants: Record<GoalStatus, 'default' | 'secondary' | 'outline'> = {
  draft: 'outline',
  planning: 'secondary',
  active: 'default',
  paused: 'secondary',
  completed: 'default',
  abandoned: 'outline',
};

export function GoalStatusBadge({
  status,
  className,
}: GoalStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={className}>
      {status}
    </Badge>
  );
}

