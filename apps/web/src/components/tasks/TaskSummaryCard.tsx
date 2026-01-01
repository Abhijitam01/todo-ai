import * as React from 'react';

import { Card, CardContent } from '@todoai/ui';

export interface TaskSummaryCardProps {
  title: string;
  count: number;
  color?: string;
  className?: string;
}

export function TaskSummaryCard({
  title,
  count,
  color = 'text-slate-400',
  className,
}: TaskSummaryCardProps) {
  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-400">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
      </CardContent>
    </Card>
  );
}

