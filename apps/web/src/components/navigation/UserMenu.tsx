'use client';

import { LogOut, Settings, User } from 'lucide-react';
import * as React from 'react';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@todoai/ui';
import type { User as UserType } from '@todoai/types';

export interface UserMenuProps {
  user: UserType;
  onLogout: () => void;
  className?: string;
}

export function UserMenu({ user, onLogout, className }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-3 ${className || ''}`}>
          <Avatar
            alt={user.name || 'User'}
            fallback={user.name || 'U'}
            size="md"
          />
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

