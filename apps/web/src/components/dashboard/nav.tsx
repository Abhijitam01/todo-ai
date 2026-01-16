'use client';

import { Bell, Home, LogOut, Settings, Target, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';

import { Button, Badge } from '@todoai/ui';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';

const navItems = [
  { href: '/dashboard' as Route, label: 'Dashboard', icon: Home },
  { href: '/today' as Route, label: 'Today', icon: Calendar },
  { href: '/goals' as Route, label: 'Goals', icon: Target },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { data: unreadCount } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: () => api.get<{ count: number }>('/notifications/unread-count').then((r) => r.data.count),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={"/dashboard" as Route} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-semibold text-white">TodoAI</span>
          </Link>

          {/* Nav items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={isActive ? '' : 'text-slate-400 hover:text-white'}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
              {unreadCount && unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>

            {/* Settings */}
            <Link href={"/settings" as Route}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            {/* User menu */}
            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

