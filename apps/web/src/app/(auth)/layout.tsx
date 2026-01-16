import Link from 'next/link';
import { Target } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">TodoAI</span>
          </Link>
          
          <h1 className="text-5xl font-bold text-white mb-6">
            Turn Your Goals Into
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Daily Progress
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-md">
            AI-powered mentorship that transforms ambitious goals into achievable daily tasks.
          </p>
          
          <div className="space-y-6">
            <FeatureItem text="AI generates personalized plans" />
            <FeatureItem text="Daily tasks tailored to your progress" />
            <FeatureItem text="Weekly mentorship & feedback" />
            <FeatureItem text="Track streaks & build consistency" />
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 px-6 py-12 lg:px-12">
        {/* Mobile Logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">TodoAI</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-slate-300 text-lg">{text}</span>
    </div>
  );
}

