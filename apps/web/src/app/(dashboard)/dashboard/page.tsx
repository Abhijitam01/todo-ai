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
  ChevronRight,
  Zap,
  MessageSquare
} from 'lucide-react';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@todoai/ui';

import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { GoalCard } from '@/components/goals';
import { EmptyState } from '@/components/shared';
import type { Goal, TodayTask } from '@todoai/types';

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

  const { data: todayTasks } = useQuery({
    queryKey: ['today-tasks'],
    queryFn: () => api.get<TodayTask[]>('/tasks/today').then((r) => r.data),
  });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const activeTask = todayTasks?.find(t => t.status === 'in_progress') || todayTasks?.find(t => t.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Personal Dashboard</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/calendar">
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </Link>
          <Link href="/goal/new">
            <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 shadow-xl shadow-white/10">
              <Target className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview - More compact and integrated */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Streak"
          value={stats?.streak?.current ?? 0}
          unit="days"
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          subtext={`Best: ${stats?.streak?.longest ?? 0}`}
        />
        <StatCard
          label="Active Goals"
          value={stats?.goals?.active ?? 0}
          icon={<Target className="w-5 h-5 text-blue-500" />}
          subtext={`${stats?.goals?.completed ?? 0} completed`}
        />
        <StatCard
          label="Daily Progress"
          value={stats?.today?.percentage ?? 0}
          unit="%"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          subtext={`${stats?.today?.completed ?? 0}/${stats?.today?.total ?? 0} tasks`}
        />
        <StatCard
          label="AI Credits"
          value={100 - (stats?.aiUsage?.percentage ?? 0)}
          unit="%"
          icon={<Zap className="w-5 h-5 text-purple-500" />}
          subtext="Available today"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Focus Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Daily Focus
              </h2>
              <Link href="/today" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                View All Tasks
              </Link>
            </div>

            {activeTask ? (
              <Card className="border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          {activeTask.status === 'in_progress' ? 'Currently Working' : 'Up Next'}
                        </Badge>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                          {activeTask.goalTitle}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-white tracking-tight">
                        {activeTask.task.title}
                      </h3>
                      <p className="text-slate-400 max-w-md">
                        {activeTask.task.description || "No description provided for this task."}
                      </p>
                    </div>
                    <Link href="/today">
                      <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-8 h-14 rounded-2xl shadow-2xl shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                        {activeTask.status === 'in_progress' ? 'Continue Task' : 'Start Task'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/5 bg-white/5 backdrop-blur-xl border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
                  <p className="text-slate-500 mb-6">No pending tasks for today. Great job!</p>
                  <Link href="/goals">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                      Explore Goals
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Active Goals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Active Goals
              </h2>
              <Link href="/goals" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                Manage Goals
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {!goals?.data || goals.data.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    title="No active goals yet"
                    action={{
                      label: 'Create Your First Goal',
                      onClick: () => {
                        window.location.href = '/goal/new';
                      },
                    }}
                  />
                </div>
              ) : (
                goals.data.slice(0, 4).map((goal: Goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Mentor's Corner */}
          <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Mentor</span>
              </div>
              <CardTitle className="text-white text-xl font-black">Mentor's Corner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  "The secret of getting ahead is getting started. Your {stats?.today?.total ?? 0} tasks today are your stepping stones to success."
                </p>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white text-xs font-bold h-10">
                  Get New Advice
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats / Progress */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg font-bold">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-between gap-2 px-2">
                {[40, 70, 45, 90, 65, 30, 0].map((height, i) => (
                  <div key={i} className="flex-1 space-y-2">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t-sm transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-[10px] text-slate-600 text-center font-bold">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon, subtext }: { label: string, value: number | string, unit?: string, icon: React.ReactNode, subtext?: string }) {
  return (
    <Card className="border-white/5 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors">{label}</span>
          <div className="p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white tracking-tight">{value}</span>
          {unit && <span className="text-sm font-bold text-slate-500">{unit}</span>}
        </div>
        {subtext && <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tighter">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${className}`}>
      {children}
    </span>
  );
}

