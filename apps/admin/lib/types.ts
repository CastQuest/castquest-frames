// Core entity types
export interface Frame {
  id: string;
  name: string;
  template: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  metadata: Record<string, any>;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'failed' | 'pending';
  frameId?: string;
  progress: number;
  totalSteps: number;
  reward?: {
    type: string;
    amount: number;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Mint {
  id: string;
  questId?: string;
  frameId?: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'claimed' | 'failed';
  claimStatus?: 'pending' | 'approved' | 'rejected';
  txHash?: string;
  createdAt: string;
  claimedAt?: string;
}

export interface Worker {
  id: string;
  name: string;
  type: 'processor' | 'validator' | 'notifier' | 'analytics' | 'cleanup';
  status: 'running' | 'idle' | 'error' | 'stopped';
  lastRun?: string;
  nextRun?: string;
  executionTime?: number;
  successRate?: number;
}

export interface Job {
  id: string;
  workerId: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  type: string;
  data: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface BrainEvent {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, any>;
  source: string;
}

export interface BrainSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected';
  impact: 'low' | 'medium' | 'high';
  createdAt: string;
  actionedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface SystemHealth {
  component: 'database' | 'api' | 'workers' | 'brain' | 'cache' | 'oracle' | 'websocket';
  status: 'ok' | 'warn' | 'error';
  message?: string;
  latency?: number;
  uptime?: number;
  lastCheck: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Permission types
export type Permission =
  | 'frames.view'
  | 'frames.create'
  | 'frames.edit'
  | 'frames.delete'
  | 'quests.view'
  | 'quests.manage'
  | 'quests.cancel'
  | 'mints.view'
  | 'mints.approve'
  | 'mints.process'
  | 'workers.view'
  | 'workers.control'
  | 'workers.configure'
  | 'brain.view'
  | 'brain.manage'
  | 'users.view'
  | 'users.manage'
  | 'users.delete'
  | 'system.view'
  | 'system.configure';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

// Stats and analytics types
export interface DashboardStats {
  frames: {
    total: number;
    active: number;
    draft: number;
  };
  quests: {
    total: number;
    active: number;
    pending: number;
    completed: number;
  };
  mints: {
    total: number;
    pending: number;
    completed: number;
    claimed: number;
  };
  workers: {
    total: number;
    active: number;
    idle: number;
    error: number;
  };
  brain: {
    events: number;
    suggestions: number;
    patterns: number;
  };
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'update' | 'notification' | 'error';
  payload: any;
  timestamp: string;
}
