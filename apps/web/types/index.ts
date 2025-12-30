/**
 * Type definitions for CastQuest web application data structures
 */

/**
 * Frame data structure representing a Farcaster frame
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
 * Quest data structure representing a challenge or task
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "easy" | "intermediate" | "advanced";
  status: "active" | "upcoming" | "completed" | "expired";
  reward: string;
  participants: number;
  completed: number;
  steps: number;
  estimatedTime: string;
  tags: string[];
}

/**
 * Media item data structure
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
 * Protocol statistics
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
 * Web content data structure from JSON
 */
export interface WebContent {
  frames: Frame[];
  quests: Quest[];
  media: Media[];
  stats: Stats;
}
