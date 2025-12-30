/**
 * Type definitions for CastQuest WebFront data structures
 */

/**
 * Frame data structure
 * Represents a Farcaster Frame with associated metadata
 */
export interface Frame {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'interactive' | 'audio';
  mediaUrl: string;
  status: 'live' | 'active' | 'draft';
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
 * Quest data structure
 * Represents a gamified quest/challenge
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'easy' | 'intermediate' | 'advanced';
  status: 'active' | 'upcoming' | 'completed';
  reward: string;
  participants: number;
  completed: number;
  steps: number;
  estimatedTime: string;
  tags: string[];
}

/**
 * Media data structure
 * Represents media content in the platform
 */
export interface Media {
  id: string;
  title: string;
  type: 'video' | 'interactive' | 'image-gallery' | 'audio';
  url: string;
  thumbnail: string;
  duration?: string;
  views: number;
  tags: string[];
}

/**
 * Stats data structure
 * Represents platform-wide statistics
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
 * Web content structure
 * Complete data structure for web-content.json
 */
export interface WebContent {
  frames: Frame[];
  quests: Quest[];
  media: Media[];
  stats: Stats;
}
