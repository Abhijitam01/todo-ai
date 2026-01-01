import { Flame } from 'lucide-react';
import * as React from 'react';

import { Badge, Card, CardContent } from '@todoai/ui';

export interface StreakDisplayProps {
  current: number;
  longest: number;
  showCalendar?: boolean;
  className?: string;
}

export function StreakDisplay({
  current,
  longest,
  showCalendar = false,
  className,
}: StreakDisplayProps) {
  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Flame className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-sm text-slate-400">Current Streak</p>
            <p className="text-3xl font-bold text-orange-400">
              {current} <span className="text-lg">days</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Longest: {longest} days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

