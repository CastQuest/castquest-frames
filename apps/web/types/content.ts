/**
 * Type definitions for web content data structures
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

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "easy" | "intermediate" | "advanced";
  status: "active" | "upcoming";
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
  type: "video" | "interactive" | "image-gallery";
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

export interface WebContent {
  frames: Frame[];
  quests: Quest[];
  media: Media[];
  stats: Stats;
}
