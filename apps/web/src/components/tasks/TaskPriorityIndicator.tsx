import * as React from 'react';

import type { TaskPriority } from '@todoai/types';

export interface TaskPriorityIndicatorProps {
  priority: TaskPriority;
  className?: string;
}

const priorityColors = {
  low: 'bg-slate-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

export function TaskPriorityIndicator({
  priority,
  className,
}: TaskPriorityIndicatorProps) {
  return (
    <div
      className={`w-2 h-2 rounded-full ${priorityColors[priority]} ${className || ''}`}
      aria-label={`Priority: ${priority}`}
    />
  );
}

