/**
 * Type definitions for CastQuest WebFront
 * 
 * These types define the structure of data used throughout the application.
 * They match the structure of data in web-content.json and provide type safety
 * for hooks, components, and API responses.
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
 * Web content structure that matches web-content.json
 */
export interface WebContent {
  frames: Frame[];
  quests: Quest[];
  media: Media[];
  stats: Stats;
}
