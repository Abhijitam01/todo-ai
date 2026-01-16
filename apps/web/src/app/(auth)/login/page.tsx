'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react';

import { Button, Input, Label, toast } from '@todoai/ui';
import { loginSchema, type LoginInput } from '@todoai/types';

import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await api.post<{ user: { id: string; email: string; name: string }; tokens: { accessToken: string; refreshToken: string; expiresIn: number } }>('/auth/login', data);
      setAuth(response.data.user, response.data.tokens);
      toast({ title: 'Welcome back!', variant: 'success' });
      router.push('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast({ title: 'Login failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="text-slate-400">Sign in to continue your journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailOrPhone" className="text-slate-200 text-sm font-medium">
              Email or Phone
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="you@example.com"
                className="pl-11 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12"
                {...register('emailOrPhone')}
              />
            </div>
            {errors.emailOrPhone && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400" />
                {errors.emailOrPhone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-200 text-sm font-medium">
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-11 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400" />
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-cyan-500/25 transition-all" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-950 text-slate-500">New to TodoAI?</span>
          </div>
        </div>

        <Link href="/signup" className="block">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-900/50 transition-all"
          >
            Create an account
          </Button>
        </Link>
      </form>

      <p className="text-center text-sm text-slate-500">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-slate-400 hover:text-white transition">
          Terms
        </Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-slate-400 hover:text-white transition">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

