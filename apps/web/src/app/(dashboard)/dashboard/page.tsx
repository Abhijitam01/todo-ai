'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '@todoai/ui';

import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { StatCard } from '@/components/stats';
import { GoalCard } from '@/components/goals';
import { PageHeader } from '@/components/shared';
import { EmptyState } from '@/components/shared';
import type { Goal } from '@todoai/types';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useQuery<{
    streak: { current: number; longest: number };
    goals: { total: number; active: number; completed: number };
    today: { total: number; completed: number; percentage: number };
    aiUsage: { used: number; budget: number; percentage: number };
  }>({
    queryKey: ['user-stats'],
    queryFn: () => api.get<{
      streak: { current: number; longest: number };
      goals: { total: number; active: number; completed: number };
      today: { total: number; completed: number; percentage: number };
      aiUsage: { used: number; budget: number; percentage: number };
    }>('/users/me/stats').then((r) => r.data),
  });

  const { data: goals } = useQuery<{ data: Goal[] }>({
    queryKey: ['goals', { page: 1, limit: 5 }],
    queryFn: () => api.get<Goal[]>('/goals', { params: { page: 1, limit: 5 } }).then((r) => ({ data: r.data })),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
        description="Here's your progress overview"
        action={{
          label: 'New Goal',
          onClick: () => {
            window.location.href = '/goal/new';
          },
        }}
      />

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Current Streak"
          value={stats?.streak?.current ?? 0}
          suffix="days"
          description={`Longest: ${stats?.streak?.longest ?? 0} days`}
          color="text-orange-400"
        />
        <StatCard
          title="Active Goals"
          value={stats?.goals?.active ?? 0}
          description={`${stats?.goals?.completed ?? 0} completed`}
          color="text-blue-400"
        />
        <StatCard
          title="Today's Progress"
          value={stats?.today?.percentage ?? 0}
          suffix="%"
          description={`${stats?.today?.completed ?? 0}/${stats?.today?.total ?? 0} tasks`}
          color="text-green-400"
        />
        <StatCard
          title="AI Budget"
          value={100 - (stats?.aiUsage?.percentage ?? 0)}
          suffix="%"
          description="remaining today"
          color="text-purple-400"
        />
      </div>

      {/* Today's tasks quick view */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Today&apos;s Tasks</CardTitle>
            <CardDescription className="text-slate-400">
              {stats?.today?.total ?? 0} tasks scheduled for today
            </CardDescription>
          </div>
          <Link href="/today">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Progress value={stats?.today?.percentage ?? 0} className="h-2" />
          <p className="mt-2 text-sm text-slate-400">
            {stats?.today?.completed ?? 0} of {stats?.today?.total ?? 0} tasks completed
          </p>
        </CardContent>
      </Card>

      {/* Active goals */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Active Goals</CardTitle>
            <CardDescription className="text-slate-400">
              Your current objectives
            </CardDescription>
          </div>
          <Link href="/goals">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!goals?.data || goals.data.length === 0 ? (
            <EmptyState
              title="No active goals yet"
              action={{
                label: 'Create Your First Goal',
                onClick: () => {
                  window.location.href = '/goal/new';
                },
              }}
            />
          ) : (
            <div className="space-y-4">
              {goals.data.slice(0, 3).map((goal: Goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

