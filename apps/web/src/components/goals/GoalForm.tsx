'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@todoai/ui';
import {
  createGoalSchema,
  type CreateGoalInput,
  type GoalCategory,
} from '@todoai/types';

import { FormField } from '../shared/FormField';

const categories: { value: GoalCategory; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'learning', label: 'Learning' },
  { value: 'career', label: 'Career' },
  { value: 'finance', label: 'Finance' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'other', label: 'Other' },
];

export interface GoalFormProps {
  initialData?: Partial<CreateGoalInput>;
  onSubmit: (data: CreateGoalInput) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export function GoalForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}: GoalFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateGoalInput>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      category: 'other',
      ...initialData,
    },
  });

  const category = watch('category');

  return (
    <Card className={`border-slate-700 bg-slate-800/50 ${className || ''}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-white">Goal Details</CardTitle>
          <CardDescription className="text-slate-400">
            Be specific about what you want to achieve
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            label="What do you want to achieve?"
            error={errors.title?.message}
            required
          >
            <Input
              placeholder="e.g., Learn Python programming in 90 days"
              className="bg-slate-900 border-slate-700 text-white"
              {...register('title')}
            />
          </FormField>

          <FormField label="Description (optional)">
            <Textarea
              rows={4}
              placeholder="Add more context about your goal, your current level, constraints, etc."
              className="bg-slate-900 border-slate-700 text-white"
              {...register('description')}
            />
          </FormField>

          <FormField label="Category">
            <Select
              value={category}
              onValueChange={(v) => setValue('category', v as GoalCategory)}
            >
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                    className="text-white hover:bg-slate-700"
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Target Date (optional)">
              <Input
                type="date"
                className="bg-slate-900 border-slate-700 text-white"
                {...register('targetDate')}
              />
            </FormField>
            <FormField label="Duration (days)">
              <Input
                type="number"
                placeholder="90"
                className="bg-slate-900 border-slate-700 text-white"
                {...register('durationDays', { valueAsNumber: true })}
              />
            </FormField>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Goal'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

