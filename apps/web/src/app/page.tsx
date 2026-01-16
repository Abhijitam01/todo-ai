'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { 
  Target, 
  Brain, 
  Zap, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Star,
  MessageSquare,
  Users
} from 'lucide-react';

import { Button } from '@todoai/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">TodoAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">AI-Powered Goal Achievement</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
              Turn Your Dreams Into
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Daily Progress
              </span>
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-slate-300 max-w-2xl mx-auto">
              TodoAI transforms ambitious goals into achievable daily tasks with AI mentorship. 
              Stop procrastinating, start achieving.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg" className="px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25">
                  Start Free Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:text-white hover:border-slate-600">
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl shadow-cyan-500/10 bg-slate-900/50 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <Target className="w-16 h-16 text-cyan-400 mx-auto" />
                  <p className="text-slate-400 text-lg">Beautiful Dashboard Coming Into View</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-5xl mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powered by AI, designed for achievers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI Plan Generation"
              description="Set any goal and watch AI break it down into a structured, actionable plan with weekly milestones."
              gradient="from-cyan-500 to-blue-600"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Smart Daily Tasks"
              description="Get 3-5 personalized tasks every morning, automatically generated based on your current progress."
              gradient="from-blue-500 to-purple-600"
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8" />}
              title="AI Mentorship"
              description="Receive weekly feedback analyzing your patterns, celebrating wins, and offering guidance."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Streak Tracking"
              description="Build momentum with visual streak tracking that motivates consistency and celebrates progress."
              gradient="from-orange-500 to-red-600"
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Calendar View"
              description="Visualize your journey with a beautiful calendar showing tasks, milestones, and achievements."
              gradient="from-green-500 to-emerald-600"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Quality Evaluation"
              description="AI evaluates completed tasks and provides constructive feedback to improve your execution."
              gradient="from-yellow-500 to-orange-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-5xl mb-4">
              How TodoAI Works
            </h2>
            <p className="text-xl text-slate-400">
              Four simple steps to achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProcessStep
              number={1}
              title="Set Your Goal"
              description="Define what you want to achieve and your timeline. Be ambitious!"
              icon={<Target className="w-6 h-6" />}
            />
            <ProcessStep
              number={2}
              title="AI Plans"
              description="Our AI generates a comprehensive plan with milestones and activities."
              icon={<Brain className="w-6 h-6" />}
            />
            <ProcessStep
              number={3}
              title="Daily Tasks"
              description="Execute bite-sized tasks each day that move you closer to your goal."
              icon={<CheckCircle2 className="w-6 h-6" />}
            />
            <ProcessStep
              number={4}
              title="Track Progress"
              description="Monitor streaks, receive AI feedback, and watch yourself grow."
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Loved by Achievers Worldwide
            </h2>
            <p className="text-slate-400 text-lg">
              Join thousands who are turning their dreams into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            Ready to Achieve Your Goals?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join TodoAI today and transform your ambitions into daily achievements with AI-powered guidance.
          </p>
          <Link href="/signup">
            <Button size="lg" className="px-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25">
              Start Your Journey Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-800/50 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">TodoAI</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Transform your goals into actionable daily tasks with AI-powered mentorship and tracking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href={"/about" as Route} className="hover:text-white transition">About</Link></li>
                <li><Link href={"/privacy" as Route} className="hover:text-white transition">Privacy</Link></li>
                <li><Link href={"/terms" as Route} className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2026 TodoAI. Built for achievers.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">Join 10,000+ users achieving their goals</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative rounded-2xl bg-slate-900/50 p-8 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/25">
            {number}
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-cyan-400">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  avatar,
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 hover:border-slate-700/50 transition">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-slate-300 mb-6 leading-relaxed">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote: "TodoAI helped me learn Python in 3 months. The daily tasks kept me consistent, and the AI mentorship was surprisingly insightful!",
    author: "Sarah Chen",
    role: "Software Developer",
    avatar: "SC"
  },
  {
    quote: "I've tried countless todo apps, but TodoAI is different. It actually helps you achieve big goals, not just manage tasks.",
    author: "Marcus Johnson",
    role: "Entrepreneur",
    avatar: "MJ"
  },
  {
    quote: "The streak feature is addictive in the best way. I'm on day 127 and have completed 2 major goals. This app works!",
    author: "Emma Rodriguez",
    role: "Writer",
    avatar: "ER"
  }
];

