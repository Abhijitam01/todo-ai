import * as React from 'react';

import { Badge, Progress } from '@todoai/ui';

export interface AIBudgetIndicatorProps {
  used: number;
  total: number;
  percentage: number;
  className?: string;
}

export function AIBudgetIndicator({
  used,
  total,
  percentage,
  className,
}: AIBudgetIndicatorProps) {
  const remaining = total - used;
  const remainingPercentage = 100 - percentage;
  const isLow = remainingPercentage < 20;
  const isWarning = remainingPercentage < 50;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">AI Budget</span>
        <Badge
          variant={isLow ? 'destructive' : isWarning ? 'outline' : 'default'}
        >
          {remainingPercentage.toFixed(0)}% remaining
        </Badge>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${isLow ? 'bg-red-500' : isWarning ? 'bg-amber-500' : ''}`}
      />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{used} / {total} tokens used</span>
        <span>{remaining} remaining</span>
      </div>
    </div>
  );
}

