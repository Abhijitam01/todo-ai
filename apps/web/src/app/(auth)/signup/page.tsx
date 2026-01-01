'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, toast } from '@todoai/ui';
import { createUserSchema, type CreateUserInput } from '@todoai/types';

import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      const response = await api.post('/auth/register', data);
      setAuth(response.data.user, response.data.tokens);
      toast({ title: 'Welcome to TodoAI!', variant: 'success' });
      router.push('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast({ title: 'Registration failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white">Create an account</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Start achieving your goals with AI mentorship
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-200">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="bg-slate-900 border-slate-700 text-white"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-slate-900 border-slate-700 text-white"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-slate-200">
              Phone Number (optional)
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="bg-slate-900 border-slate-700 text-white"
              {...register('phoneNumber')}
            />
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
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
          <p className="text-sm text-center text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

