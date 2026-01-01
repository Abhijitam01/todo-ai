import * as React from 'react';

import { Separator } from '@todoai/ui';
import type { TodayTask } from '@todoai/types';

import { EmptyState } from '../shared/EmptyState';
import { TaskCard } from './TaskCard';

export interface TaskListProps {
  tasks: TodayTask[];
  groupBy?: 'status' | 'priority' | 'none';
  onTaskAction?: (action: 'start' | 'complete' | 'skip', taskId: string) => void;
  className?: string;
}

export function TaskList({
  tasks,
  groupBy = 'status',
  onTaskAction,
  className,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks scheduled for today"
        description="Create a goal and AI will generate daily tasks for you"
        className={className}
      />
    );
  }

  if (groupBy === 'none') {
    return (
      <div className={`space-y-3 ${className || ''}`}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStart={
              onTaskAction && task.status === 'pending'
                ? () => onTaskAction('start', task.id)
                : undefined
            }
            onComplete={
              onTaskAction && task.status === 'in_progress'
                ? () => onTaskAction('complete', task.id)
                : undefined
            }
            onSkip={
              onTaskAction &&
              (task.status === 'pending' || task.status === 'in_progress')
                ? () => onTaskAction('skip', task.id)
                : undefined
            }
          />
        ))}
      </div>
    );
  }

  if (groupBy === 'status') {
    const pendingTasks = tasks.filter((t) => t.status === 'pending');
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    const skippedTasks = tasks.filter(
      (t) => t.status === 'skipped' || t.status === 'missed'
    );

    return (
      <div className={`space-y-6 ${className || ''}`}>
        {inProgressTasks.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">In Progress</h2>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={
                    onTaskAction
                      ? () => onTaskAction('complete', task.id)
                      : undefined
                  }
                  onSkip={
                    onTaskAction ? () => onTaskAction('skip', task.id) : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

        {pendingTasks.length > 0 && (
          <section>
            {inProgressTasks.length > 0 && <Separator className="my-6" />}
            <h2 className="text-xl font-semibold text-white mb-4">Pending</h2>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStart={
                    onTaskAction ? () => onTaskAction('start', task.id) : undefined
                  }
                  onSkip={
                    onTaskAction ? () => onTaskAction('skip', task.id) : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

        {completedTasks.length > 0 && (
          <section>
            {(inProgressTasks.length > 0 || pendingTasks.length > 0) && (
              <Separator className="my-6" />
            )}
            <h2 className="text-xl font-semibold text-white mb-4">Completed</h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {skippedTasks.length > 0 && (
          <section>
            {(inProgressTasks.length > 0 ||
              pendingTasks.length > 0 ||
              completedTasks.length > 0) && <Separator className="my-6" />}
            <h2 className="text-xl font-semibold text-white mb-4">Skipped</h2>
            <div className="space-y-3">
              {skippedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Priority grouping (if needed in future)
  return (
    <div className={`space-y-3 ${className || ''}`}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

