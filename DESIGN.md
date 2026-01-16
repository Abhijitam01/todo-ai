# TodoAI Design System Documentation

## 🎨 Design Overview

TodoAI features a modern, clean design inspired by Todoist but with unique touches that emphasize AI-powered features and user engagement. The design focuses on:

- **Dark Mode First**: Optimized for long-term use with reduced eye strain
- **Gradient Accents**: Cyan-to-blue gradients for primary actions and AI features
- **Glass Morphism**: Subtle transparency and blur effects for depth
- **Smooth Animations**: Carefully crafted transitions for a polished feel
- **Accessibility**: High contrast, clear focus states, and semantic HTML

---

## 🌈 Color Palette

### Primary Colors
```css
Cyan-500: #06b6d4    /* Primary actions, AI features */
Blue-600: #2563eb    /* Secondary accents */
Purple-500: #a855f7  /* AI mentorship, special features */
```

### Status Colors
```css
Green-500: #22c55e   /* Success, completed tasks */
Amber-500: #f59e0b   /* Warning, pending tasks */
Red-500: #ef4444     /* Error, missed tasks */
Orange-500: #f97316  /* Streaks, achievements */
```

### Background & Surface
```css
Slate-950: #020617   /* App background */
Slate-900: #0f172a   /* Card backgrounds */
Slate-800: #1e293b   /* Borders, dividers */
Slate-700: #334155   /* Hover states */
```

### Text
```css
White: #ffffff       /* Headings, important text */
Slate-300: #cbd5e1   /* Body text */
Slate-400: #94a3b8   /* Secondary text */
Slate-500: #64748b   /* Muted text */
```

---

## 🧩 Component Library

### Landing Page
- **Hero Section**: Full-width gradient background with animated orbs
- **Feature Cards**: Hover effects with gradient icons
- **Process Steps**: Numbered circular badges with connecting flow
- **Testimonials**: User avatars with ratings
- **Sticky Navigation**: Transparent navbar with backdrop blur

### Authentication
- **Split Layout**: Branding on left, form on right (desktop)
- **Gradient Icons**: Consistent with brand identity
- **Input Fields**: Icon-prefixed with focus states
- **Benefits List**: Checkmark items highlighting features
- **Mobile Optimized**: Stacked layout with logo at top

### Dashboard Layout
- **Collapsible Sidebar**: 
  - Expanded: 256px (w-64)
  - Collapsed: 80px (w-20)
  - Smooth transitions
  - Quick actions and AI status
  
- **Main Content**: 
  - Max width: 1280px (max-w-7xl)
  - Responsive padding
  - Smooth animations on page load

### Cards & Stats
- **Gradient Stat Cards**: 
  - Background gradients matching icon color
  - Hover scale effect (scale-105)
  - Shadow on hover
  
- **Progress Cards**:
  - Large progress bars (h-3)
  - Percentage display
  - Section counts

- **Action Cards**:
  - Quick action buttons
  - Icon + text layout
  - Hover state color changes

### Task Management
- **Task Sections**: 
  - Grouped by status (Pending, In Progress, Completed)
  - Gradient backgrounds per section
  - Count badges
  
- **Task Cards**:
  - Left border for status
  - Priority indicators
  - Action buttons (Start, Complete, Skip)

### Goals
- **Goal Cards**:
  - Progress ring visualization
  - Status badges
  - Milestone tracking
  
- **Filter Bar**:
  - Pill-style buttons
  - Active state with gradient
  - Count indicators

---

## ✨ Animations & Transitions

### Page Transitions
```css
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
```

### Hover Effects
- Cards: `hover:scale-[1.02]` + shadow
- Buttons: Color transitions (200ms)
- Icons: Scale on parent hover

### Loading States
- Skeleton shimmer effect
- Gradient spinner with pulsing center
- Smooth progress bar transitions

---

## 🎯 Key Design Patterns

### 1. Gradient System
Primary actions use cyan-to-blue gradients:
```tsx
className="bg-gradient-to-r from-cyan-500 to-blue-600"
```

AI features use purple-to-pink:
```tsx
className="bg-gradient-to-br from-purple-500 to-pink-600"
```

### 2. Glass Morphism
Cards and overlays use backdrop blur:
```tsx
className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50"
```

### 3. Icon System
- Lucide React icons throughout
- Consistent sizing (w-5 h-5 for normal, w-4 h-4 for small)
- Colored to match section theme

### 4. Spacing Scale
- Section gaps: `space-y-8`
- Card gaps: `gap-6`
- Component gaps: `gap-4`
- Inner spacing: `p-6` for cards, `p-4` for compact

### 5. Typography
```tsx
Headings: text-3xl font-bold text-white
Subheadings: text-xl font-semibold text-white
Body: text-slate-300
Secondary: text-slate-400
Small: text-sm text-slate-400
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Grid Systems
- Stats: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Goals: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Dashboard: `lg:grid-cols-3` for sidebar layout

### Mobile Adjustments
- Sidebar: Hidden on mobile (use mobile nav)
- Cards: Stack vertically
- Stats: 2 columns on tablet, 1 on mobile
- Text: Smaller headings on mobile

---

## 🌟 Special Components

### 1. Animated Counter
```tsx
<AnimatedCounter value={87} suffix="%" duration={1000} />
```

### 2. Progress Ring
```tsx
<ProgressRing progress={75} size={120} color="#06b6d4" />
```

### 3. Skeleton Loaders
```tsx
<Skeleton width={200} height={24} />
<SkeletonCard />
<SkeletonTable />
```

### 4. Gradient Background
```tsx
<GradientBackground variant="auth" />
```

### 5. Spinners
```tsx
<Spinner size="lg" variant="gradient" />
<FullPageSpinner message="Loading..." />
```

---

## 🎨 Design Principles

1. **Consistency**: Reuse patterns across all pages
2. **Clarity**: Clear hierarchy and purposeful color
3. **Feedback**: Visual response to all interactions
4. **Performance**: Smooth 60fps animations
5. **Accessibility**: WCAG AA compliant, keyboard navigable
6. **Progressive**: Enhance with JavaScript, work without
7. **Mobile First**: Design for smallest screen first

---

## 🚀 Implementation Notes

### CSS Architecture
- Tailwind CSS for utility-first styling
- Custom CSS for complex animations
- CSS variables for theme values
- Layered approach (base, components, utilities)

### Performance
- Lazy load components where possible
- Optimize images and assets
- Use CSS transforms for animations (GPU accelerated)
- Minimize repaints with will-change

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS custom properties
- Backdrop filter (with fallbacks)

---

## 📚 Resources

### Fonts
- Inter: Primary UI font
- JetBrains Mono: Code/monospace font

### Icons
- Lucide React: https://lucide.dev/

### Colors
- Tailwind Slate palette
- Custom gradients for brand

### Inspiration
- Todoist: Clean task management
- Linear: Modern dev tools
- Vercel: Minimalist design
- Stripe: Beautiful gradients

---

## 🎯 Future Enhancements

1. **Dark/Light Mode Toggle**: Currently dark-first
2. **Theme Customization**: User-selectable color schemes
3. **Animation Preferences**: Respect `prefers-reduced-motion`
4. **Custom Illustrations**: Replace placeholder content
5. **Micro-interactions**: More delightful details
6. **Sound Effects**: Optional audio feedback
7. **Achievement Badges**: Visual rewards system
8. **Data Visualizations**: Charts for progress tracking

---

Built with ❤️ using modern web technologies and design best practices.

