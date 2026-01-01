import * as React from 'react';

import { Card, CardContent, Spinner } from '@todoai/ui';

export interface PlanLoadingStateProps {
  goalTitle?: string;
  className?: string;
}

export function PlanLoadingState({
  goalTitle,
  className,
}: PlanLoadingStateProps) {
  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardContent className="py-12 text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white">Generating Your Plan</h3>
        <p className="text-slate-400 mt-2">
          {goalTitle
            ? `AI is creating a personalized plan for "${goalTitle}"...`
            : 'AI is creating a personalized plan for your goal...'}
        </p>
      </CardContent>
    </Card>
  );
}

