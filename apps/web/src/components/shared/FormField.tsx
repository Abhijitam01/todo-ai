import * as React from 'react';

import { Label } from '@todoai/ui';

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label className="text-slate-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

