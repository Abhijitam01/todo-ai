import * as React from 'react';

import { Spinner } from '@todoai/ui';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({
  message,
  size = 'lg',
  className,
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size={size} />
        {message && (
          <p className="text-sm text-slate-400">{message}</p>
        )}
      </div>
    </div>
  );
}

