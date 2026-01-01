import * as React from 'react';

import { Button } from '@todoai/ui';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          href={action.href}
          asChild={!!action.href}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

