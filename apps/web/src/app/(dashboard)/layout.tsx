'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/stores/auth.store';
import { useWebSocket } from '@/hooks/use-websocket';
import { DashboardNav } from '@/components/dashboard/nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Initialize WebSocket connection
  useWebSocket();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

