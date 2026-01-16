'use client';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient';
  className?: string;
}

export function Spinner({ size = 'md', variant = 'default', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  if (variant === 'gradient') {
    return (
      <div className={`relative ${className}`}>
        <div className={`${sizeClasses[size]} border-slate-800 border-t-cyan-500 rounded-full animate-spin`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full animate-pulse`} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} border-slate-700 border-t-cyan-500 rounded-full animate-spin ${className}`}
    />
  );
}

export function FullPageSpinner({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <Spinner variant="gradient" size="xl" />
      {message && (
        <p className="mt-4 text-slate-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}

