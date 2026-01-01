import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

import type { WSEvent, WSPlanGeneratedEvent, WSTasksGeneratedEvent, WSMentorFeedbackEvent } from '@todoai/types';

interface WebSocketState {
  socket: Socket | null;
  isConnected: boolean;
  lastEvent: WSEvent | null;
  pendingPlanGoals: Set<string>;
  
  connect: (token: string) => void;
  disconnect: () => void;
  subscribeToGoal: (goalId: string) => void;
  unsubscribeFromGoal: (goalId: string) => void;
  addPendingPlanGoal: (goalId: string) => void;
  removePendingPlanGoal: (goalId: string) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  lastEvent: null,
  pendingPlanGoals: new Set(),

  connect: (token) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    
    const socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      set({ isConnected: true });
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('WebSocket disconnected');
    });

    socket.on('plan_generated', (event: WSPlanGeneratedEvent) => {
      set({ lastEvent: event });
      get().removePendingPlanGoal(event.payload.goalId);
    });

    socket.on('tasks_generated', (event: WSTasksGeneratedEvent) => {
      set({ lastEvent: event });
    });

    socket.on('mentor_feedback', (event: WSMentorFeedbackEvent) => {
      set({ lastEvent: event });
    });

    socket.on('error', (event: WSEvent) => {
      console.error('WebSocket error:', event);
      set({ lastEvent: event });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  subscribeToGoal: (goalId) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('subscribe:goal', { goalId });
    }
  },

  unsubscribeFromGoal: (goalId) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('unsubscribe:goal', { goalId });
    }
  },

  addPendingPlanGoal: (goalId) => {
    set((state) => ({
      pendingPlanGoals: new Set(state.pendingPlanGoals).add(goalId),
    }));
  },

  removePendingPlanGoal: (goalId) => {
    set((state) => {
      const newSet = new Set(state.pendingPlanGoals);
      newSet.delete(goalId);
      return { pendingPlanGoals: newSet };
    });
  },
}));

