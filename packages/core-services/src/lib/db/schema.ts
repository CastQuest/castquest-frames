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
  riskLevel: text('risk_level'), // low, medium, high, critical
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

// ============================================================================
// Tenants Table (Multi-tenancy support)
// ============================================================================

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  status: text('status').notNull().default('active'), // active, suspended, archived
  settings: text('settings'), // JSON string for tenant-specific settings
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('tenants_slug_idx').on(table.slug),
  ownerIdx: index('tenants_owner_idx').on(table.ownerId),
  statusIdx: index('tenants_status_idx').on(table.status),
}));

// ============================================================================
// Frame Templates Table
// ============================================================================

export const frameTemplates = pgTable('frame_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // poll, game, nft, media, etc.
  thumbnailUrl: text('thumbnail_url'),
  price: decimal('price', { precision: 18, scale: 6 }), // in ETH or protocol token
  creatorId: uuid('creator_id').notNull().references(() => users.id),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  
  // Template data
  templateData: text('template_data').notNull(), // JSON string containing frame structure
  version: text('version').notNull().default('1.0.0'),
  
  // Stats
  downloadCount: integer('download_count').notNull().default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'), // 0.00 to 5.00
  ratingCount: integer('rating_count').notNull().default(0),
  
  // Status
  status: text('status').notNull().default('draft'), // draft, published, archived
  featured: boolean('featured').notNull().default(false),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('frame_templates_category_idx').on(table.category),
  creatorIdx: index('frame_templates_creator_idx').on(table.creatorId),
  tenantIdx: index('frame_templates_tenant_idx').on(table.tenantId),
  statusIdx: index('frame_templates_status_idx').on(table.status),
  featuredIdx: index('frame_templates_featured_idx').on(table.featured),
}));

// ============================================================================
// Quests Table
// ============================================================================

export const quests = pgTable('quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  difficulty: text('difficulty').notNull(), // easy, medium, hard, expert
  category: text('category').notNull(), // daily, weekly, special, tutorial
  
  // Rewards
  rewardType: text('reward_type').notNull(), // tokens, nft, badge, points
  rewardAmount: decimal('reward_amount', { precision: 18, scale: 6 }),
  rewardData: text('reward_data'), // JSON string for complex rewards
  
  // Quest configuration
  requirementType: text('requirement_type').notNull(), // frames_created, frames_viewed, social_engagement, etc.
  requirementData: text('requirement_data').notNull(), // JSON string with specific requirements
  
  // Stats and status
  participantCount: integer('participant_count').notNull().default(0),
  completionCount: integer('completion_count').notNull().default(0),
  status: text('status').notNull().default('active'), // active, paused, completed, archived
  
  // Timing
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  difficultyIdx: index('quests_difficulty_idx').on(table.difficulty),
  categoryIdx: index('quests_category_idx').on(table.category),
  statusIdx: index('quests_status_idx').on(table.status),
  dateIdx: index('quests_dates_idx').on(table.startDate, table.endDate),
}));

// ============================================================================
// Quest Progress Table
// ============================================================================

export const questProgress = pgTable('quest_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  questId: uuid('quest_id').notNull().references(() => quests.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Progress tracking
  progress: integer('progress').notNull().default(0), // percentage or step count
  progressData: text('progress_data'), // JSON string for detailed progress
  status: text('status').notNull().default('in_progress'), // not_started, in_progress, completed, failed
  
  // Timestamps
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  questUserIdx: uniqueIndex('quest_progress_quest_user_idx').on(table.questId, table.userId),
  userIdx: index('quest_progress_user_idx').on(table.userId),
  statusIdx: index('quest_progress_status_idx').on(table.status),
}));

// ============================================================================
// Leaderboard Entries Table
// ============================================================================

export const leaderboardEntries = pgTable('leaderboard_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Score data
  score: integer('score').notNull().default(0),
  rank: integer('rank'),
  previousRank: integer('previous_rank'),
  
  // Leaderboard type
  leaderboardType: text('leaderboard_type').notNull(), // global, weekly, monthly, quest-specific
  leaderboardId: text('leaderboard_id'), // for quest-specific or event leaderboards
  
  // Period tracking
  period: text('period').notNull(), // all-time, 2024-01, 2024-W01, etc.
  
  // Additional stats
  stats: text('stats'), // JSON string with detailed statistics
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userTypeIdx: uniqueIndex('leaderboard_user_type_period_idx').on(table.userId, table.leaderboardType, table.period),
  typeIdx: index('leaderboard_type_idx').on(table.leaderboardType),
  rankIdx: index('leaderboard_rank_idx').on(table.rank),
  periodIdx: index('leaderboard_period_idx').on(table.period),
}));

// ============================================================================
// Achievements Table
// ============================================================================

export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  category: text('category').notNull(), // creator, collector, social, quest, milestone
  
  // Requirements
  requirementType: text('requirement_type').notNull(),
  requirementData: text('requirement_data').notNull(), // JSON string
  
  // Rarity and points
  rarity: text('rarity').notNull(), // common, rare, epic, legendary
  points: integer('points').notNull().default(0),
  
  status: text('status').notNull().default('active'), // active, hidden, archived
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('achievements_category_idx').on(table.category),
  rarityIdx: index('achievements_rarity_idx').on(table.rarity),
}));

// ============================================================================
// User Achievements Table (Junction)
// ============================================================================

export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: uuid('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp('unlocked_at').notNull().defaultNow(),
  progress: integer('progress').default(0), // for progressive achievements
}, (table) => ({
  userAchievementIdx: uniqueIndex('user_achievements_user_achievement_idx').on(table.userId, table.achievementId),
  userIdx: index('user_achievements_user_idx').on(table.userId),
}));

// ============================================================================
// NFT Mints Table
// ============================================================================

export const nftMints = pgTable('nft_mints', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  frameId: text('frame_id'), // reference to a frame if applicable
  
  // NFT details
  contractAddress: text('contract_address').notNull(),
  tokenId: text('token_id').notNull(),
  chainId: integer('chain_id').notNull(), // 1 for Ethereum, 8453 for Base, etc.
  
  // Metadata
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  metadataUri: text('metadata_uri').notNull(),
  
  // Minting details
  mintPrice: decimal('mint_price', { precision: 18, scale: 6 }),
  mintCurrency: text('mint_currency'), // ETH, USDC, CAST, etc.
  
  // Status
  status: text('status').notNull().default('minting'), // minting, minted, failed, burned
  transactionHash: text('transaction_hash'),
  blockNumber: bigint('block_number', { mode: 'bigint' }),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  mintedAt: timestamp('minted_at'),
}, (table) => ({
  userIdx: index('nft_mints_user_idx').on(table.userId),
  contractTokenIdx: uniqueIndex('nft_mints_contract_token_idx').on(table.contractAddress, table.tokenId, table.chainId),
  statusIdx: index('nft_mints_status_idx').on(table.status),
  frameIdx: index('nft_mints_frame_idx').on(table.frameId),
}));

// ============================================================================
// Analytics Events Table
// ============================================================================

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  
  // Event details
  eventType: text('event_type').notNull(), // page_view, frame_view, frame_create, quest_start, etc.
  eventCategory: text('event_category').notNull(), // user_action, system, analytics
  
  // Event data
  resourceType: text('resource_type'), // frame, quest, template, nft, etc.
  resourceId: text('resource_id'),
  metadata: text('metadata'), // JSON string with event-specific data
  
  // Session tracking
  sessionId: text('session_id'),
  
  // Request metadata
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('analytics_events_user_idx').on(table.userId),
  typeIdx: index('analytics_events_type_idx').on(table.eventType),
  categoryIdx: index('analytics_events_category_idx').on(table.eventCategory),
  resourceIdx: index('analytics_events_resource_idx').on(table.resourceType, table.resourceId),
  timestampIdx: index('analytics_events_timestamp_idx').on(table.timestamp),
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

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type FrameTemplate = typeof frameTemplates.$inferSelect;
export type NewFrameTemplate = typeof frameTemplates.$inferInsert;

export type Quest = typeof quests.$inferSelect;
export type NewQuest = typeof quests.$inferInsert;

export type QuestProgress = typeof questProgress.$inferSelect;
export type NewQuestProgress = typeof questProgress.$inferInsert;

export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboardEntries.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;

export type NftMint = typeof nftMints.$inferSelect;
export type NewNftMint = typeof nftMints.$inferInsert;

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
