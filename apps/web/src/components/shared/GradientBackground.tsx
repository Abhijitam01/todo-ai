'use client';

interface GradientBackgroundProps {
  variant?: 'default' | 'auth' | 'dashboard';
  className?: string;
}

export function GradientBackground({ variant = 'default', className = '' }: GradientBackgroundProps) {
  if (variant === 'auth') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div 
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }}
        />
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div 
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}

