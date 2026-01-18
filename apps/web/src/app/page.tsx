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
  Users,
  Layout,
  Clock,
  Shield,
  BarChart3
} from 'lucide-react';

import { Button } from '@todoai/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">TodoAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
              <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white text-slate-950 hover:bg-slate-200 font-semibold px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-medium tracking-wider uppercase text-cyan-400">New: AI Mentor v2.0 is here</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
              Achieve your goals with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
              TodoAI isn't just a task manager. It's your personal AI strategist that breaks down complex goals into actionable daily steps and mentors you to success.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg font-semibold rounded-2xl shadow-2xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95">
                  Start Achieving Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="h-14 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white text-lg font-semibold rounded-2xl backdrop-blur-sm transition-all">
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-xl text-white/40">
                <Zap className="w-6 h-6" /> FAST.CO
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-white/40">
                <Brain className="w-6 h-6" /> NEURAL
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-white/40">
                <Target className="w-6 h-6" /> AIM.IO
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="mt-24 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-[#0f172a] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
              {/* Mockup Header */}
              <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-6 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="mx-auto bg-white/5 px-4 py-1 rounded-md text-[10px] text-slate-500 font-mono">
                  app.todoai.com/dashboard
                </div>
              </div>
              {/* Mockup Content */}
              <div className="p-8 grid grid-cols-12 gap-8">
                <div className="col-span-3 space-y-6">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-8 bg-white/5 rounded-lg flex items-center px-3 gap-2">
                        <div className="w-4 h-4 rounded bg-white/10" />
                        <div className="h-2 w-16 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-9 space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-white/10 rounded" />
                      <div className="h-3 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-10 w-10 bg-cyan-500/20 rounded-xl border border-cyan-500/20" />
                      <div className="h-10 w-10 bg-blue-500/20 rounded-xl border border-blue-500/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5 p-4 space-y-4">
                        <div className="w-8 h-8 rounded-lg bg-white/10" />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-white/10 rounded" />
                          <div className="h-2 w-2/3 bg-white/5 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-48 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-white/10 rounded" />
                        <div className="h-2 w-48 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-white/5 rounded" />
                      <div className="h-2 w-full bg-white/5 rounded" />
                      <div className="h-2 w-3/4 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Engineered for <span className="text-cyan-400">Peak Performance</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We've combined behavioral science with cutting-edge AI to create the ultimate goal achievement system.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI Plan Generation"
              description="Our neural engine analyzes your goals and crafts a multi-stage roadmap with precise milestones."
              color="cyan"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Dynamic Daily Tasks"
              description="Adaptive scheduling that learns from your pace and optimizes your daily workload for maximum output."
              color="blue"
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Proactive Mentorship"
              description="Get real-time feedback and psychological nudges when you need them most to keep your momentum."
              color="purple"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Advanced Analytics"
              description="Deep insights into your productivity patterns, identifying bottlenecks and celebrating breakthroughs."
              color="orange"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Privacy First"
              description="Your data is encrypted and your goals are private. We use enterprise-grade security for your peace of mind."
              color="emerald"
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Smart Reminders"
              description="Intelligent notifications that respect your focus time and only reach out when it's most effective."
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* How It Works - Visual Timeline */}
      <section id="how-it-works" className="py-32 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The Path to Mastery
            </h2>
            <p className="text-xl text-slate-400">
              Four steps to transform your vision into reality.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 hidden lg:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <ProcessStep
                number="01"
                title="Define Your Vision"
                description="Input your most ambitious goals. Our AI understands context and complexity."
                icon={<Target className="w-6 h-6" />}
              />
              <ProcessStep
                number="02"
                title="AI Architecture"
                description="Watch as the system builds a comprehensive strategy tailored to your life."
                icon={<Layout className="w-6 h-6" />}
              />
              <ProcessStep
                number="03"
                title="Daily Execution"
                description="Focus on bite-sized, high-impact tasks delivered fresh every morning."
                icon={<CheckCircle2 className="w-6 h-6" />}
              />
              <ProcessStep
                number="04"
                title="Continuous Growth"
                description="Receive weekly AI audits and mentorship to refine your approach."
                icon={<TrendingUp className="w-6 h-6" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by High Achievers
            </h2>
            <p className="text-slate-400 text-lg">
              Join 10,000+ professionals, students, and creators.
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
      <section className="py-32 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-cyan-500/20">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                Ready to change your life?
              </h2>
              <p className="text-xl text-cyan-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                Stop managing tasks and start achieving goals. Join TodoAI today and experience the future of productivity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup">
                  <Button size="lg" className="h-16 px-12 bg-white text-blue-700 hover:bg-cyan-50 text-xl font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                    Get Started Now
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-white/80 font-medium">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-slate-800 flex items-center justify-center text-xs">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span>Join 10k+ users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl text-white">TodoAI</span>
              </div>
              <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
                Empowering individuals to achieve their most ambitious goals through the power of artificial intelligence and behavioral science.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer" />
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Product</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-500">
              © 2026 TodoAI Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>All systems operational</span>
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
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
    rose: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="group relative p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-lg">{description}</p>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative z-10 text-center lg:text-left">
      <div className="flex flex-col items-center lg:items-start">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative group">
          <div className="absolute -inset-2 bg-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative text-cyan-400">
            {icon}
          </div>
          <div className="absolute -top-4 -right-4 text-4xl font-black text-white/5 select-none">
            {number}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-400 text-lg leading-relaxed">{description}</p>
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
    <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-10 hover:bg-white/[0.05] transition-all duration-500">
      <div className="flex items-center gap-1 mb-8">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p className="text-xl text-slate-300 mb-10 leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
          {avatar}
        </div>
        <div>
          <p className="font-bold text-white text-lg">{author}</p>
          <p className="text-slate-500 font-medium">{role}</p>
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

