/**
 * Type definitions for CastQuest Web Application
 * 
 * These types ensure type safety across the application and provide
 * better IDE support and compile-time checks.
 */

/**
 * Frame represents a Farcaster Frame in the CastQuest protocol
 */
export interface Frame {
  id: string;
  title: string;
  description: string;
  mediaType: "image" | "video" | "interactive" | "audio";
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
 * Quest represents a challenge or task in the CastQuest protocol
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "beginner" | "intermediate" | "advanced";
  status: "active" | "upcoming" | "completed";
  reward: string;
  participants: number;
  completed: number;
  steps: number;
  estimatedTime: string;
  tags: string[];
}

/**
 * Media represents a media asset in the CastQuest protocol
 */
export interface Media {
  id: string;
  title: string;
  type: "video" | "interactive" | "image-gallery" | "audio";
  url: string;
  thumbnail: string;
  duration?: string;
  views: number;
  tags: string[];
}

/**
 * Stats represents protocol-wide statistics
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
 * WebContent represents the complete structure of web-content.json
 */
export interface WebContent {
  frames: Frame[];
  quests: Quest[];
  media: Media[];
  stats: Stats;
}
