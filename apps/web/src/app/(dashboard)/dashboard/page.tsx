'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  Flame, 
  Target, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  ChevronRight
} from 'lucide-react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '@todoai/ui';

import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { GoalCard } from '@/components/goals';
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

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {greeting}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-400 text-lg">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/goal/new">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">
            <Target className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Streak Card */}
        <Card className="border-slate-800/50 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm hover:border-orange-500/30 transition-all group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Streak</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-white">{stats?.streak?.current ?? 0}</div>
              <div className="text-lg text-slate-400">days</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              🏆 Personal best: {stats?.streak?.longest ?? 0} days
            </p>
          </CardContent>
        </Card>

        {/* Active Goals Card */}
        <Card className="border-slate-800/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm hover:border-blue-500/30 transition-all group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Goals</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-white">{stats?.goals?.active ?? 0}</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              ✓ {stats?.goals?.completed ?? 0} goals completed
            </p>
          </CardContent>
        </Card>

        {/* Today's Progress Card */}
        <Card className="border-slate-800/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm hover:border-green-500/30 transition-all group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Today's Progress</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-white">{stats?.today?.percentage ?? 0}</div>
              <div className="text-lg text-slate-400">%</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {stats?.today?.completed ?? 0}/{stats?.today?.total ?? 0} tasks complete
            </p>
          </CardContent>
        </Card>

        {/* AI Budget Card */}
        <Card className="border-slate-800/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm hover:border-purple-500/30 transition-all group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">AI Credits</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-white">{100 - (stats?.aiUsage?.percentage ?? 0)}</div>
              <div className="text-lg text-slate-400">%</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Available for AI tasks today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Today's Tasks</CardTitle>
                    <CardDescription className="text-slate-400">
                      {stats?.today?.total ?? 0} tasks scheduled
                    </CardDescription>
                  </div>
                </div>
                <Link href="/today">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">{stats?.today?.completed ?? 0}/{stats?.today?.total ?? 0}</span>
                </div>
                <Progress value={stats?.today?.percentage ?? 0} className="h-3 bg-slate-800" />
              </div>
              
              {stats?.today?.total === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">No tasks scheduled for today</p>
                  <Link href="/goals">
                    <Button variant="outline" size="sm">
                      View Your Goals
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-2">
                  <Link href="/today">
                    <Button variant="outline" className="w-full border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5">
                      Start Working on Tasks
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Active Goals</CardTitle>
                    <CardDescription className="text-slate-400">
                      Your current objectives
                    </CardDescription>
                  </div>
                </div>
                <Link href="/goals">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
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
                <div className="space-y-3">
                  {goals.data.slice(0, 3).map((goal: Goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/goal/new">
                <Button variant="outline" className="w-full justify-start border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5">
                  <Target className="w-4 h-4 mr-2 text-cyan-400" />
                  Create New Goal
                </Button>
              </Link>
              <Link href="/today">
                <Button variant="outline" className="w-full justify-start border-slate-700 hover:border-green-500/50 hover:bg-green-500/5">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                  View Today's Tasks
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="outline" className="w-full justify-start border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/5">
                  <CalendarIcon className="w-4 h-4 mr-2 text-purple-400" />
                  Open Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Motivation Card */}
          <Card className="border-slate-800/50 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <CardTitle className="text-white text-lg">Daily Motivation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 italic leading-relaxed">
                "The secret of getting ahead is getting started. Your {stats?.today?.total ?? 0} tasks today are your stepping stones to success."
              </p>
              <p className="text-sm text-slate-400 mt-4">
                — Keep pushing forward! 💪
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

