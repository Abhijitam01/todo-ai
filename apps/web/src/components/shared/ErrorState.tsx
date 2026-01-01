import { AlertCircle } from 'lucide-react';
import * as React from 'react';

import { Button, Card, CardContent } from '@todoai/ui';

export interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardContent className="py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-400 mb-2 font-medium">Something went wrong</p>
        <p className="text-sm text-slate-400 mb-4">{errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

