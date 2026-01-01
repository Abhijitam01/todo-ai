'use client';

import { Home, Calendar, Target, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@todoai/ui';

export interface MobileNavProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  navItems?: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  className?: string;
}

const defaultNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/today', label: 'Today', icon: Calendar },
  { href: '/goals', label: 'Goals', icon: Target },
];

export function MobileNav({
  open,
  onOpenChange,
  navItems = defaultNavItems,
  className,
}: MobileNavProps) {
  const pathname = usePathname();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isActive ? '' : 'text-slate-400'}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

