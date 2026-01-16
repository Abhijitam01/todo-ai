'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { 
  Target, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Trophy,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

import type { Goal } from '@todoai/types';

import { api } from '@/lib/api';
import { GoalCard } from '@/components/goals';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared';
import { Button, Card, CardContent } from '@todoai/ui';

type FilterType = 'all' | 'active' | 'completed' | 'archived';

export default function GoalsPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const { data: goalsData, isLoading, error } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: () => api.get<Goal[]>('/goals').then((r) => r.data),
  });

  if (isLoading) {
    return <LoadingState message="Loading goals..." />;
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Goals</h1>
          <p className="text-slate-400">Track and manage all your goals</p>
        </div>
        <ErrorState
          error={error instanceof Error ? error : new Error('Failed to load goals')}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const goals = goalsData || [];
  
  // Filter goals
  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    if (filter === 'active') return goal.status === 'active';
    if (filter === 'completed') return goal.status === 'completed';
    if (filter === 'archived') return goal.status === 'archived';
    return true;
  });

  // Stats
  const activeGoals = goals.filter((g) => g.status === 'active').length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const totalGoals = goals.length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Goals</h1>
          <p className="text-slate-400">Track and manage all your objectives</p>
        </div>
        <Link href="/goal/new">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      {totalGoals > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Total Goals"
            value={totalGoals}
            color="from-slate-500 to-slate-600"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Active"
            value={activeGoals}
            color="from-blue-500 to-purple-600"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Completed"
            value={completedGoals}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Success Rate"
            value={`${totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%`}
            color="from-orange-500 to-red-600"
          />
        </div>
      )}

      {/* Filters */}
      {totalGoals > 0 && (
        <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <FilterButton
                  label="All"
                  count={totalGoals}
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                />
                <FilterButton
                  label="Active"
                  count={activeGoals}
                  active={filter === 'active'}
                  onClick={() => setFilter('active')}
                />
                <FilterButton
                  label="Completed"
                  count={completedGoals}
                  active={filter === 'completed'}
                  onClick={() => setFilter('completed')}
                />
                <FilterButton
                  label="Archived"
                  count={goals.filter((g) => g.status === 'archived').length}
                  active={filter === 'archived'}
                  onClick={() => setFilter('archived')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : totalGoals === 0 ? (
        <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="py-16">
            <EmptyState
              title="No goals yet"
              description="Create your first goal and let AI help you achieve it"
              action={{
                label: 'Create Your First Goal',
                onClick: () => {
                  window.location.href = '/goal/new';
                },
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No {filter} goals found
              </h3>
              <p className="text-slate-400 mb-4">
                Try changing the filter to see more goals
              </p>
              <Button
                variant="outline"
                onClick={() => setFilter('all')}
                className="border-slate-700 hover:border-cyan-500/50"
              >
                Show All Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Card */}
      {activeGoals > 0 && (
        <Card className="border-slate-800/50 bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Keep Going!</h3>
                <p className="text-slate-300 text-sm">
                  You have {activeGoals} active {activeGoals === 1 ? 'goal' : 'goals'}. 
                  Stay consistent with your daily tasks and you'll achieve great things! 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card className={`border-slate-800/50 bg-gradient-to-br ${color}/10 backdrop-blur-sm hover:border-slate-700/50 transition-all group`}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
      }`}
    >
      {label} <span className="ml-1 opacity-75">({count})</span>
    </button>
  );
}

