/**
 * Type definitions for CastQuest Web Application
 * 
 * These types define the shape of data used throughout the application.
 * They are used by hooks, components, and API responses.
 */

/**
 * Frame represents a Farcaster frame with engagement metrics
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

/**
 * Quest represents a user quest with completion tracking
 */
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

/**
 * Media represents a media asset with metadata
 */
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

/**
 * Stats represents protocol-level statistics
 */
export interface Stats {
  totalFrames: number;
  liveFrames: number;
  activeQuests: number;
  totalParticipants: number;
  totalRewards: string;
  averageEngagement: string;
}

/**
 * WebContent represents the complete web content data structure
 */
export interface WebContent {
  frames: Frame[];
  quests: Quest[];
  media: Media[];
  stats: Stats;
}
