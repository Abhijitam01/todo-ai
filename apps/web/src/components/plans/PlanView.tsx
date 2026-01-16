import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@todoai/ui';
import type { PlanWithMilestones } from '@todoai/types';

export interface PlanViewProps {
  plan: PlanWithMilestones;
  className?: string;
}

export function PlanView({ plan, className }: PlanViewProps) {
  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-white">Your Plan</CardTitle>
        <CardDescription className="text-slate-400">
          AI-generated plan v{plan.version}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-white mb-2">Summary</h4>
          <p className="text-slate-300">{plan.summary}</p>
        </div>
        <div>
          <h4 className="font-medium text-white mb-2">Approach</h4>
          <p className="text-slate-300">{plan.approach}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
          <div>
            <p className="text-sm text-slate-400">Duration</p>
            <p className="text-lg font-medium text-white">
              {plan.estimatedDurationDays} days
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Difficulty</p>
            <p className="text-lg font-medium text-white capitalize">
              {plan.difficultyLevel}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Milestones</p>
            <p className="text-lg font-medium text-white">
              {plan.milestones.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

