# 🎨 Design System & Component Guide

Trudoo AI features a modern, clean design inspired by high-end SaaS products, emphasizing AI-powered features and user engagement.

## 🌈 Design Overview

- **Dark Mode First**: Optimized for long-term use with reduced eye strain.
- **Glass Morphism**: Subtle transparency and blur effects for depth.
- **Gradient Accents**: Primary actions use cyan-to-blue gradients; AI features use purple-to-pink.
- **Smooth Animations**: Carefully crafted transitions (fade-in, slide-up, scale-in).

### Color Palette

| Category | Colors | Usage |
|----------|--------|-------|
| **Primary** | Cyan-500, Blue-600 | Primary actions, AI features |
| **AI Special** | Purple-500, Pink-600 | AI mentorship, special features |
| **Status** | Green-500, Amber-500, Red-500 | Success, Pending, Error |
| **Background** | Slate-950, Slate-900 | App background, Cards |
| **Text** | White, Slate-300, Slate-400 | Headings, Body, Secondary |

---

## 🧩 Component Library

### Shared Components

#### `AnimatedCounter`
Counts up to a target value with easing.
```tsx
<AnimatedCounter value={87} suffix="%" duration={1000} />
```

#### `ProgressRing`
Circular progress indicator.
```tsx
<ProgressRing progress={75} size={120} color="#06b6d4" />
```

#### `Skeleton`
Loading placeholders with shimmer effects.
```tsx
<SkeletonCard />
<SkeletonTable />
```

#### `Spinner`
Modern loading spinners.
```tsx
<Spinner size="lg" variant="gradient" />
<FullPageSpinner message="Loading..." />
```

### Layout Components

- **`Sidebar`**: Collapsible navigation (256px ↔ 80px) with active route highlighting.
- **`AuthLayout`**: Split-screen design for login and signup pages.
- **`GradientBackground`**: Animated gradient orbs for immersive backgrounds.

---

## 📐 Styling Patterns

### Glass Cards
```tsx
<Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
  <CardContent>...</CardContent>
</Card>
```

### Gradient Buttons
```tsx
<Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25">
  Action
</Button>
```

---

## 📱 Responsive Design

- **Mobile (< 640px)**: Sidebar hidden (use mobile nav), cards stack vertically.
- **Tablet (640px - 1024px)**: 2-column layouts for stats and grids.
- **Desktop (> 1024px)**: Full layouts with 3+ columns.

---

## 🚀 Quick Start for Designers

1. **Start Dev Server**: `pnpm dev`
2. **Visit Pages**:
   - Landing: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - Today: http://localhost:3000/today
3. **Key Files**:
   - `apps/web/src/app/globals.css`: Global styles & animations.
   - `apps/web/src/components/shared/`: Reusable UI components.

For a full list of components and detailed API usage, refer to the source code in `apps/web/src/components`.
