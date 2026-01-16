'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, toast } from '@todoai/ui';
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
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white">Welcome back</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Sign in to continue to TodoAI
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailOrPhone" className="text-slate-200">
              Email or Phone
            </Label>
            <Input
              id="emailOrPhone"
              type="text"
              placeholder="you@example.com"
              className="bg-slate-900 border-slate-700 text-white"
              {...register('emailOrPhone')}
            />
            {errors.emailOrPhone && (
              <p className="text-sm text-red-400">{errors.emailOrPhone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="bg-slate-900 border-slate-700 text-white"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-sm text-center text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

