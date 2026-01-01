import Link from 'next/link';

import { Button } from '@todoai/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Transform Your Goals Into
              <span className="block text-primary">Daily Action</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-slate-300">
              TodoAI is your AI-powered mentor that turns ambitious goals into
              structured plans and executable daily tasks. Stop planning, start achieving.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="lg" className="text-white hover:text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <FeatureCard
                title="AI-Powered Planning"
                description="Set a goal, and our AI creates a comprehensive plan tailored to your timeline and preferences."
                icon="🎯"
              />
              <FeatureCard
                title="Daily Mentorship"
                description="Receive personalized guidance and encouragement based on your progress and patterns."
                icon="🧠"
              />
              <FeatureCard
                title="Streak Tracking"
                description="Build consistency with streak tracking that celebrates your wins and keeps you accountable."
                icon="🔥"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="py-24 bg-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How TodoAI Works
            </h2>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-8">
              <Step
                number={1}
                title="Define Your Goal"
                description="Tell us what you want to achieve. 'Learn Python in 90 days', 'Run a marathon', 'Launch my startup'."
              />
              <Step
                number={2}
                title="AI Creates Your Plan"
                description="Our AI breaks down your goal into weekly milestones and generates a structured approach."
              />
              <Step
                number={3}
                title="Execute Daily Tasks"
                description="Each day, you get a curated list of tasks that move you closer to your goal."
              />
              <Step
                number={4}
                title="Get AI Mentorship"
                description="Receive personalized feedback, adjustments, and encouragement based on your progress."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">
              © 2024 TodoAI. Built for achievers.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-800/50 p-8 ring-1 ring-slate-700">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-slate-400">{description}</p>
      </div>
    </div>
  );
}

