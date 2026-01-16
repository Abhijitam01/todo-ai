'use client';

import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@todoai/ui';
import type { TodayTask } from '@todoai/types';

import { FormField } from '../shared/FormField';

export interface TaskCompletionDialogProps {
  task: TodayTask;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { actualMinutes?: number; notes?: string }) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function TaskCompletionDialog({
  task,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TaskCompletionDialogProps) {
  const [actualMinutes, setActualMinutes] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({
      actualMinutes: actualMinutes ? parseInt(actualMinutes, 10) : undefined,
      notes: notes || undefined,
    });
    setActualMinutes('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Complete Task</DialogTitle>
          <DialogDescription className="text-slate-400">
            {task.task.title}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Actual time spent (minutes)">
            <Input
              type="number"
              placeholder={task.task.estimatedMinutes?.toString()}
              value={actualMinutes}
              onChange={(e) => setActualMinutes(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
            <p className="text-sm text-slate-400 mt-1">
              Estimated: {task.task.estimatedMinutes} minutes
            </p>
          </FormField>
          <FormField label="Notes (optional)">
            <Input
              placeholder="Any notes about this task..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </FormField>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Completing...' : 'Complete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

