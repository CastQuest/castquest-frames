/**
 * CastQuest Core Services - Domain Models
 * Shared types across all services and consumers
 */

// ============================================================================
// User Domain
// ============================================================================

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserSession {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface VerificationToken {
  token: string;
  userId: string;
  type: 'email_verification' | 'password_reset';
  expiresAt: Date;
}

// ============================================================================
// Wallet Domain
// ============================================================================

export enum WalletType {
  EOA = 'eoa',
  SMART_WALLET = 'smart_wallet',
  MULTISIG = 'multisig'
}

export interface Wallet {
  id: string;
  userId: string;
  address: string; // EVM address
  type: WalletType;
  label?: string; // User-provided label
  isPrimary: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}

// ============================================================================
// Media & Token Domain
// ============================================================================

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text'
}

export enum TokenStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FLAGGED = 'flagged',
  BANNED = 'banned'
}

export interface MediaMetadata {
  mediaId: string;
  tokenAddress: string;
  ownerAddress: string;
  creatorUserId?: string;
  
  // Token details
  ticker: string;
  name: string;
  description: string;
  
  // Media details
  mediaType: MediaType;
  mediaUrl: string; // IPFS or CDN URL
  thumbnailUrl?: string;
  metadataUri: string; // Full metadata JSON URI
  
  // Status and risk
  status: TokenStatus;
  riskScore: number; // 0-100
  riskFlags: string[]; // ['nsfw', 'spam', 'copyright', etc]
  
  // Market data (cached)
  currentPrice?: string;
  marketCap?: string;
  totalSupply?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  blockNumber: bigint;
  transactionHash: string;
}

// ============================================================================
// Market Domain
// ============================================================================

export enum MarketStatus {
  GREEN = 'green',   // Price up > 10%
  RED = 'red',       // Price down > 10%
  NEUTRAL = 'neutral' // Within ±10%
}

export interface MarketSignal {
  tokenAddress: string;
  
  // Price data
  currentPrice: string;
  previousPrice: string;
  priceChange24h: string;
  priceChangePercent24h: number;
  
  // Volume
  volume24h: string;
  volumeChange24h: number;
  
  // Trading
  trades24h: number;
  uniqueBuyers24h: number;
  uniqueSellers24h: number;
  
  // Holders
  holderCount: number;
  holderChange24h: number;
  
  // Status
  status: MarketStatus;
  
  // Timestamps
  lastUpdated: Date;
  dataWindowStart: Date;
  dataWindowEnd: Date;
}

export interface PricePoint {
  tokenAddress: string;
  price: string;
  timestamp: Date;
  blockNumber: bigint;
  volume: string;
}

export interface Trade {
  id: string;
  tokenAddress: string;
  buyer: string;
  seller: string;
  amount: string;
  price: string;
  totalValue: string;
  protocolFee: string;
  type: 'buy' | 'sell';
  timestamp: Date;
  blockNumber: bigint;
  transactionHash: string;
}

// ============================================================================
// Risk & Abuse Domain
// ============================================================================

export type RiskFlag = 
  | 'WASH_TRADING'
  | 'PUMP_AND_DUMP'
  | 'LOW_LIQUIDITY'
  | 'SUSPICIOUS_VOLUME'
  | 'PRICE_MANIPULATION'
  | 'SPAM_TOKEN'
  | 'RUG_PULL_RISK'
  | 'HONEYPOT'
  | 'HIGH_CONCENTRATION'
  | 'nsfw'
  | 'spam'
  | 'copyright'
  | 'scam'
  | 'duplicate'
  | 'low_quality';

export interface RiskAssessment {
  id?: string;
  tokenAddress: string;
  riskScore: number; // 0-100
  confidence: number; // 0-100
  flags: string[]; // Array of RiskFlag strings
  reasons: string[];
  riskLevel?: 'low' | 'medium' | 'high' | 'critical' | null;
  assessedAt: Date;
  assessedBy: 'ai' | 'moderator' | 'community';
}

export interface RateLimit {
  identifier: string; // IP or userId
  endpoint: string;
  requestCount: number;
  windowStart: Date;
  windowEnd: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}

// ============================================================================
// Event Types (for blockchain ingestion)
// ============================================================================

export interface BlockchainEvent {
  eventName: string;
  contractAddress: string;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
  args: Record<string, any>;
  timestamp: Date;
}

export interface TokenCreatedEvent extends BlockchainEvent {
  eventName: 'TokenCreated';
  args: {
    tokenAddress: string;
    creator: string;
    ticker: string;
    name: string;
    initialSupply: bigint;
  };
}

export interface TradeEvent extends BlockchainEvent {
  eventName: 'Trade';
  args: {
    tokenAddress: string;
    buyer: string;
    seller: string;
    amount: bigint;
    price: bigint;
    fee: bigint;
  };
}
