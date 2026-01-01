'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toast } from '@todoai/ui';
import { type CreateGoalInput } from '@todoai/types';

import { api } from '@/lib/api';
import { GoalForm } from '@/components/goals';
import { PageHeader } from '@/components/shared';

export default function NewGoalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CreateGoalInput) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/goals', data);
      toast({
        title: 'Goal created!',
        description: 'AI is now generating your personalized plan...',
        variant: 'success',
      });
      router.push(`/goal/${response.data.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create goal';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageHeader
        title="Create a New Goal"
        description="Define your goal and let AI create a structured plan for you"
      />

      <GoalForm
        onSubmit={onSubmit}
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

