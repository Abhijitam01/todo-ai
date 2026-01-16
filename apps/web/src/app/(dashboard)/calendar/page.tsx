'use client';

import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@todoai/ui';
import { apiClient } from '@/lib/api';

interface TaskInstance {
  id: string;
  date: Date;
  title: string;
  status: string;
  priority: string;
  estimatedMinutes: number;
  goal: {
    id: string;
    title: string;
    category: string;
    status: string;
  };
}

interface Goal {
  id: string;
  title: string;
  category: string;
  status: string;
  targetDate: Date | null;
  startDate: Date;
}

interface CalendarData {
  taskInstances: TaskInstance[];
  goals: Goal[];
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
  const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

  const { data, isLoading } = useQuery<CalendarData>({
    queryKey: ['calendar', start, end],
    queryFn: async () => {
      const response = await apiClient.get<CalendarData>(`/tasks/calendar?start=${start}&end=${end}`);
      return response.data;
    },
  });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (day: Date) => {
    if (!data) return [];
    return data.taskInstances.filter(task =>
      isSameDay(new Date(task.date), day)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'missed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'critical':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      case 'low':
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            View your tasks and goals across time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
        <span className="text-sm font-medium">Status:</span>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-xs">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-gray-400" />
          <span className="text-xs">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-yellow-500" />
          <span className="text-xs">Skipped</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-red-500" />
          <span className="text-xs">Missed</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border bg-card">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="border-r p-2 text-center text-sm font-medium last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, dayIdx) => {
            const tasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] border-r border-b p-2 ${
                  !isCurrentMonth ? 'bg-muted/30' : ''
                } ${isTodayDate ? 'bg-primary/5' : ''} ${
                  dayIdx % 7 === 6 ? 'border-r-0' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      isTodayDate
                        ? 'bg-primary text-primary-foreground'
                        : !isCurrentMonth
                        ? 'text-muted-foreground'
                        : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Tasks */}
                <div className="mt-1 space-y-1">
                  {tasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className={`text-xs rounded px-1.5 py-1 truncate ${getStatusColor(
                        task.status
                      )} ${getPriorityColor(task.priority)}`}
                      title={`${task.title} - ${task.goal.title}`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasks.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-1.5">
                      +{tasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goals Timeline */}
      {data && data.goals.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Active Goals</h2>
          <div className="space-y-3">
            {data.goals.map(goal => (
              <div
                key={goal.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {goal.category} • {goal.status}
                  </p>
                </div>
                {goal.targetDate && (
                  <div className="text-right">
                    <p className="text-sm font-medium">Target Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

