'use client';

import { Bell } from 'lucide-react';
import * as React from 'react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@todoai/ui';
import type { Notification } from '@todoai/types';

import { EmptyState } from '../shared/EmptyState';

export interface NotificationDropdownProps {
  notifications?: Notification[];
  unreadCount?: number;
  onMarkRead?: (notificationId: string) => void;
  onClick?: (notification: Notification) => void;
  className?: string;
}

export function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onClick,
  className,
}: NotificationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative text-slate-400 hover:text-white ${className || ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No notifications"
                description="You're all caught up!"
              />
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors ${
                    !notification.readAt ? 'bg-slate-700/50' : ''
                  }`}
                  onClick={() => {
                    onClick?.(notification);
                    if (!notification.readAt) {
                      onMarkRead?.(notification.id);
                    }
                  }}
                >
                  <CardContent className="p-3">
                    <p className="text-sm font-medium text-white">
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-xs text-slate-400 mt-1">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

