/**
 * CastQuest Frames - Shared Types
 * Type definitions for frame data and API responses
 */

export interface MarketSignal {
  tokenAddress: string;
  ticker: string;
  name: string;
  currentPrice: string; // wei/ETH
  priceChange24h: string; // percentage as string (e.g., "5.25" or "-3.14")
  volume24h: string;
  marketCap?: string;
  holders?: number;
  status: 'green' | 'red' | 'neutral';
}

export interface TokenMetrics {
  tokenAddress: string;
  ticker: string;
  name: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  
  // Price data
  currentPrice: string;
  priceChange24h: string;
  priceChange7d?: string;
  
  // Volume data
  volume24h: string;
  volume7d?: string;
  
  // Market data
  marketCap: string;
  totalSupply: string;
  circulatingSupply?: string;
  holders: number;
  
  // Trading data
  liquidity: string;
  transactions24h?: number;
  
  // Status
  riskFlags: string[];
  status: 'active' | 'flagged' | 'banned';
}

export interface CASTProtocolStats {
  price: string;
  marketCap: string;
  totalSupply: string;
  holders: number;
  
  // Protocol fees
  totalFeesCollected: string;
  fees24h: string;
  
  // Activity
  activeTokens: number;
  totalVolume24h: string;
}

export interface FrameMetadata {
  title: string;
  image: string;
  buttons: FrameButton[];
  postUrl?: string;
  aspectRatio?: '1.91:1' | '1:1';
}

export interface FrameButton {
  label: string;
  action: 'post' | 'post_redirect' | 'link' | 'mint';
  target?: string;
  post_url?: string;
}

export interface FrameRequest {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export interface FrameResponse {
  image: string;
  imageAspectRatio?: '1.91:1' | '1:1';
  buttons?: FrameButton[];
  postUrl?: string;
  input?: {
    text: string;
  };
  state?: Record<string, unknown>;
}
