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
  low: 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.4)]',
  medium: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]',
  high: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]',
  critical: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
};

const statusClasses = {
  pending: 'border-white/5 bg-white/5',
  in_progress: 'border-blue-500/30 bg-blue-500/5',
  completed: 'border-green-500/20 bg-green-500/5 opacity-75',
  skipped: 'border-white/5 bg-white/5 opacity-50',
  missed: 'border-red-500/20 bg-red-500/5 opacity-50',
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
      className={`group relative overflow-hidden backdrop-blur-xl transition-all duration-300 border ${statusClasses[task.status]} ${className || ''}`}
    >
      <CardContent className="p-5 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 flex-1">
            <div className="relative">
              {task.status === 'completed' ? (
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              ) : task.status === 'in_progress' ? (
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center animate-pulse">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Circle className="h-6 w-6 text-slate-500" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg truncate group-hover:text-cyan-400 transition-colors">
                {task.task.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-white/10 bg-white/5 text-slate-400">
                  {task.goalTitle}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{task.task.estimatedMinutes} min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/5">
              <div className={`w-2 h-2 rounded-full ${priorityColors[task.task.priority]}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                {task.task.priority}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {task.status === 'pending' && onStart && (
                <Button
                  size="sm"
                  className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-4 rounded-lg shadow-xl shadow-white/5"
                  onClick={onStart}
                >
                  <Play className="h-4 w-4 mr-1.5 fill-current" /> Start
                </Button>
              )}
              {task.status === 'in_progress' && onComplete && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-4 rounded-lg shadow-xl shadow-green-500/20"
                  onClick={onComplete}
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Complete
                </Button>
              )}
              {(task.status === 'pending' || task.status === 'in_progress') && onSkip && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg"
                  onClick={onSkip}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

