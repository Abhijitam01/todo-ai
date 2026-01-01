import { CheckCircle, Circle, Clock, Play, SkipForward } from 'lucide-react';
import * as React from 'react';

import { Badge, Button, Card, CardContent } from '@todoai/ui';
import type { TodayTask } from '@todoai/types';

export interface TaskCardProps {
  task: TodayTask;
  onStart?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

const priorityColors = {
  low: 'bg-slate-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const statusClasses = {
  pending: 'task-status-pending',
  in_progress: 'task-status-in-progress',
  completed: 'task-status-completed',
  skipped: 'task-status-missed',
  missed: 'task-status-missed',
};

export function TaskCard({
  task,
  onStart,
  onComplete,
  onSkip,
  className,
}: TaskCardProps) {
  return (
    <Card
      className={`border-slate-700 bg-slate-800/50 ${statusClasses[task.status]} ${className || ''}`}
    >
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {task.status === 'completed' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : task.status === 'in_progress' ? (
              <Clock className="h-6 w-6 text-blue-500" />
            ) : (
              <Circle className="h-6 w-6 text-slate-500" />
            )}
            <div>
              <h3 className="font-medium text-white">{task.task.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {task.goalTitle}
                </Badge>
                <span className="text-xs text-slate-400">
                  {task.task.estimatedMinutes} min
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${priorityColors[task.task.priority]}`}
            />
            {task.status === 'pending' && onStart && (
              <Button size="sm" variant="ghost" onClick={onStart}>
                <Play className="h-4 w-4 mr-1" /> Start
              </Button>
            )}
            {task.status === 'in_progress' && onComplete && (
              <Button size="sm" onClick={onComplete}>
                <CheckCircle className="h-4 w-4 mr-1" /> Complete
              </Button>
            )}
            {(task.status === 'pending' || task.status === 'in_progress') &&
              onSkip && (
                <Button size="sm" variant="ghost" onClick={onSkip}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

