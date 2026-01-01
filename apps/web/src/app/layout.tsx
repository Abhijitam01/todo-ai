import '@todoai/ui/globals.css';
import './globals.css';

import { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'TodoAI - AI-Powered Goal Achievement',
    template: '%s | TodoAI',
  },
  description: 'Transform your goals into actionable daily tasks with AI-powered planning and mentorship.',
  keywords: ['todo', 'ai', 'goals', 'productivity', 'task management', 'mentor'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

