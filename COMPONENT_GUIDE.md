# TodoAI Component Guide

## 🏗️ Component Architecture

This guide shows how components are structured and can be reused across the application.

---

## 📦 Component Categories

### 1. Layout Components

#### `Sidebar` (navigation/Sidebar.tsx)
```tsx
import { Sidebar } from '@/components/navigation';

// Used in dashboard layout
<Sidebar />
```

**Features**:
- Collapsible (64px ↔ 20px)
- Active route highlighting
- User profile section
- AI credits widget
- Quick actions

**Props**: None (uses hooks internally)

---

#### `AuthLayout` ((auth)/layout.tsx)
```tsx
// Automatic layout for all /login and /signup pages
```

**Features**:
- Split-screen design (desktop)
- Branding section with features
- Form section
- Mobile responsive

---

### 2. Shared Components

#### `AnimatedCounter`
```tsx
import { AnimatedCounter } from '@/components/shared';

<AnimatedCounter 
  value={87} 
  suffix="%" 
  duration={1000}
  className="text-4xl font-bold"
/>
```

**Props**:
- `value`: Target number to count to
- `duration?`: Animation duration (default: 1000ms)
- `suffix?`: Text after number (e.g., "%", "days")
- `prefix?`: Text before number (e.g., "$", "~")
- `className?`: Custom styles

---

#### `ProgressRing`
```tsx
import { ProgressRing } from '@/components/shared';

<ProgressRing 
  progress={75}
  size={120}
  color="#06b6d4"
  strokeWidth={8}
  showPercentage={true}
/>
```

**Props**:
- `progress`: 0-100
- `size?`: Diameter in pixels (default: 120)
- `strokeWidth?`: Ring thickness (default: 8)
- `color?`: Ring color (default: cyan-500)
- `backgroundColor?`: Track color (default: slate-800)
- `showPercentage?`: Show text in center (default: true)

---

#### `Skeleton`
```tsx
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/shared';

// Simple skeleton
<Skeleton width={200} height={24} />

// Multiple skeletons
<Skeleton count={3} height={16} />

// Variants
<Skeleton variant="circular" width={40} height={40} />

// Pre-built
<SkeletonCard />
<SkeletonTable />
```

**Props**:
- `width?`: Width in px or string
- `height?`: Height in px or string
- `variant?`: 'text' | 'circular' | 'rectangular'
- `count?`: Number of skeletons to render
- `className?`: Custom styles

---

#### `Spinner`
```tsx
import { Spinner, FullPageSpinner } from '@/components/shared';

// Basic spinner
<Spinner size="md" />

// Gradient spinner
<Spinner size="lg" variant="gradient" />

// Full page loader
<FullPageSpinner message="Loading your goals..." />
```

**Props**:
- `size?`: 'sm' | 'md' | 'lg' | 'xl'
- `variant?`: 'default' | 'gradient'
- `className?`: Custom styles

---

#### `GradientBackground`
```tsx
import { GradientBackground } from '@/components/shared';

<div className="relative">
  <GradientBackground variant="auth" />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>
```

**Props**:
- `variant?`: 'default' | 'auth' | 'dashboard'
- `className?`: Custom styles

---

#### `EmptyState`
```tsx
import { EmptyState } from '@/components/shared';

<EmptyState
  title="No goals yet"
  description="Create your first goal to get started"
  action={{
    label: 'Create Goal',
    onClick: () => router.push('/goal/new')
  }}
/>
```

**Props**:
- `title`: Heading text
- `description?`: Subtext
- `action?`: Button config { label, onClick }

---

#### `LoadingState`
```tsx
import { LoadingState } from '@/components/shared';

<LoadingState message="Loading tasks..." />
```

**Props**:
- `message?`: Loading text

---

#### `ErrorState`
```tsx
import { ErrorState } from '@/components/shared';

<ErrorState
  error={error}
  onRetry={() => refetch()}
/>
```

**Props**:
- `error`: Error object
- `onRetry?`: Retry callback

---

### 3. Page-Specific Components

#### `GoalCard` (goals/GoalCard.tsx)
```tsx
import { GoalCard } from '@/components/goals';

<GoalCard goal={goalData} />
```

Displays a goal with:
- Title and description
- Progress indicator
- Status badge
- Due date
- Click to view details

---

#### `TaskList` (tasks/TaskList.tsx)
```tsx
import { TaskList } from '@/components/tasks';

<TaskList
  tasks={tasks}
  onTaskAction={(action, taskId) => {
    // Handle start, complete, skip
  }}
/>
```

Displays tasks with:
- Task details
- Status indicator
- Action buttons
- Priority marker

---

## 🎨 Styling Patterns

### Gradient Buttons
```tsx
<Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">
  Action
</Button>
```

### Glass Cards
```tsx
<Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
  <CardContent>...</CardContent>
</Card>
```

### Stat Cards with Gradients
```tsx
<Card className="border-slate-800/50 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all group">
  <CardContent className="py-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">Label</p>
        <p className="text-2xl font-bold text-white">Value</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
        <Icon />
      </div>
    </div>
  </CardContent>
</Card>
```

### Icon-Prefixed Inputs
```tsx
<div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
  <Input
    className="pl-11 bg-slate-900/50 border-slate-800 text-white focus:border-cyan-500"
    placeholder="Email"
  />
</div>
```

### Section Headers
```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-white mb-2">Page Title</h1>
    <p className="text-slate-400">Description text</p>
  </div>
  <Button>Action</Button>
</div>
```

---

## 📐 Layout Patterns

### Two-Column Dashboard
```tsx
<div className="grid gap-6 lg:grid-cols-3">
  {/* Main content - 2 columns */}
  <div className="lg:col-span-2 space-y-6">
    {/* Cards */}
  </div>
  
  {/* Sidebar - 1 column */}
  <div className="space-y-6">
    {/* Quick actions, widgets */}
  </div>
</div>
```

### Responsive Grid
```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Stats Row
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatCard />
  <StatCard />
  <StatCard />
  <StatCard />
</div>
```

---

## 🎯 Common Patterns

### Page Structure
```tsx
export default function PageName() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Title</h1>
          <p className="text-slate-400">Description</p>
        </div>
        <Button>Action</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Stat cards */}
      </div>

      {/* Main content */}
      <Card>
        {/* Content */}
      </Card>
    </div>
  );
}
```

### Loading Pattern
```tsx
if (isLoading) {
  return <LoadingState message="Loading..." />;
}

if (error) {
  return <ErrorState error={error} onRetry={refetch} />;
}

if (!data || data.length === 0) {
  return <EmptyState title="No data" action={{ ... }} />;
}

return <YourContent data={data} />;
```

### Filter Bar
```tsx
<Card>
  <CardContent className="py-4">
    <div className="flex items-center gap-4">
      <Filter className="w-4 h-4 text-slate-400" />
      <div className="flex gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          All (12)
        </FilterButton>
        <FilterButton active={filter === 'active'} onClick={() => setFilter('active')}>
          Active (5)
        </FilterButton>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 🎨 Color Usage Guide

### When to Use Each Color

#### Cyan/Blue Gradient
- Primary actions (Create, Save, Submit)
- Active states
- Links and navigation
- Progress indicators

#### Purple/Pink Gradient
- AI features
- Special features
- Premium/Pro indicators
- Mentorship-related items

#### Green Gradient
- Success states
- Completed items
- Positive metrics
- "Go" actions

#### Amber/Orange
- Warning states
- Pending items
- Streaks and achievements
- Attention-needed items

#### Red
- Error states
- Destructive actions
- Missed/overdue items
- Delete buttons

#### Slate Shades
- Backgrounds (950, 900)
- Borders (800, 700)
- Text (300, 400, 500)
- Disabled states

---

## 🔧 Utility Classes

### Custom Classes (in globals.css)

```css
/* Animations */
.animate-fade-in       /* Fade in on mount */
.animate-slide-up      /* Slide up + fade */
.animate-scale-in      /* Scale up + fade */
.animate-shimmer       /* Loading shimmer */

/* Effects */
.glass                 /* Glass morphism */
.glass-hover          /* Glass + hover */
.gradient-text        /* Gradient text */
.card-hover           /* Card hover effect */
.skeleton             /* Loading skeleton */

/* Focus */
.focus-ring           /* Custom focus ring */
```

---

## 📱 Responsive Utilities

### Show/Hide by Breakpoint
```tsx
className="hidden lg:block"           // Desktop only
className="block lg:hidden"           // Mobile only
className="hidden md:block lg:hidden" // Tablet only
```

### Responsive Sizing
```tsx
className="text-2xl md:text-3xl lg:text-4xl"
className="p-4 md:p-6 lg:p-8"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🎯 Best Practices

### 1. Always Use Space-Y for Vertical Stacking
```tsx
<div className="space-y-8">  {/* Not margin-bottom on each child */}
  <Section1 />
  <Section2 />
  <Section3 />
</div>
```

### 2. Use Gap for Grids
```tsx
<div className="grid gap-6 md:grid-cols-2">  {/* Not margins */}
  <Card />
  <Card />
</div>
```

### 3. Consistent Icon Sizing
```tsx
<Icon className="w-5 h-5" />  {/* Standard */}
<Icon className="w-4 h-4" />  {/* Small */}
<Icon className="w-6 h-6" />  {/* Large */}
```

### 4. Always Add Transitions
```tsx
<div className="transition-all duration-300">
  {/* Animated element */}
</div>
```

### 5. Group Related Classes
```tsx
// Good
className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"

// Bad (harder to read)
className="transition bg-slate-900 flex hover:bg-slate-800 text-white rounded-lg items-center px-4 gap-2 py-2"
```

---

## 🚀 Quick Start Templates

### New Page Template
```tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button } from '@todoai/ui';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared';
import { api } from '@/lib/api';

export default function NewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['key'],
    queryFn: () => api.get('/endpoint').then(r => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length) return <EmptyState title="No data" />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Page Title</h1>
          <p className="text-slate-400">Description</p>
        </div>
        <Button>Action</Button>
      </div>

      {/* Your content */}
    </div>
  );
}
```

### New Component Template
```tsx
'use client';

interface MyComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
  className?: string;
}

export function MyComponent({ 
  title, 
  description, 
  onAction,
  className = '' 
}: MyComponentProps) {
  return (
    <div className={`p-4 rounded-lg bg-slate-900/50 border border-slate-800/50 ${className}`}>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      {onAction && (
        <button onClick={onAction} className="mt-2 text-cyan-400 hover:text-cyan-300">
          Action
        </button>
      )}
    </div>
  );
}
```

---

## 📚 Further Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/
- **shadcn/ui**: https://ui.shadcn.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Design System**: See `/DESIGN.md`

---

**Happy building! 🎨✨**

