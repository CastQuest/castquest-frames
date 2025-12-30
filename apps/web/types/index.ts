/**
 * Shared TypeScript type definitions for CastQuest WebFront
 * 
 * These types match the data structure from web-content.json
 * and are used across hooks, components, and pages.
 */

export interface Frame {
  id: string;
  title: string;
  description: string;
  mediaType: string;
  mediaUrl: string;
  status: "live" | "active" | "draft";
  casts: number;
  recasts: number;
  likes: number;
  tokenTicker: string;
  tokenPrice: string;
  tags: string[];
  integrations: string[];
  createdAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "easy" | "intermediate" | "advanced";
  status: "active" | "upcoming" | "completed";
  reward: string;
  participants: number;
  completed: number;
  steps: number;
  estimatedTime: string;
  tags: string[];
}

export interface Media {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnail: string;
  duration?: string;
  views: number;
  tags: string[];
}

export interface Stats {
  totalFrames: number;
  liveFrames: number;
  activeQuests: number;
  totalParticipants: number;
  totalRewards: string;
  averageEngagement: string;
}

/**
 * Web content data structure
 * Represents the complete structure of web-content.json
 */
export interface WebContent {
  frames: Frame[];
  quests: Quest[];
  media: Media[];
  stats: Stats;
}
