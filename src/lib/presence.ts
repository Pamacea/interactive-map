/**
 * Polling-based real-time collaboration utilities
 * Uses TanStack Query instead of WebSocket for simplicity
 */

export enum CollaborationEventType {
  PIN_CREATED = 'PIN_CREATED',
  PIN_UPDATED = 'PIN_UPDATED',
  PIN_DELETED = 'PIN_DELETED',
  PIN_MOVED = 'PIN_MOVED',
  LAYER_CREATED = 'LAYER_CREATED',
  LAYER_UPDATED = 'LAYER_UPDATED',
  LAYER_DELETED = 'LAYER_DELETED',
  LAYER_VISIBILITY_CHANGED = 'LAYER_VISIBILITY_CHANGED',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  SELECTION_CHANGED = 'SELECTION_CHANGED',
}

export interface PresenceData {
  userId: string;
  userName: string;
  userImage?: string | null;
  cursorX?: number;
  cursorY?: number;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  selectedPinId?: string | null;
}

export type PresenceUsers = Record<string, PresenceData>;

// Polling intervals (in milliseconds)
export const PRESENCE_POLL_INTERVAL = 5000; // 5 seconds for presence
export const CURSOR_POLL_INTERVAL = 1000; // 1 second for cursor updates
export const HEARTBEAT_INTERVAL = 30000; // 30 seconds to keep presence alive
