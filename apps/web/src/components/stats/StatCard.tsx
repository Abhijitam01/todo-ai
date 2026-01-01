import * as React from 'react';

import { Card, CardContent } from '@todoai/ui';

export interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  description?: string;
  color?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  suffix,
  description,
  color = 'text-primary',
  className,
}: StatCardProps) {
  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-400">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>
          {value}
          {suffix && <span className="text-lg">{suffix}</span>}
        </p>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

