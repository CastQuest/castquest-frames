import { bigint, boolean, decimal, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

// ============================================================================
// Users Table
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  passwordHash: text('password_hash'),
  status: text('status').notNull().default('pending'), // pending, active, suspended, banned
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  statusIdx: index('users_status_idx').on(table.status),
}));

// ============================================================================
// Verification Tokens
// ============================================================================

export const verificationTokens = pgTable('verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: text('token').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // email_verification, password_reset
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  tokenIdx: uniqueIndex('verification_tokens_token_idx').on(table.token),
  userIdx: index('verification_tokens_user_idx').on(table.userId),
}));

// ============================================================================
// Wallets Table
// ============================================================================

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  address: text('address').notNull(),
  type: text('type').notNull(), // eoa, smart_wallet, multisig
  label: text('label'),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastUsedAt: timestamp('last_used_at'),
}, (table) => ({
  addressIdx: uniqueIndex('wallets_address_idx').on(table.address),
  userIdx: index('wallets_user_idx').on(table.userId),
}));

// ============================================================================
// Media Metadata Table
// ============================================================================

export const mediaMetadata = pgTable('media_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  mediaId: text('media_id').notNull().unique(),
  tokenAddress: text('token_address').notNull().unique(),
  ownerAddress: text('owner_address').notNull(),
  creatorUserId: uuid('creator_user_id').references(() => users.id),
  
  // Token details
  ticker: text('ticker').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  
  // Media details
  mediaType: text('media_type').notNull(), // image, video, audio, text
  mediaUrl: text('media_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  metadataUri: text('metadata_uri').notNull(),
  
  // Status and risk
  status: text('status').notNull().default('active'), // pending, active, flagged, banned
  riskScore: integer('risk_score').notNull().default(0),
  riskFlags: text('risk_flags').array().notNull().default([]),
  
  // Market data cache
  currentPrice: decimal('current_price', { precision: 78, scale: 0 }),
  marketCap: decimal('market_cap', { precision: 78, scale: 0 }),
  totalSupply: decimal('total_supply', { precision: 78, scale: 0 }),
  
  // Blockchain data
  blockNumber: bigint('block_number', { mode: 'bigint' }).notNull(),
  transactionHash: text('transaction_hash').notNull(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  tokenAddressIdx: uniqueIndex('media_token_address_idx').on(table.tokenAddress),
  ownerIdx: index('media_owner_idx').on(table.ownerAddress),
  tickerIdx: index('media_ticker_idx').on(table.ticker),
  statusIdx: index('media_status_idx').on(table.status),
  creatorIdx: index('media_creator_idx').on(table.creatorUserId),
}));

// ============================================================================
// Market Signals Table
// ============================================================================

export const marketSignals = pgTable('market_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenAddress: text('token_address').notNull().unique(),
  
  // Price data
  currentPrice: decimal('current_price', { precision: 78, scale: 0 }).notNull(),
  previousPrice: decimal('previous_price', { precision: 78, scale: 0 }).notNull(),
  priceChange24h: decimal('price_change_24h', { precision: 78, scale: 0 }).notNull(),
  priceChangePercent24h: decimal('price_change_percent_24h', { precision: 10, scale: 2 }).notNull(),
  
  // Volume
  volume24h: decimal('volume_24h', { precision: 78, scale: 0 }).notNull(),
  volumeChange24h: decimal('volume_change_24h', { precision: 10, scale: 2 }).notNull(),
  
  // Trading
  trades24h: integer('trades_24h').notNull(),
  uniqueBuyers24h: integer('unique_buyers_24h').notNull(),
  uniqueSellers24h: integer('unique_sellers_24h').notNull(),
  
  // Holders
  holderCount: integer('holder_count').notNull(),
  holderChange24h: integer('holder_change_24h').notNull(),
  
  // Status
  status: text('status').notNull(), // green, red, neutral
  
  // Timestamps
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  dataWindowStart: timestamp('data_window_start').notNull(),
  dataWindowEnd: timestamp('data_window_end').notNull(),
}, (table) => ({
  tokenAddressIdx: uniqueIndex('market_signals_token_idx').on(table.tokenAddress),
  statusIdx: index('market_signals_status_idx').on(table.status),
}));

// ============================================================================
// Price Points Table (time series)
// ============================================================================

export const pricePoints = pgTable('price_points', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenAddress: text('token_address').notNull(),
  price: decimal('price', { precision: 78, scale: 0 }).notNull(),
  volume: decimal('volume', { precision: 78, scale: 0 }).notNull(),
  blockNumber: bigint('block_number', { mode: 'bigint' }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
}, (table) => ({
  tokenTimestampIdx: index('price_points_token_timestamp_idx').on(table.tokenAddress, table.timestamp),
}));

// ============================================================================
// Trades Table
// ============================================================================

export const trades = pgTable('trades', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenAddress: text('token_address').notNull(),
  buyer: text('buyer').notNull(),
  seller: text('seller').notNull(),
  amount: decimal('amount', { precision: 78, scale: 0 }).notNull(),
  price: decimal('price', { precision: 78, scale: 0 }).notNull(),
  totalValue: decimal('total_value', { precision: 78, scale: 0 }).notNull(),
  protocolFee: decimal('protocol_fee', { precision: 78, scale: 0 }).notNull(),
  type: text('type').notNull(), // buy, sell
  blockNumber: bigint('block_number', { mode: 'bigint' }).notNull(),
  transactionHash: text('transaction_hash').notNull(),
  timestamp: timestamp('timestamp').notNull(),
}, (table) => ({
  tokenIdx: index('trades_token_idx').on(table.tokenAddress),
  buyerIdx: index('trades_buyer_idx').on(table.buyer),
  sellerIdx: index('trades_seller_idx').on(table.seller),
  timestampIdx: index('trades_timestamp_idx').on(table.timestamp),
  txHashIdx: index('trades_tx_hash_idx').on(table.transactionHash),
}));

// ============================================================================
// Risk Assessments Table
// ============================================================================

export const riskAssessments = pgTable('risk_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenAddress: text('token_address').notNull(),
  riskScore: integer('risk_score').notNull(),
  confidence: integer('confidence').notNull(),
  flags: text('flags').array().notNull(),
  reasons: text('reasons').array().notNull(),
  assessedBy: text('assessed_by').notNull(), // ai, moderator, community
  assessedAt: timestamp('assessed_at').notNull().defaultNow(),
}, (table) => ({
  tokenIdx: index('risk_assessments_token_idx').on(table.tokenAddress),
  assessedAtIdx: index('risk_assessments_assessed_at_idx').on(table.assessedAt),
}));

// ============================================================================
// Audit Logs Table
// ============================================================================

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resource_id'),
  metadata: text('metadata'), // JSON string
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('audit_logs_user_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  timestampIdx: index('audit_logs_timestamp_idx').on(table.timestamp),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;

export type MediaMetadata = typeof mediaMetadata.$inferSelect;
export type NewMediaMetadata = typeof mediaMetadata.$inferInsert;

export type MarketSignal = typeof marketSignals.$inferSelect;
export type NewMarketSignal = typeof marketSignals.$inferInsert;

export type Trade = typeof trades.$inferSelect;
export type NewTrade = typeof trades.$inferInsert;
