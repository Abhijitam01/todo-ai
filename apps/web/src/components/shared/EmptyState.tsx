import { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { Button, Card, CardContent } from '@todoai/ui';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <CardContent className="py-12 text-center">
        {Icon && (
          <Icon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        )}
        <p className="text-slate-400 mb-2 font-medium">{title}</p>
        {description && (
          <p className="text-sm text-slate-500 mb-4">{description}</p>
        )}
        {action && (
          <Button onClick={action.onClick}>{action.label}</Button>
        )}
      </CardContent>
    </Card>
  );
}

